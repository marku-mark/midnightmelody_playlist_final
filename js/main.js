/**
 * main.js
 * Application entry point.
 *
 * ── What lives here ──────────────────────────────────────
 *   1. Playlist data  ← EDIT THIS to customise your playlist
 *   2. Related playlists data
 *   3. Bootstrap: instantiate Playlist, UI, PlaylistController
 *   4. Kick off async duration loading
 */

import { Playlist }            from './modules/Playlist.js';
import { UI }                  from './ui.js';
import { PlaylistController }  from './playlistController.js';
import { loadAllDurations }    from './modules/DataService.js';

/* ════════════════════════════════════════════════════════
   SECTION 1 — PLAYLIST DATA (edit here)
════════════════════════════════════════════════════════ */
const playlistData = {
  title:       'the city of forks',
  creator:     'grace',
  creatorIcon: 'user_icon/icon.jpg',
  description: 'twilight nostalgia',

  songs: [
    {
      name:   'Rosyln',
      artist: 'St. Vincent, Bon Iver',
      color:  ['#8b9fe8', '#5b6fd4'],
      audio:  'songs/Rosyln.mp3',
      image:  'previews/Rosyln.webp',
    },
    {
      name:   'Space Song',
      artist: 'Beach House',
      color:  ['#f4b98e', '#e8834a'],
      audio:  'songs/Space_Song.mp3',
      image:  'previews/Space_Song.webp',
    },
    {
      name:   "Twilight (Bella's Lullaby)",
      artist: 'Brussells Philharmonic, Dirk Brossé',
      color:  ['#e8849e', '#c0607e'],
      audio:  'songs/Twilight_bellas_Lullaby-Brussells_Philharmonic_Dirk_Bross.m4a',
      image:  'previews/Twilight_bellas_Lullaby-Brussells_Philharmonic_Dirk_Bross.webp',
    },
    {
      name:   'Full Moon',
      artist: 'The Black Ghosts',
      color:  ['#2d5a27', '#4a7c59'],
      audio:  'songs/Full_Moon-The_Black_Ghosts.m4a',
      image:  'previews/Full_Moon-The_Black_Ghosts.webp',
    },
    {
      name:   "Where's My Love (Acoustic)",
      artist: 'SYML',
      color:  ['#e8c87a', '#d4a853'],
      audio:  'songs/Wheres_My_Love_acoustic-Syml.m4a',
      image:  'previews/Wheres_My_Love_acoustic-Syml.webp',
    },
    {
      name:   "Where's My Love",
      artist: 'SYML',
      color:  ['#5c6bc0', '#3949ab'],
      audio:  'songs/Wheres_My_Love-Syml.m4a',
      image:  'previews/Wheres_My_Love-Syml.webp',
    },
    {
      name:   'Ontario',
      artist: 'Lowswimmer, Novo Amor',
      color:  ['#81d4fa', '#0288d1'],
      audio:  'songs/Ontario-Lowswimmer_Novo_Amor.m4a',
      image:  'previews/Ontario-Lowswimmer_Novo_Amor.webp',
    },
    {
      name:   'A Thousand Years',
      artist: 'Christina Perri',
      color:  ['#8b9fe8', '#5b6fd4'],
      audio:  'songs/A_Thousand_Years-Christina_Perri.m4a',
      image:  'previews/A_Thousand_Years-Christina_Perri.webp',
    },
    {
      name:   'It Will Rain',
      artist: 'Bruno Mars',
      color:  ['#f4b98e', '#e8834a'],
      audio:  'songs/It _Will_Rain-Bruno_Mars.m4a',
      image:  'previews/It _Will_Rain-Bruno_Mars.webp',
    },
    {
      name:   'Turning Page',
      artist: 'Sleeping At Last',
      color:  ['#e8849e', '#c0607e'],
      audio:  'songs/Turning_Page-Sleeping_At_Last.m4a',
      image:  'previews/Turning_Page-Sleeping_At_Last.webp',
    },
    {
      name:   'Requiem On Water',
      artist: 'Imperial Mammoth',
      color:  ['#2d5a27', '#4a7c59'],
      audio:  'songs/Requiem_On_Water-Imperial_Mammoth.m4a',
      image:  'previews/Requiem_On_Water-Imperial_Mammoth.webp',
    },
    {
      name:   'Flightless Bird, American Mouth (Wedding Version)',
      artist: 'Iron & Wine',
      color:  ['#e8c87a', '#d4a853'],
      audio:  'songs/Flightless_Bird_American_Mouth_wedding_Version-Iron_Wine.m4a',
      image:  'previews/Flightless_Bird_American_Mouth_wedding_Version-Iron_Wine.webp',
    },
    {
      name:   'Cold',
      artist: 'Aqualung, Lucy Schwartz',
      color:  ['#5c6bc0', '#3949ab'],
      audio:  'songs/Cold-Aqualung_Lucy_Schwartz.m4a',
      image:  'previews/Cold-Aqualung_Lucy_Schwartz.webp',
    },
    {
      name:   'A Nova Vida (From "The Twilight Saga: Breaking Dawn - Part 1")',
      artist: 'The City of Prague Philharmonic Orchestra',
      color:  ['#81d4fa', '#0288d1'],
      audio:  'songs/A_Nova_Vida_from_the_Twilight_Saga_Breaking_Dawn.m4a',
      image:  'previews/A_Nova_Vida_from_the_Twilight_Saga_Breaking_Dawn.webp',
    },
    {
      name:   'Possibility',
      artist: 'Lykke Li',
      color:  ['#8b9fe8', '#5b6fd4'],
      audio:  'songs/Possibility.mp3',
      image:  'previews/Possibility.webp',
    },
    {
      name:   'Slow Life (with Victoria Legrand)',
      artist: 'Grizzly Bear',
      color:  ['#f4b98e', '#e8834a'],
      audio:  'songs/Slow_Life (with_Victoria_Legrand).mp3',
      image:  'previews/Slow_Life (with_Victoria_Legrand).webp',
    },
    {
      name:   'Hearing',
      artist: 'Sleeping At Last',
      color:  ['#e8849e', '#c0607e'],
      audio:  'songs/Hearing-Sleeping_At_Last.m4a',
      image:  'previews/Hearing-Sleeping_At_Last.webp',
    },
    {
      name:   'Decode',
      artist: 'Paramore',
      color:  ['#2d5a27', '#4a7c59'],
      audio:  'songs/Decode-Paramore.m4a',
      image:  'previews/Decode-Paramore.webp',
    },
    {
      name:   'Leave Out All the Rest (Twilight Soundtrack Version)',
      artist: 'LINKIN PARK',
      color:  ['#e8c87a', '#d4a853'],
      audio:  'songs/Leave_Out_All_The_Rest_twilight_Soundtrack_Version-Linkin_Park.m4a',
      image:  'previews/Leave_Out_All_The_Rest_twilight_Soundtrack_Version-Linkin_Park.webp',
    },
    {
      name:   'Eclipse (All Yours)',
      artist: 'Metric',
      color:  ['#5c6bc0', '#3949ab'],
      audio:  'songs/Eclipse_all_Yours-Metric.m4a',
      image:  'previews/Eclipse_all_Yours-Metric.webp',
    },
    {
      name:   'A Thousand Years, Pt. 2 (feat. Steve Kazee)',
      artist: 'Christina Perri',
      color:  ['#81d4fa', '#0288d1'],
      audio:  'songs/A_Thousand_Years_Pt2_feat-Steve_Kazee-Christina_Perri.m4a',
      image:  'previews/A_Thousand_Years_Pt2_feat-Steve_Kazee-Christina_Perri.webp',
    },
    {
      name:   'I Caught Myself',
      artist: 'Paramore',
      color:  ['#8b9fe8', '#5b6fd4'],
      audio:  'songs/I_Caught_Myself-Paramore.m4a',
      image:  'previews/I_Caught_Myself-Paramore.webp',
    }
  ],
};

/* ════════════════════════════════════════════════════════
   SECTION 2 — RELATED PLAYLISTS (edit here)
════════════════════════════════════════════════════════ */
const relatedPlaylists = [
  {
    title: 'on repeat',
    cover: 'other_playlist_covers/on_repeat.jpg',
    href:  'https://repeatedly.vercel.app',
  },
];

/* ════════════════════════════════════════════════════════
   SECTION 3 — BOOTSTRAP
════════════════════════════════════════════════════════ */
const playlist   = new Playlist(playlistData);
const ui         = new UI();
const controller = new PlaylistController(playlist, ui);

// Render header
ui.renderHeader(playlist);

// Init controller (binds events, renders track list)
controller.init();

// Build related playlists slider
ui.initSlider(relatedPlaylists);

/* ════════════════════════════════════════════════════════
   SECTION 4 — ASYNC DURATION LOADING
   Probes audio files one-at-a-time; updates cells as they resolve.
════════════════════════════════════════════════════════ */
loadAllDurations(playlist.songs, song => {
  controller.onDurationLoaded(song);
});
