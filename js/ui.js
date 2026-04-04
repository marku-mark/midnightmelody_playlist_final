/**
 * ui.js
 * UI class — handles all DOM rendering and display updates.
 * Owns no application state; receives data and reflects it into the DOM.
 */

import { $, $$, $$all, escHtml, highlight, toggleClass, setText, setHtml } from './modules/DOMHelpers.js';
import { formatTotalDuration, formatDurationHuman, computeTotalSeconds } from './modules/DataService.js';

export class UI {
  constructor() {
    // ── Player bar elements ──────────────────────────────
    this.playerBar    = $('playerBar');
    this.playerDisc   = $('playerDisc');
    this.playerArt    = $('playerArt');
    this.playerEmoji  = $('playerEmoji');
    this.playerSong   = $('playerSong');
    this.playerArtist = $('playerArtist');
    this.progressBar  = $('progressBar');
    this.timeElapsed  = $('timeElapsed');
    this.timeDuration = $('timeDuration');
    this.btnPlay      = $('btnPlay');

    // ── Transport buttons ────────────────────────────────
    this.btnTransportPlay = $('btnTransportPlay');
    this.btnShuffle       = $('btnShuffle');
    this.btnRepeat        = $('btnRepeat');
    this.btnNext          = $('btnTransportNext');
    this.btnBack          = $('btnTransportBack');

    // ── Track list ───────────────────────────────────────
    this.trackList        = $('trackList');
    this.emptyState       = $('emptyState');
    this.totalInfo        = $('totalInfo');
    this.trackListScroll  = $('trackListScroll');

    // ── Header ───────────────────────────────────────────
    this.playlistTitle    = $('playlistTitle');
    this.playlistMeta     = $('playlistMeta');
    this.descriptionText  = $('descriptionText');

    // ── Search ───────────────────────────────────────────
    this.searchInput      = $('searchInput');
    this.searchClear      = $('searchClear');

    // ── Toast ────────────────────────────────────────────
    this.toastEl          = $('toast');
    this._toastTimer      = null;

    // ── Slider ───────────────────────────────────────────
    this.sliderTrack  = $('sliderTrack');
    this.sliderPrev   = $('sliderPrev');
    this.sliderNext   = $('sliderNext');
  }

  /* ══════════════════════════════════════════════════════
     HEADER
  ══════════════════════════════════════════════════════ */

  /**
   * Render the playlist title, creator avatar, meta, and description.
   * @param {import('./modules/Playlist.js').Playlist} playlist
   */
  renderHeader(playlist) {
    setText(this.playlistTitle, playlist.title);
    setText(this.descriptionText, playlist.description);

    const avatar = $$('.creator-avatar');
    if (avatar && playlist.creatorIcon) {
      setHtml(avatar,
        `<img src="${escHtml(playlist.creatorIcon)}" alt="${escHtml(playlist.creator)}" />`
      );
    }

    this.updateHeaderMeta(playlist);
  }

  /**
   * Update only the song-count portion of the header meta.
   * @param {import('./modules/Playlist.js').Playlist} playlist
   */
  updateHeaderMeta(playlist) {
    setHtml(this.playlistMeta,
      `<span class="creator-name">${escHtml(playlist.creator)}</span>` +
      ` \u00B7 ${playlist.songCount} songs`
    );
  }

  /* ══════════════════════════════════════════════════════
     TRACK LIST
  ══════════════════════════════════════════════════════ */

