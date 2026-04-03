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
      name:   'Love U Like That',
      artist: 'Lauv',
      color:  ['#8b9fe8', '#5b6fd4'],
      audio:  'songs/Love_U_Like_That-Lauv.m4a',
      image:  'previews/Love_U_Like_That-Lauv.jpg',
    },
    {
      name:   'Mean It',
      artist: 'Lauv, LANY',
      color:  ['#f4b98e', '#e8834a'],
      audio:  'songs/Mean_It-Lauv_Lany.m4a',
      image:  'previews/Mean_It-Lauv_Lany.jpg',
    },
    {
      name:   'fuck, i\'m lonely (feat. Anne-Marie)',
      artist: 'Lauv',
      color:  ['#e8849e', '#c0607e'],
      audio:  'songs/Fuck_Im_Lonely_feat_Anne_marie-Lauv.m4a',
      image:  'previews/Fuck_Im_Lonely_feat_Anne_marie-Lauv.jpg',
    },
    {
      name:   'Superhero',
      artist: 'Lauv',
      color:  ['#2d5a27', '#4a7c59'],
      audio:  'songs/Superhero-Lauv.m4a',
      image:  'previews/Superhero-Lauv.jpg',
    },
    {
      name:   'Paris in the Rain',
      artist: 'Lauv',
      color:  ['#e8c87a', '#d4a853'],
      audio:  'songs/Paris_In_The_Rain-Lauv.m4a',
      image:  'previews/Paris_In_The_Rain-Lauv.jpg',
    },
    {
      name:   'Getting Over You',
      artist: 'Lauv',
      color:  ['#5c6bc0', '#3949ab'],
      audio:  'songs/Getting_Over_You-Lauv.m4a',
      image:  'previews/Getting_Over_You-Lauv.jpg',
    },
    {
      name:   'Enemies',
      artist: 'Lauv',
      color:  ['#81d4fa', '#0288d1'],
      audio:  'songs/Enemies-Lauv.m4a',
      image:  'previews/Enemies-Lauv.jpg',
    },
    {
      name:   'beat up car',
      artist: 'Henry Moodie',
      color:  ['#8b9fe8', '#5b6fd4'],
      audio:  'songs/Beat_Up_Car-Henry_Moodie.m4a',
      image:  'previews/Beat_Up_Car-Henry_Moodie.jpg',
    },
    {
      name:   'good old days',
      artist: 'Henry Moodie',
      color:  ['#f4b98e', '#e8834a'],
      audio:  'songs/Good_Old_Days-Henry_Moodie.m4a',
      image:  'previews/Good_Old_Days-Henry_Moodie.jpg',
    },
    {
      name:   'leave the lights on',
      artist: 'Johnny Orlando',
      color:  ['#e8849e', '#c0607e'],
      audio:  'songs/Leave_The_Light_On-Johnny_Orlando.m4a',
      image:  'previews/Leave_The_Light_On-Johnny_Orlando.png',
    },
    {
      name:   'Vegas',
      artist: 'Johnny Orlando',
      color:  ['#2d5a27', '#4a7c59'],
      audio:  'songs/Vegas-Johnny_Orlando.m4a',
      image:  'previews/Vegas-Johnny_Orlando.jpg',
    },
    {
      name:   'August',
      artist: 'Johnny Orlando',
      color:  ['#e8c87a', '#d4a853'],
      audio:  'songs/August-Johnny_Orlando.m4a',
      image:  'previews/August-Johnny_Orlando.jpg',
    },
    {
      name:   'See You',
      artist: 'Johnny Orlando',
      color:  ['#5c6bc0', '#3949ab'],
      audio:  'songs/See_You-Johnny_Orlando.m4a',
      image:  'previews/See_You-Johnny_Orlando.jpg',
    },
    {
      name:   'Paris',
      artist: 'The Chainsmokers',
      color:  ['#81d4fa', '#0288d1'],
      audio:  'songs/Paris-The_Chainsmokers.m4a',
      image:  'previews/Paris-The_Chainsmokers.jpg',
    },
    {
      name:   'Save My Love',
      artist: 'Kygo, Khalid, Gryffin',
      color:  ['#8b9fe8', '#5b6fd4'],
      audio:  'songs/Save_My_Love-Kygo_Khalid_Gryffin.m4a',
      image:  'previews/Save_My_Love-Kygo_Khalid_Gryffin.jpg',
    },
    {
      name:   'Silence (feat. Khalid)',
      artist: 'Marshmello',
      color:  ['#f4b98e', '#e8834a'],
      audio:  'songs/Silence_feat_Khalid-Marshmello.m4a',
      image:  'previews/Silence_feat_Khalid-Marshmello.jpg',
    },
    {
      name:   'Beautiful People (feat. Khalid)',
      artist: 'Ed Sheeran',
      color:  ['#e8849e', '#c0607e'],
      audio:  'songs/Beautiful_People_feat_Khalid-Ed_Sheeran.m4a',
      image:  'previews/Beautiful_People_feat_Khalid-Ed_Sheeran.jpg',
    },
    {
      name:   'Favorite Girl',
      artist: 'Justin Bieber',
      color:  ['#2d5a27', '#4a7c59'],
      audio:  'songs/Favorite_Girl-Justin_Bieber.m4a',
      image:  'previews/Favorite_Girl-Justin_Bieber.jpg',
    },
    {
      name:   'so american',
      artist: 'Olivia Rodrigo',
      color:  ['#e8c87a', '#d4a853'],
      audio:  'songs/So_American-Olivia_Rodrigo.m4a',
      image:  'previews/So_American-Olivia_Rodrigo.jpg',
    },
    {
      name:   'lowkey',
      artist: 'NIKI',
      color:  ['#5c6bc0', '#3949ab'],
      audio:  'songs/Lowkey-Niki.m4a',
      image:  'previews/Lowkey-Niki.jpg',
    },
  ],
};

/* ════════════════════════════════════════════════════════
   SECTION 2 — RELATED PLAYLISTS (edit here)
════════════════════════════════════════════════════════ */
const relatedPlaylists = [
  {
    title: 'Midnight Drives',
    cover: 'other_playlist_covers/on_repeat.jpg',
    href:  'midnight-drives.html',
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
