/**
 * Playlist.js
 * Manages playlist metadata and song collection.
 * Handles filtering, sorting, and shuffle order generation.
 */

import { Song } from './Song.js';

export class Playlist {
  /**
   * @param {object} data - Raw playlist config object
   */
  constructor(data) {
    this.title       = data.title       ?? 'My Playlist';
    this.creator     = data.creator     ?? 'unknown';
    this.creatorIcon = data.creatorIcon ?? null;
    this.description = data.description ?? '';
    this.songs       = (data.songs ?? []).map(s => new Song(s));

    this._shuffleOrder = [];
  }

  /** Total number of songs */
  get songCount() {
    return this.songs.length;
  }

  /**
   * Return a filtered + sorted view of songs.
   * Never mutates the original array.
   *
   * @param {string} query   - Search query string
   * @param {string|null} sortKey - 'title' | 'artist' | null
   * @param {string} sortDir - 'asc' | 'desc'
   * @returns {Song[]}
   */
  getVisibleSongs(query = '', sortKey = null, sortDir = 'asc') {
    const q = query.trim().toLowerCase();

    let result = this.songs.filter(song => {
      if (!q) return true;
      return song.name.toLowerCase().includes(q) ||
             song.artist.toLowerCase().includes(q);
    });

    if (sortKey) {
      const dir = sortDir === 'asc' ? 1 : -1;
      result = result.slice().sort((a, b) => {
        const va = (sortKey === 'title' ? a.name : a.artist).toLowerCase();
        const vb = (sortKey === 'title' ? b.name : b.artist).toLowerCase();
        return va < vb ? -dir : va > vb ? dir : 0;
      });
    }

    return result;
  }

  /** Rebuild the Fisher-Yates shuffle order */
  buildShuffleOrder() {
    this._shuffleOrder = this.songs.map((_, i) => i);
    for (let i = this._shuffleOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this._shuffleOrder[i], this._shuffleOrder[j]] =
        [this._shuffleOrder[j], this._shuffleOrder[i]];
    }
  }

  /**
   * Next index in shuffle order after the given index.
   * @param {number} currentIndex
   * @returns {number}
   */
  nextShuffleIndex(currentIndex) {
    const pos = this._shuffleOrder.indexOf(currentIndex);
    return this._shuffleOrder[(pos + 1) % this._shuffleOrder.length];
  }

  /**
   * Previous index in shuffle order before the given index.
   * @param {number} currentIndex
   * @returns {number}
   */
  prevShuffleIndex(currentIndex) {
    const pos  = this._shuffleOrder.indexOf(currentIndex);
    const prev = (pos - 1 + this._shuffleOrder.length) % this._shuffleOrder.length;
    return this._shuffleOrder[prev];
  }

  /**
   * Index of a song in the master array.
   * @param {Song} song
   * @returns {number}
   */
  indexOf(song) {
    return this.songs.indexOf(song);
  }
}