  /**
   * Build and insert all track rows from a filtered/sorted song list.
   *
   * @param {import('./modules/Song.js').Song[]} visibleSongs - filtered + sorted view
   * @param {import('./modules/Playlist.js').Playlist} playlist - full playlist (for real indices)
   * @param {string} query - current search query for highlight
   * @param {function(realIndex: number): void} onTrackClick - click handler
   * @param {number|null} activeIndex - real index of the currently-playing track (to re-highlight)
   */
  renderTrackList(visibleSongs, playlist, query, onTrackClick, activeIndex = null) {
    const q = query.trim().toLowerCase();

    // Use a fragment for a single DOM write
    const fragment = document.createDocumentFragment();

    visibleSongs.forEach((song, i) => {
      const row      = document.createElement('div');
      const realIdx  = playlist.indexOf(song);
      row.className  = 'track-row';
      row.style.animationDelay = `${0.05 + i * 0.04}s`;
      row.dataset.realIndex    = realIdx;

      // Re-apply playing highlight immediately — no second pass needed
      if (realIdx === activeIndex) row.classList.add('is-playing');

      const thumbInner = song.hasImage
        ? `<img src="${escHtml(song.image)}" alt="${escHtml(song.name)}" />`
        : `<span>${song.emoji}</span>`;

      const thumbStyle = song.hasImage
        ? ''
        : `background:${song.gradientStyle};`;

      row.innerHTML =
        `<div class="track-num-wrap">
           <span class="track-num">${i + 1}</span>
           <span class="play-icon">&#9654;</span>
         </div>
         <div class="track-thumb" style="${thumbStyle}">${thumbInner}</div>
         <div class="track-info">
           <div class="track-name">${highlight(song.name, q)}</div>
           <div class="track-artist">${highlight(song.artist, q)}</div>
         </div>
         <div class="track-duration" id="dur-${realIdx}">&mdash;</div>`;

      row.addEventListener('click', () => onTrackClick(realIdx));
      fragment.appendChild(row);
    });

    this.trackList.innerHTML = '';
    this.trackList.appendChild(fragment);

    // ── Re-apply any already-loaded durations ────────────
    visibleSongs.forEach(song => {
      if (song.realDuration != null) {
        this.updateDurationCell(playlist.indexOf(song), song.realDuration);
      }
    });

    toggleClass(this.emptyState, 'visible', visibleSongs.length === 0);
  }

  /**
   * Update a single duration cell in the track list.
   * @param {number} realIndex
   * @param {number} seconds
   */
  updateDurationCell(realIndex, seconds) {
    const el = $(`dur-${realIndex}`);
    if (el) el.textContent = formatTotalDuration(seconds);
  }

  /* ══════════════════════════════════════════════════════
     STATS FOOTER
  ══════════════════════════════════════════════════════ */

  /**
   * Render the "X songs · Y hr Z min" stats bar.
   * @param {import('./modules/Song.js').Song[]} visibleSongs
   * @param {import('./modules/Song.js').Song[]} allSongs
   */
  renderFooter(visibleSongs, allSongs) {
    if (!this.totalInfo) return;

    const isFiltered = visibleSongs.length !== allSongs.length;
    const totalSec   = computeTotalSeconds(visibleSongs);
    const durHuman   = formatDurationHuman(totalSec);

    const countHtml = isFiltered
      ? `<span class="stat-count">${visibleSongs.length}</span> of ` +
        `<span class="stat-count">${allSongs.length}</span> songs` +
        `<span class="stat-filter">filtered</span>`
      : `<span class="stat-count">${allSongs.length}</span> songs`;

    setHtml(this.totalInfo,
      `${countHtml}<span class="stat-dot">&bull;</span><span class="stat-dur">${durHuman}</span>`
    );
  }

  /* ══════════════════════════════════════════════════════
     PLAYER BAR
  ══════════════════════════════════════════════════════ */

  /**
   * Populate and reveal the player bar for the selected song.
   * @param {import('./modules/Song.js').Song} song
   */
  showPlayerBar(song) {
    setText(this.playerSong,   song.name);
    setText(this.playerArtist, song.artist);

    this.playerDisc.style.background = song.gradientStyle;

    if (song.hasImage) {
      this.playerArt.src            = song.image;
      this.playerArt.style.display  = 'block';
      this.playerEmoji.style.display = 'none';
    } else {
      this.playerArt.style.display   = 'none';
      this.playerEmoji.style.display = 'block';
      this.playerEmoji.textContent   = song.emoji;
    }

    this.playerBar.classList.add('active');
    this.resetProgress();
  }

