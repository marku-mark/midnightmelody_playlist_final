/**
 * DataService.js
 * Handles all async audio data operations:
 *   - Probing real durations from audio files (one at a time)
 *   - Duration formatting utilities
 */

/**
 * Parse a "M:SS" or "H:MM:SS" string into total seconds.
 * @param {string} str
 * @returns {number}
 */
export function parseDuration(str) {
  if (!str) return 0;
  const parts = str.split(':').map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

/**
 * Format total seconds → "M:SS" or "H:MM:SS"
 * @param {number} totalSec
 * @returns {string}
 */
export function formatTotalDuration(totalSec) {
  totalSec = Math.floor(totalSec);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = n => (n < 10 ? '0' : '') + n;

  if (h > 0) return `${h}:${pad(m)}:${pad(s)}`;
  return `${m}:${pad(s)}`;
}

/**
 * Format total seconds → human-readable short form, e.g. "1 hr 6 min"
 * @param {number} totalSec
 * @returns {string}
 */
export function formatDurationHuman(totalSec) {
  totalSec = Math.floor(totalSec);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const parts = [];
  if (h > 0) parts.push(`${h} hr`);
  if (m > 0) parts.push(`${m} min`);
  if (parts.length === 0) parts.push(`${s} sec`);
  return parts.join(' ');
}

/**
 * Compute total seconds for a collection of Song objects.
 * Uses realDuration when available; falls back to 0.
 *
 * @param {import('../modules/Song.js').Song[]} songs
 * @returns {number}
 */
export function computeTotalSeconds(songs) {
  return songs.reduce((acc, s) => acc + (s.realDuration ?? 0), 0);
}

/**
 * Probe a single audio file for its duration.
 * Creates a temporary <audio> element, loads metadata, then immediately
 * tears it down — no persistent connections, one request at a time.
 *
 * @param {string} src - Audio file URL
 * @returns {Promise<number|null>} Duration in seconds, or null on failure
 */
export function fetchDuration(src) {
  return new Promise(resolve => {
    const probe = document.createElement('audio');
    probe.preload = 'metadata';

    const done = secs => {
      probe.removeEventListener('loadedmetadata', onMeta);
      probe.removeEventListener('error', onError);
      probe.src = '';
      probe.load(); // resets networkState → NETWORK_EMPTY
      resolve(secs);
    };

    const onMeta  = () => {
      const dur = probe.duration;
      done(!isNaN(dur) && dur !== Infinity ? dur : null);
    };
    const onError = () => done(null);

    probe.addEventListener('loadedmetadata', onMeta);
    probe.addEventListener('error', onError);
    probe.src = src;
    probe.load();
  });
}

/* ════════════════════════════════════════════════════════
   DURATION CACHE  (localStorage)
   Key: fds_durations
   Value: { [audioSrc]: seconds }
════════════════════════════════════════════════════════ */

const DURATION_CACHE_KEY = 'fds_durations';

/**
 * Load the duration cache from localStorage.
 * @returns {Record<string, number>}
 */
export function loadDurationCache() {
  try {
    const raw = localStorage.getItem(DURATION_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Persist a single src→seconds entry into the cache.
 * @param {string} src
 * @param {number} seconds
 */
export function saveDurationToCache(src, seconds) {
  try {
    const cache = loadDurationCache();
    cache[src] = seconds;
    localStorage.setItem(DURATION_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Quota exceeded or private browsing — fail silently
  }
}

/**
 * Load real durations for all songs that have audio, sequentially.
 * Checks the localStorage cache first; only fetches from the network
 * when a duration is not yet cached.
 * Updates song.realDuration in place, then calls onUpdate after each.
 *
 * @param {import('../modules/Song.js').Song[]} songs
 * @param {function(song: Song): void} onUpdate - called after each duration resolves
 */
export async function loadAllDurations(songs, onUpdate) {
  const cache = loadDurationCache();

  for (const song of songs) {
    if (!song.hasAudio) continue;

    // ── Cache hit: no network request needed ────────────
    if (cache[song.audio] !== undefined) {
      song.realDuration = cache[song.audio];
      onUpdate(song);
      continue;
    }

    // ── Cache miss: probe the file ───────────────────────
    const secs = await fetchDuration(song.audio);
    if (secs !== null) {
      song.realDuration = secs;
      saveDurationToCache(song.audio, secs);
      onUpdate(song);
    }
  }
}