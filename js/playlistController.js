/**
 * playlistController.js
 * PlaylistController — coordinates all application events and state.
 * Sits between the Playlist data model and the UI renderer.
 */

import { $ } from './modules/DOMHelpers.js';

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
    this._render();
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
    this.ui.renderTrackList(visible, this.playlist, this.searchQuery, idx => this._selectTrack(idx));
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
   */
  _selectTrack(index) {
    const song = this.playlist.songs[index];

    this.ui.highlightActiveRow(index);
    this.ui.showPlayerBar(song);

    this.currentIndex = index;

    if (song.hasAudio) {
      this.audio.src = song.audio;
      this.audio.load();
      this.audio.play()
        .then(() => this._setPlaying(true))
        .catch(e => {
          console.warn('Autoplay blocked:', e.message);
          this._setPlaying(false);
        });
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

  _nextTrackIndex() {
    if (this.shuffleMode) return this.playlist.nextShuffleIndex(this.currentIndex);
    return (this.currentIndex + 1) % this.playlist.songCount;
  }

  _prevTrackIndex() {
    if (this.shuffleMode) return this.playlist.prevShuffleIndex(this.currentIndex);
    return (this.currentIndex - 1 + this.playlist.songCount) % this.playlist.songCount;
  }

  _goNext() {
    if (this.currentIndex === null) { this._selectTrack(0); return; }
    this._selectTrack(this._nextTrackIndex());
  }

  _goPrev() {
    if (this.currentIndex === null) { this._selectTrack(0); return; }
    if (this.audio.currentTime > 3) { this.audio.currentTime = 0; return; }
    this._selectTrack(this._prevTrackIndex());
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
        this._selectTrack(this._nextTrackIndex());

      } else {
        // repeatMode === false: advance unless we're at the end of a linear list
        const next = this._nextTrackIndex();
        if (next !== null && (this.shuffleMode || next > this.currentIndex)) {
          this._selectTrack(next);
        }
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
        this._setPlaying(false);
      } else {
        audio.play().then(() => this._setPlaying(true));
      }
    });
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
        this._setPlaying(false);
      } else if (this.audio.src && this.audio.src !== window.location.href) {
        this.audio.play().then(() => this._setPlaying(true)).catch(() => {});
      } else {
        this._selectTrack(0);
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
      this._render();
    });

    ui.searchClear.addEventListener('click', () => {
      ui.searchInput.value = '';
      this.searchQuery     = '';
      ui.setClearButtonVisible(false);
      ui.searchInput.focus();
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