  /** Reset progress bar and time labels to zero. */
  resetProgress() {
    this.progressBar.value = 0;
    this.progressBar.style.background = 'rgba(255,255,255,0.18)';
    setText(this.timeElapsed,  '0:00');
    setText(this.timeDuration, '0:00');
  }

  /**
   * Sync progress bar and elapsed time from an audio element.
   * @param {HTMLAudioElement} audio
   */
  syncProgress(audio) {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    this.progressBar.value = pct;
    this.progressBar.style.background =
      `linear-gradient(to right, var(--sage-light) ${pct}%, rgba(255,255,255,0.18) ${pct}%)`;
    setText(this.timeElapsed, this._fmt(audio.currentTime));
  }

  /**
   * Update the duration display from an audio element's metadata.
   * @param {HTMLAudioElement} audio
   */
  syncDuration(audio) {
    if (audio.duration && !isNaN(audio.duration)) {
      setText(this.timeDuration, this._fmt(audio.duration));
    }
  }

  /**
   * Restore duration label from a song's cached realDuration.
   * @param {import('./modules/Song.js').Song|null} song
   * @param {HTMLAudioElement} audio
   */
  restoreDuration(song, audio) {
    if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
      setText(this.timeDuration, this._fmt(audio.duration));
    } else if (song?.realDuration) {
      setText(this.timeDuration, formatTotalDuration(song.realDuration));
    }
  }

  /**
   * Update play/pause visual state across all relevant buttons and the disc.
   * @param {boolean} playing
   */
  setPlayingState(playing) {
    this.btnPlay.innerHTML    = playing ? '&#10074;&#10074;' : '&#9654;';
    this.btnPlay.style.paddingLeft = playing ? '0' : '2px';

    if (this.btnTransportPlay) {
      this.btnTransportPlay.innerHTML = playing ? '&#10074;&#10074;' : '&#9654;';
    }

    toggleClass(this.playerDisc, 'spinning', playing);
  }

  /* ══════════════════════════════════════════════════════
     TRACK ROW HIGHLIGHT
  ══════════════════════════════════════════════════════ */

  /**
   * Highlight the currently-playing row and scroll it into view.
   * @param {number} realIndex
   */
  highlightActiveRow(realIndex) {
    $$all('.track-row').forEach(r => r.classList.remove('is-playing'));

    const activeRow = $$(`[data-real-index="${realIndex}"]`, this.trackList);
    if (!activeRow) return;

    activeRow.classList.add('is-playing');

    // Scroll into view if needed
    if (this.trackListScroll) {
      const { offsetTop: rowTop, offsetHeight: rowHeight } = activeRow;
      const { scrollTop, clientHeight } = this.trackListScroll;
      if (rowTop < scrollTop) {
        this.trackListScroll.scrollTo({ top: rowTop - 8, behavior: 'smooth' });
      } else if (rowTop + rowHeight > scrollTop + clientHeight) {
        this.trackListScroll.scrollTo({ top: rowTop + rowHeight - clientHeight + 8, behavior: 'smooth' });
      }
    }
  }

  /* ══════════════════════════════════════════════════════
     TRANSPORT BUTTONS STATE
  ══════════════════════════════════════════════════════ */

  /** @param {boolean} active */
  setShuffleActive(active) {
    toggleClass(this.btnShuffle, 'active', active);
  }

  /**
   * Update repeat button appearance for current repeat mode.
   * @param {false|'one'|'all'} mode
   */
  setRepeatMode(mode) {
    const isActive = mode !== false;
    toggleClass(this.btnRepeat, 'active', isActive);
    this.btnRepeat.style.fontSize = mode === 'one' ? '10px' : '13px';

    const baseSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="17 1 21 5 17 9"></polyline>
      <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
      <polyline points="7 23 3 19 7 15"></polyline>
      <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
    </svg>`;

    setHtml(this.btnRepeat,
      mode === 'one'
        ? `${baseSvg}<span style="position:absolute;top:1px;right:3px;font-size:9px;font-weight:700;font-family:var(--font-sf)">1</span>`
        : baseSvg
    );
    this.btnRepeat.style.position = 'relative';
  }

  /* ══════════════════════════════════════════════════════
     SEARCH UI
  ══════════════════════════════════════════════════════ */

  /** @param {boolean} hasValue */
  setClearButtonVisible(hasValue) {
    toggleClass(this.searchClear, 'visible', hasValue);
  }

  /* ══════════════════════════════════════════════════════
     SORT BUTTONS
  ══════════════════════════════════════════════════════ */

  /**
   * Update sort button active + direction state.
   * @param {string|null} activeKey - 'title' | 'artist' | null
   * @param {string} sortDir        - 'asc' | 'desc'
   */
  updateSortButtons(activeKey, sortDir) {
    $$all('.sort-btn').forEach(btn => {
      const isActive = btn.dataset.sort === activeKey;
      toggleClass(btn, 'active', isActive);
      toggleClass(btn, 'desc',   isActive && sortDir === 'desc');
    });
  }

  /* ══════════════════════════════════════════════════════
     COVER PHOTO
  ══════════════════════════════════════════════════════ */

  /** Bind cover photo load/error events. */
  initCoverPhoto() {
    const photo = $('coverPhoto');
    if (!photo) return;

    photo.addEventListener('load', () => {
      $$all('.cover-cell').forEach(c => { c.style.display = 'none'; });
    });

    photo.addEventListener('error', () => {
      photo.style.display = 'none';
      const colors = [
        ['#3d6b4f', '#5a8a6a'],
        ['#5a8a6a', '#7aab8a'],
        ['#7aab8a', '#a8c9b4'],
        ['#4a7c59', '#7aab8a'],
      ];
      $$all('.cover-cell').forEach((c, i) => {
        c.style.background = `linear-gradient(135deg, ${colors[i][0]}, ${colors[i][1]})`;
        const span = c.querySelector('span');
        if (span) span.style.display = 'block';
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     SCROLL FADE
  ══════════════════════════════════════════════════════ */

  /** Attach scroll-fade behaviour to the track list. */
  initScrollFade() {
    const scroller = this.trackListScroll;
    if (!scroller) return;

    const check = () => {
      const atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 8;
      toggleClass(scroller, 'at-bottom', atBottom);
    };

    scroller.addEventListener('scroll', check, { passive: true });
    setTimeout(check, 100);
  }

  /* ══════════════════════════════════════════════════════
     TOAST
  ══════════════════════════════════════════════════════ */

  /**
   * Show a transient toast notification.
   * @param {string} msg
   */
  showToast(msg) {
    if (!this.toastEl) return;
    this.toastEl.textContent = msg;
    this.toastEl.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      this.toastEl.classList.remove('show');
    }, 2800);
  }

  /* ══════════════════════════════════════════════════════
     RELATED PLAYLISTS SLIDER
  ══════════════════════════════════════════════════════ */

  /**
   * Build slider cards and initialise drag/wheel/arrow behaviour.
   * @param {Array<{title: string, cover: string, href: string}>} playlists
   */
  initSlider(playlists) {
    const { sliderTrack: track, sliderPrev: prevBtn, sliderNext: nextBtn } = this;
    if (!track || !prevBtn || !nextBtn) return;

    // Build cards
    const fragment = document.createDocumentFragment();
    playlists.forEach((pl, i) => {
      const card = document.createElement('div');
      card.className = 'playlist-card';
      card.style.animationDelay = `${0.05 + i * 0.06}s`;

      const coverLink = document.createElement('a');
      coverLink.href      = pl.href;
      coverLink.target    = '_blank';
      coverLink.rel       = 'noopener noreferrer';
      coverLink.className = 'playlist-card-link';
      coverLink.setAttribute('aria-label', pl.title);

      if (pl.cover) {
        const img   = document.createElement('img');
        img.src     = pl.cover;
        img.alt     = pl.title;
        img.onerror = () => {
          coverLink.classList.add('no-image');
          coverLink.innerHTML = '🎵';
        };
        coverLink.appendChild(img);
      } else {
        coverLink.classList.add('no-image');
        coverLink.textContent = '🎵';
      }

      const titleLink = document.createElement('a');
      titleLink.href         = pl.href;
      titleLink.target       = '_blank';
      titleLink.rel          = 'noopener noreferrer';
      titleLink.className    = 'playlist-card-title-link';
      titleLink.textContent  = pl.title;

      card.appendChild(coverLink);
      card.appendChild(titleLink);
      fragment.appendChild(card);
    });
    track.appendChild(fragment);

    // ── Slider state ────────────────────────────────────
    let currentOffset = 0;

    const getCardWidth = () => {
      const first = track.querySelector('.playlist-card');
      if (!first) return 162;
      const gap = parseFloat(getComputedStyle(track).gap) || 14;
      return first.offsetWidth + gap;
    };

    const getMaxOffset = () => {
      const wrapWidth  = track.parentElement.offsetWidth;
      const totalWidth = track.scrollWidth;
      return Math.max(0, totalWidth - wrapWidth);
    };

    const slideTo = offset => {
      const max = getMaxOffset();
      currentOffset = Math.max(0, Math.min(offset, max));
      track.style.transform   = `translateX(-${currentOffset}px)`;
      prevBtn.disabled = currentOffset <= 0;
      nextBtn.disabled = currentOffset >= max;
    };

    slideTo(0);

    nextBtn.addEventListener('click', () => slideTo(currentOffset + getCardWidth() * 2));
    prevBtn.addEventListener('click', () => slideTo(currentOffset - getCardWidth() * 2));

    // Mouse wheel horizontal scroll
    track.parentElement.addEventListener('wheel', e => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      slideTo(currentOffset + e.deltaY * 0.8);
    }, { passive: false });

    // Touch / mouse drag
    let dragStart    = null;
    let dragStartOff = 0;

    const onPointerDown = e => {
      dragStart    = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
      dragStartOff = currentOffset;
      track.classList.add('is-dragging');
      track.querySelectorAll('a').forEach(a => a.setAttribute('data-drag-lock', '1'));
    };
    const onPointerMove = e => {
      if (dragStart === null) return;
      const x    = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
      slideTo(dragStartOff + (dragStart - x));
    };
    const onPointerUp = e => {
      if (dragStart === null) return;
      const x     = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
      const moved = Math.abs(dragStart - x);
      dragStart   = null;
      track.classList.remove('is-dragging');
      setTimeout(() => {
        track.querySelectorAll('a[data-drag-lock]').forEach(a => a.removeAttribute('data-drag-lock'));
      }, 10);
      if (moved > 6) {
        track.addEventListener('click', ev => ev.preventDefault(), { once: true, capture: true });
      }
    };

    track.addEventListener('mousedown',  onPointerDown);
    track.addEventListener('mousemove',  onPointerMove);
    track.addEventListener('mouseup',    onPointerUp);
    track.addEventListener('mouseleave', onPointerUp);
    track.addEventListener('touchstart', onPointerDown, { passive: true });
    track.addEventListener('touchmove',  onPointerMove, { passive: true });
    track.addEventListener('touchend',   onPointerUp);

    window.addEventListener('resize', () => slideTo(currentOffset), { passive: true });
  }

  /* ══════════════════════════════════════════════════════
     PRIVATE HELPERS
  ══════════════════════════════════════════════════════ */

  /**
   * Format seconds → "M:SS"
   * @param {number} s
   * @returns {string}
   */
  _fmt(s) {
    const m   = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  }
}