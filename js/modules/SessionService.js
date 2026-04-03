/**
 * SessionService.js
 * Handles two concerns:
 *
 *  1. PLAYBACK PERSISTENCE — saves the currently-playing track index and
 *     seek position to localStorage on every timeupdate, restores it on
 *     page load, and clears it when the tab/window is closed.
 *
 *  2. MEDIA SESSION API — registers OS-level media controls (lock screen,
 *     notification shade, keyboard media keys, browser toolbar) so that
 *     pausing from YouTube / Spotify / system controls also pauses here,
 *     and vice-versa. Also updates the artwork metadata shown by the OS.
 */

const STORAGE_KEY = 'fds_session'; // fds = Forest Dusk Sessions

/* ── Storage schema ────────────────────────────────────────
   {
     index:    number,   // real playlist index of the last-playing song
     time:     number,   // currentTime in seconds when last saved
     paused:   boolean   // true if the player was paused when saved
   }
────────────────────────────────────────────────────────── */

export class SessionService {
  /**
   * @param {HTMLAudioElement} audio
   */
  constructor(audio) {
    this.audio = audio;
    this._saveThrottle = null;
  }

  /* ══════════════════════════════════════════════════════
     PERSISTENCE
  ══════════════════════════════════════════════════════ */

  /**
   * Start auto-saving playback state on every timeupdate.
   * Throttled to once per second to avoid excessive writes.
   * @param {function(): number|null} getIndex - returns currentIndex from controller
   */
  startPersisting(getIndex) {
    this.audio.addEventListener('timeupdate', () => {
      if (this._saveThrottle) return;
      this._saveThrottle = setTimeout(() => {
        this._saveThrottle = null;
        const index = getIndex();
        if (index === null) return;
        this._write({ index, time: this.audio.currentTime, paused: this.audio.paused });
      }, 1000);
    });

    // Also save immediately on pause/play so the paused flag is accurate
    this.audio.addEventListener('pause', () => {
      const index = getIndex();
      if (index !== null) this._write({ index, time: this.audio.currentTime, paused: true });
    });

    this.audio.addEventListener('play', () => {
      const index = getIndex();
      if (index !== null) this._write({ index, time: this.audio.currentTime, paused: false });
    });

    // Clear on tab/window close
    window.addEventListener('pagehide', () => this.clear());
    // pagehide is preferred over beforeunload for bfcache compatibility,
    // but we add beforeunload as a fallback for older browsers.
    window.addEventListener('beforeunload', () => this.clear());
  }

  /**
   * Read back any previously saved session.
   * @returns {{ index: number, time: number, paused: boolean } | null}
   */
  restore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (typeof data.index !== 'number') return null;
      return data;
    } catch {
      return null;
    }
  }

  /** Remove the saved session from localStorage. */
  clear() {
    localStorage.removeItem(STORAGE_KEY);
  }

  /* ══════════════════════════════════════════════════════
     MEDIA SESSION API
  ══════════════════════════════════════════════════════ */

  /**
   * Register OS-level media controls and wire them to controller callbacks.
   * Safe to call even if the Media Session API is unsupported (silently skips).
   *
   * @param {{
   *   onPlay:       function(): void,
   *   onPause:      function(): void,
   *   onNext:       function(): void,
   *   onPrev:       function(): void,
   *   onSeekTo:     function(number): void,
   * }} handlers
   */
  registerMediaSession(handlers) {
    if (!('mediaSession' in navigator)) return;

    const ms = navigator.mediaSession;

    ms.setActionHandler('play',  () => handlers.onPlay());
    ms.setActionHandler('pause', () => handlers.onPause());

    // nexttrack / previoustrack → skip to adjacent song
    ms.setActionHandler('nexttrack',     () => handlers.onNext());
    ms.setActionHandler('previoustrack', () => handlers.onPrev());

    // seekto → scrubbing from lock screen / notification shade
    ms.setActionHandler('seekto', details => {
      if (details.seekTime !== undefined) {
        handlers.onSeekTo(details.seekTime);
      }
    });

    // Keep the position state in sync so the OS scrubber is accurate
    this.audio.addEventListener('timeupdate', () => this._syncPositionState());
    this.audio.addEventListener('durationchange', () => this._syncPositionState());
  }

  /**
   * Push rich metadata (title, artist, artwork) to the OS media overlay.
   * Call this whenever a new track is selected.
   *
   * @param {{ name: string, artist: string, image: string|null }} song
   */
  updateMediaMetadata(song) {
    if (!('mediaSession' in navigator)) return;

    const artwork = song.image
      ? [{ src: song.image, sizes: '512x512', type: 'image/jpeg' }]
      : [];

    navigator.mediaSession.metadata = new MediaMetadata({
      title:  song.name,
      artist: song.artist,
      album:  'Forest Dusk Sessions',
      artwork,
    });
  }

  /* ══════════════════════════════════════════════════════
     PRIVATE HELPERS
  ══════════════════════════════════════════════════════ */

  _write(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Quota exceeded or private browsing — fail silently
    }
  }

  _syncPositionState() {
    if (!('mediaSession' in navigator)) return;
    const { audio } = this;
    if (!audio.duration || isNaN(audio.duration)) return;

    try {
      navigator.mediaSession.setPositionState({
        duration:     audio.duration,
        playbackRate: audio.playbackRate,
        position:     audio.currentTime,
      });
    } catch {
      // Some browsers throw if called before metadata is ready
    }
  }
}
