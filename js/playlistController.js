/**
 * playlistController.js
 * PlaylistController — coordinates all application events and state.
 * Sits between the Playlist data model and the UI renderer.
 */

import { $ }              from './modules/DOMHelpers.js';
import { SessionService } from './modules/SessionService.js';

/* ── UI state persistence ───────────────────────────────────
   Saves search query, sort key, and sort direction to localStorage.
   Restored on page load; falls back to defaults when absent.
   Key: fds_ui_state
   Schema: { searchQuery, sortKey, sortDir }
──────────────────────────────────────────────────────────── */
const UI_STATE_KEY = 'fds_ui_state';

function loadUIState() {
  try {
    const raw = localStorage.getItem(UI_STATE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUIState(state) {
  try {
    localStorage.setItem(UI_STATE_KEY, JSON.stringify(state));
  } catch { /* fail silently */ }
}

function clearUIState() {
  localStorage.removeItem(UI_STATE_KEY);
}

export class PlaylistController {
  /**
   * @param {import('./modules/Playlist.js').Playlist} playlist
   * @param {import('./ui.js').UI} ui
   */
  constructor(playlist, ui) {
    this.playlist = playlist;
    this.ui       = ui;

    // ── Audio engine ────────────────────────────────────
    this.audio = $('audioEngine');

    // ── Session (persistence + media keys) ──────────────
    this.session = new SessionService(this.audio);

    // ── Player state ────────────────────────────────────
    this.currentIndex = null;   // real index into playlist.songs
    this.isPlaying    = false;
    this.shuffleMode  = false;
    this.repeatMode   = false;  // false | 'one' | 'all'
    this._repeatPos   = 0;      // cycles 0→1→2→0

    // ── Search + sort state ─────────────────────────────
    this.searchQuery = '';
    this.sortKey     = null;    // null | 'title' | 'artist'
    this.sortDir     = 'asc';  // 'asc' | 'desc'

    // ── Active queue ─────────────────────────────────────
    // Always mirrors the currently visible (filtered + sorted) song list.
    // Navigation (next/prev/auto-advance) walks this array, not the master
    // playlist, so what you see is exactly what plays in order.
    this.activeQueue = [];  // Song[]
  }

  /** Wire up all event listeners and do the initial render. */
  init() {
    this._bindAudioEvents();
    this._bindTransportEvents();
    this._bindSearchEvents();
    this._bindSortEvents();
    this._bindShareButton();

    this.ui.initCoverPhoto();
    this.ui.initScrollFade();

    this.playlist.buildShuffleOrder();

    // Restore saved search/sort state before first render
    this._restoreUIState();
    this._render();

    // ── Session persistence ──────────────────────────────
    this.session.startPersisting(() => this.currentIndex);

    // ── OS media controls (keyboard keys, lock screen, etc.) ──
    this.session.registerMediaSession({
      onPlay:   () => {
        if (this.audio.src && this.audio.src !== window.location.href) {
          this.audio.play().catch(() => {});
          // isPlaying updated by native 'play' listener
        }
      },
      onPause:  () => { this.audio.pause(); /* 'pause' listener handles state */ },
      onNext:   () => this._goNext(),
      onPrev:   () => this._goPrev(),
      onSeekTo: (t) => { this.audio.currentTime = t; },
    });

    // ── Restore last session ─────────────────────────────
    this._restoreSession();
  }

  /* ══════════════════════════════════════════════════════
     PUBLIC: called by main.js after durations load
  ══════════════════════════════════════════════════════ */

  /**
   * Called by DataService after a single song's duration is resolved.
   * Updates the duration cell and re-renders the footer stats.
   * @param {import('./modules/Song.js').Song} song
   */
  onDurationLoaded(song) {
    const realIndex = this.playlist.indexOf(song);
    this.ui.updateDurationCell(realIndex, song.realDuration);
    this._renderFooter();

    // If this is the currently-playing track, also update the player bar
    if (realIndex === this.currentIndex) {
      this.ui.restoreDuration(song, this.audio);
    }
  }

  /* ══════════════════════════════════════════════════════
     PRIVATE: rendering
  ══════════════════════════════════════════════════════ */

  _render() {
    const visible = this.playlist.getVisibleSongs(this.searchQuery, this.sortKey, this.sortDir);

    // Keep activeQueue in sync with exactly what's on screen.
    // All navigation (next/prev/auto-advance/shuffle) reads from this.
    this.activeQueue = visible;

    this.ui.renderTrackList(visible, this.playlist, this.searchQuery, idx => this._selectTrack(idx), this.currentIndex);
    this._renderFooter();
  }

  _renderFooter() {
    const visible = this.playlist.getVisibleSongs(this.searchQuery, this.sortKey, this.sortDir);
    this.ui.renderFooter(visible, this.playlist.songs);
  }

  /* ══════════════════════════════════════════════════════
     PRIVATE: track selection + playback
  ══════════════════════════════════════════════════════ */

  /**
   * Select and play a track by its real playlist index.
   * @param {number} index
   * @param {number} [startTime=0] - seek to this position after load
   * @param {boolean} [autoplay=true] - whether to start playing immediately
   */
  _selectTrack(index, startTime = 0, autoplay = true) {
    const song = this.playlist.songs[index];

    this.ui.highlightActiveRow(index);
    this.ui.showPlayerBar(song);
    this.session.updateMediaMetadata(song);

    this.currentIndex = index;

    if (song.hasAudio) {
      this.audio.src = song.audio;
      this.audio.load();

      // Seek to restored position once metadata is available
      if (startTime > 0) {
        const onMeta = () => {
          this.audio.currentTime = startTime;
          this.audio.removeEventListener('loadedmetadata', onMeta);
        };
        this.audio.addEventListener('loadedmetadata', onMeta);
      }

      if (autoplay) {
        this.audio.play()
          .then(() => this._setPlaying(true))
          .catch(e => {
            console.warn('Autoplay blocked:', e.message);
            this._setPlaying(false);
          });
      } else {
        this._setPlaying(false);
      }
    } else {
      this.audio.pause();
      this.audio.src = '';
      this._setPlaying(false);
      if (song.realDuration) {
        this.ui.restoreDuration(song, this.audio);
      }
    }
  }

  /** @param {boolean} playing */
  _setPlaying(playing) {
    this.isPlaying = playing;
    this.ui.setPlayingState(playing);
  }

  /**
   * Real playlist index of the next song to play.
   * Wraps around to the first queue track at the end.
   * Respects the active queue (filtered/sorted view) and shuffle mode.
   */
  _nextTrackIndex() {
    if (this.shuffleMode) return this.playlist.nextShuffleIndex(this.currentIndex);

    if (!this.activeQueue.length) return null;
    const pos = this.activeQueue.findIndex(s => this.playlist.indexOf(s) === this.currentIndex);
    if (pos === -1) {
      // Current track filtered out — jump to queue start
      return this.playlist.indexOf(this.activeQueue[0]);
    }
    // Wrap: last track → first track
    const next = (pos + 1) % this.activeQueue.length;
    return this.playlist.indexOf(this.activeQueue[next]);
  }

  /**
   * Real playlist index of the previous song to play.
   * Wraps around to the last queue track at the start.
   * Respects the active queue (filtered/sorted view) and shuffle mode.
   */
  _prevTrackIndex() {
    if (this.shuffleMode) return this.playlist.prevShuffleIndex(this.currentIndex);

    if (!this.activeQueue.length) return null;
    const pos = this.activeQueue.findIndex(s => this.playlist.indexOf(s) === this.currentIndex);
    if (pos === -1) {
      return this.playlist.indexOf(this.activeQueue[0]);
    }
    // Wrap: first track → last track
    const prev = (pos - 1 + this.activeQueue.length) % this.activeQueue.length;
    return this.playlist.indexOf(this.activeQueue[prev]);
  }

  _goNext() {
    if (this.currentIndex === null) {
      const first = this.activeQueue[0];
      if (first) this._selectTrack(this.playlist.indexOf(first));
      return;
    }
    const next = this._nextTrackIndex();
    if (next !== null) this._selectTrack(next);
  }

  _goPrev() {
    if (this.currentIndex === null) {
      const first = this.activeQueue[0];
      if (first) this._selectTrack(this.playlist.indexOf(first));
      return;
    }
    if (this.audio.currentTime > 3) { this.audio.currentTime = 0; return; }
    const prev = this._prevTrackIndex();
    if (prev !== null) this._selectTrack(prev);
  }

  /* ══════════════════════════════════════════════════════
     PRIVATE: audio event bindings
  ══════════════════════════════════════════════════════ */

  _bindAudioEvents() {
    const { audio, ui } = this;

    audio.addEventListener('timeupdate', () => ui.syncProgress(audio));

    audio.addEventListener('loadedmetadata', () => {
      ui.syncDuration(audio);
      // Also update the track row duration cell
      if (this.currentIndex !== null) {
        ui.updateDurationCell(this.currentIndex, audio.duration);
      }
    });

    // ── Sync UI whenever the browser pauses/plays for ANY reason ──
    // This catches: OS media controls, YouTube stealing audio focus,
    // phone call interruptions, headphone unplugging, etc.
    audio.addEventListener('pause', () => {
      if (this.isPlaying) this._setPlaying(false);
    });

    audio.addEventListener('play', () => {
      if (!this.isPlaying) this._setPlaying(true);
    });

    audio.addEventListener('ended', () => {
      this._setPlaying(false);
      ui.resetProgress();

      if (this.repeatMode === 'one') {
        ui.restoreDuration(this.playlist.songs[this.currentIndex], audio);
        audio.currentTime = 0;
        audio.play()
          .then(() => this._setPlaying(true))
          .catch(() => {});

      } else if (this.repeatMode === 'all') {
        // Wraps automatically via _nextTrackIndex()
        const next = this._nextTrackIndex();
        if (next !== null) this._selectTrack(next);

      } else {
        // No repeat — auto-advance only if there is a next track in the queue.
        // At the last track, _nextTrackIndex() wraps back to index 0 of the queue,
        // which would be less than currentIndex — so we stop there instead of looping.
        const next = this._nextTrackIndex();
        const nextPos = next !== null
          ? this.activeQueue.findIndex(s => this.playlist.indexOf(s) === next)
          : -1;
        const curPos = this.activeQueue.findIndex(s => this.playlist.indexOf(s) === this.currentIndex);
        if (next !== null && nextPos > curPos) this._selectTrack(next);
        // else: last track finished, stay stopped
      }
    });

    // Progress bar seek
    ui.progressBar.addEventListener('input', () => {
      if (!audio.duration) return;
      audio.currentTime = (ui.progressBar.value / 100) * audio.duration;
    });

    // Mini-player play/pause button
    ui.btnPlay.addEventListener('click', () => {
      if (!audio.src || audio.src === window.location.href) return;
      if (this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      // Note: isPlaying state is updated by the pause/play listeners above
    });
  }

  /* ══════════════════════════════════════════════════════
     PRIVATE: restore UI state (search + sort) from localStorage
  ══════════════════════════════════════════════════════ */

  /**
   * Reads any previously saved search/sort state and applies it to
   * the controller properties AND the visible UI controls.
   * Falls back to clean defaults when no saved state exists.
   */
  _restoreUIState() {
    const saved = loadUIState();
    if (!saved) return;

    // Restore search query
    if (saved.searchQuery) {
      this.searchQuery = saved.searchQuery;
      if (this.ui.searchInput) {
        this.ui.searchInput.value = saved.searchQuery;
        this.ui.setClearButtonVisible(true);
      }
    }

    // Restore sort
    if (saved.sortKey) {
      this.sortKey = saved.sortKey;
      this.sortDir = saved.sortDir ?? 'asc';
      this.ui.updateSortButtons(this.sortKey, this.sortDir);
    }
  }

  /* ══════════════════════════════════════════════════════
     PRIVATE: restore last session from localStorage
  ══════════════════════════════════════════════════════ */

  /**
   * Reads saved session and restores the track + seek position.
   * Autoplay is intentionally skipped — browsers block it without a user gesture.
   * The player bar is shown in paused state so the user can resume with one click.
   */
  _restoreSession() {
    const saved = this.session.restore();
    if (!saved) return;

    const { index, time, paused } = saved;
    if (index < 0 || index >= this.playlist.songCount) return;

    // Load the track in paused state at the saved position
    this._selectTrack(index, time, false);

    // Show a subtle toast so the user knows their session was restored
    this.ui.showToast(`↩ Resumed: ${this.playlist.songs[index].name}`);
  }

  /* ══════════════════════════════════════════════════════
     PRIVATE: transport control bindings
  ══════════════════════════════════════════════════════ */

  _bindTransportEvents() {
    const { ui } = this;

    // Transport Play / Pause
    ui.btnTransportPlay.addEventListener('click', () => {
      if (this.isPlaying) {
        this.audio.pause();
        // isPlaying updated by native 'pause' listener
      } else if (this.audio.src && this.audio.src !== window.location.href) {
        this.audio.play().catch(() => {});
        // isPlaying updated by native 'play' listener
      } else {
        // Nothing loaded yet — start from the first visible track
        const first = this.activeQueue[0];
        if (first) this._selectTrack(this.playlist.indexOf(first));
      }
    });

    ui.btnNext.addEventListener('click', () => this._goNext());
    ui.btnBack.addEventListener('click', () => this._goPrev());

    // Shuffle
    ui.btnShuffle.addEventListener('click', () => {
      this.shuffleMode = !this.shuffleMode;
      ui.setShuffleActive(this.shuffleMode);
      if (this.shuffleMode) this.playlist.buildShuffleOrder();
      ui.showToast(this.shuffleMode ? '🔀 Shuffle on' : '🔀 Shuffle off');
    });

    // Repeat (cycles: off → one → all → off)
    ui.btnRepeat.addEventListener('click', () => {
      this._repeatPos  = (this._repeatPos + 1) % 3;
      const modes      = [false, 'one', 'all'];
      const labels     = ['🔁 Repeat off', '🔂 Repeat one', '🔁 Repeat all'];
      this.repeatMode  = modes[this._repeatPos];
      ui.setRepeatMode(this.repeatMode);
      ui.showToast(labels[this._repeatPos]);
    });
  }

  /* ══════════════════════════════════════════════════════
     PRIVATE: search bindings
  ══════════════════════════════════════════════════════ */

  _bindSearchEvents() {
    const { ui } = this;
    if (!ui.searchInput) return;

    ui.searchInput.addEventListener('input', () => {
      this.searchQuery = ui.searchInput.value;
      ui.setClearButtonVisible(this.searchQuery.length > 0);
      saveUIState({ searchQuery: this.searchQuery, sortKey: this.sortKey, sortDir: this.sortDir });
      this._render();
    });

    ui.searchClear.addEventListener('click', () => {
      ui.searchInput.value = '';
      this.searchQuery     = '';
      ui.setClearButtonVisible(false);
      ui.searchInput.focus();
      saveUIState({ searchQuery: '', sortKey: this.sortKey, sortDir: this.sortDir });
      this._render();
    });
  }

  /* ══════════════════════════════════════════════════════
     PRIVATE: sort bindings
  ══════════════════════════════════════════════════════ */

  _bindSortEvents() {
    const { ui } = this;
    document.querySelectorAll('.sort-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.sort; // 'title' | 'artist'

        if (this.sortKey === key) {
          this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortKey = key;
          this.sortDir = 'asc';
        }

        ui.updateSortButtons(this.sortKey, this.sortDir);
        saveUIState({ searchQuery: this.searchQuery, sortKey: this.sortKey, sortDir: this.sortDir });
        this._render();

        const label    = key === 'title' ? '🔤 Title' : '🎤 Artist';
        const dirLabel = this.sortDir === 'asc' ? 'A → Z' : 'Z → A';
        ui.showToast(`${label} — ${dirLabel}`);
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     PRIVATE: share button
  ══════════════════════════════════════════════════════ */

  _bindShareButton() {
    const shareBtn = $('shareBtn');
    if (!shareBtn) return;

    shareBtn.addEventListener('click', () => {
      const data = {
        title: this.playlist.title,
        text:  `Check out "${this.playlist.title}" by ${this.playlist.creator}`,
        url:   window.location.href,
      };
      if (navigator.share) {
        navigator.share(data).catch(() => {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href)
          .then(()  => this.ui.showToast('🔗 Link copied!'))
          .catch(() => this.ui.showToast('🎵 Ready to share!'));
      } else {
        this.ui.showToast('🎵 Ready to share!');
      }
    });
  }
}