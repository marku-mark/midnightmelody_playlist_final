/**
 * Song.js
 * Represents a single song in the playlist.
 * Handles data normalization and duration tracking.
 */

export class Song {
  /**
   * @param {object} data - Raw song data from the playlist config
   */
  constructor(data) {
    this.name          = data.name   ?? 'Unknown Title';
    this.artist        = data.artist ?? 'Unknown Artist';
    this.audio         = data.audio  ?? null;
    this.image         = data.image  ?? null;
    this.emoji         = data.emoji  ?? '🎵';
    this.color         = Array.isArray(data.color) ? data.color : ['#5f7158', '#7B8D73'];
    this.realDuration  = null; // filled in async by DurationLoader
  }

  /** Gradient string for this song's colour swatch */
  get gradientStyle() {
    return `linear-gradient(135deg, ${this.color[0]}, ${this.color[1]})`;
  }

  /** True if an audio file has been assigned */
  get hasAudio() {
    return Boolean(this.audio);
  }

  /** True if album art has been assigned */
  get hasImage() {
    return Boolean(this.image);
  }
}
