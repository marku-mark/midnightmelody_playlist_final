/* ════════════════════════════════════════════════════════
   script.js — Playlist Share Preview Card
   Edit Section 1 to customise your playlist.
════════════════════════════════════════════════════════ */

/* ════ SECTION 1 — PLAYLIST DATA (edit here) ═════════ */
var playlist = {
  title:       "Forest Dusk Sessions",
  creator:     "grace",
  creatorIcon: "user_icon/icon.jpg",
  description: "twilight nostalgia",

  songs: [
    {
      name:     "Love U Like That",
      artist:   "Lauv",
      duration: "3:31",
      color:    ["#8b9fe8", "#5b6fd4"],
      audio:    "songs/Love_U_Like_That-Lauv.m4a",
      image:    "previews/Love_U_Like_That-Lauv.jpg"
    },
    {
      name:     "Mean It",
      artist:   "Lauv, LANY",
      duration: "3:52",
      color:    ["#f4b98e", "#e8834a"],
      audio:    "songs/Mean_It-Lauv_Lany.m4a",
      image:    "previews/Mean_It-Lauv_Lany.jpg"
    },
    {
      name:     "fuck, i'm lonely (feat. Anne-Marie)",
      artist:   "Lauv",
      duration: "3:19",
      color:    ["#e8849e", "#c0607e"],
      audio:    "songs/Fuck_Im_Lonely_feat_Anne_marie-Lauv.m4a",
      image:    "previews/Fuck_Im_Lonely_feat_Anne_marie-Lauv.jpg"
    },
    {
      name:     "Superhero",
      artist:   "Lauv",
      duration: "3:00",
      color:    ["#2d5a27", "#4a7c59"],
      audio:    "songs/Superhero-Lauv.m4a",
      image:    "previews/Superhero-Lauv.jpg"
    },
    {
      name:     "Paris in the Rain",
      artist:   "Lauv",
      duration: "3:24",
      color:    ["#e8c87a", "#d4a853"],
      audio:    "songs/Paris_In_The_Rain-Lauv.m4a",
      image:    "previews/Paris_In_The_Rain-Lauv.jpg"
    },
    {
      name:     "Getting Over You",
      artist:   "Lauv",
      duration: "4:15",
      color:    ["#5c6bc0", "#3949ab"],
      audio:    "songs/Getting_Over_You-Lauv.m4a",
      image:    "previews/Getting_Over_You-Lauv.jpg"
    },
    {
      name:     "Enemies",
      artist:   "Lauv",
      duration: "3:14",
      color:    ["#81d4fa", "#0288d1"],
      audio:    "songs/Enemies-Lauv.m4a",
      image:    "previews/Enemies-Lauv.jpg"
    },
    {
      name:     "beat up car",
      artist:   "Henry Moodie",
      duration: "3:34",
      color:    ["#8b9fe8", "#5b6fd4"],
      audio:    "songs/Beat_Up_Car-Henry_Moodie.m4a",
      image:    "previews/Beat_Up_Car-Henry_Moodie.jpg"
    },
    {
      name:     "good old days",
      artist:   "Henry Moodie",
      duration: "2:36",
      color:    ["#f4b98e", "#e8834a"],
      audio:    "songs/Good_Old_Days-Henry_Moodie.m4a",
      image:    "previews/Good_Old_Days-Henry_Moodie.jpg"
    },
    {
      name:     "leave the lights on",
      artist:   "Johnny Orlando",
      duration: "2:55",
      color:    ["#e8849e", "#c0607e"],
      audio:    "songs/Leave_The_Light_On-Johnny_Orlando.m4a",
      image:    "previews/Leave_The_Light_On-Johnny_Orlando.png"
    },
    {
      name:     "Vegas",
      artist:   "Johnny Orlando",
      duration: "2:51",
      color:    ["#2d5a27", "#4a7c59"],
      audio:    "songs/Vegas-Johnny_Orlando.m4a",
      image:    "previews/Vegas-Johnny_Orlando.jpg"
    },
    {
      name:     "August",
      artist:   "Johnny Orlando",
      duration: "3:10",
      color:    ["#e8c87a", "#d4a853"],
      audio:    "songs/August-Johnny_Orlando.m4a",
      image:    "previews/August-Johnny_Orlando.jpg"
    },
    {
      name:     "See You",
      artist:   "Johnny Orlando",
      duration: "2:55",
      color:    ["#5c6bc0", "#3949ab"],
      audio:    "songs/See_You-Johnny_Orlando.m4a",
      image:    "previews/See_You-Johnny_Orlando.jpg"
    },
    {
      name:     "Paris",
      artist:   "The Chainsmokers",
      duration: "3:41",
      color:    ["#81d4fa", "#0288d1"],
      audio:    "songs/Paris-The_Chainsmokers.m4a",
      image:    "previews/Paris-The_Chainsmokers.jpg"
    },
    {
      name:     "Save My Love",
      artist:   "Kygo, Khalid, Gryffin",
      duration: "3:30",
      color:    ["#8b9fe8", "#5b6fd4"],
      audio:    "songs/Save_My_Love-Kygo_Khalid_Gryffin.m4a",
      image:    "previews/Save_My_Love-Kygo_Khalid_Gryffin.jpg"
    },
    {
      name:     "Silence (feat. Khalid)",
      artist:   "Marshmello",
      duration: "3:00",
      color:    ["#f4b98e", "#e8834a"],
      audio:    "songs/Silence_feat_Khalid-Marshmello.m4a",
      image:    "previews/Silence_feat_Khalid-Marshmello.jpg"
    },
    {
      name:     "Beautiful People (feat. Khalid)",
      artist:   "Ed Sheeran",
      duration: "3:17",
      color:    ["#e8849e", "#c0607e"],
      audio:    "songs/Beautiful_People_feat_Khalid-Ed_Sheeran.m4a",
      image:    "previews/Beautiful_People_feat_Khalid-Ed_Sheeran.jpg"
    },
    {
      name:     "Favorite Girl",
      artist:   "Justin Bieber",
      duration: "4:16",
      color:    ["#2d5a27", "#4a7c59"],
      audio:    "songs/Favorite_Girl-Justin_Bieber.m4a",
      image:    "previews/Favorite_Girl-Justin_Bieber.jpg"
    },
    {
      name:     "so american",
      artist:   "Olivia Rodrigo",
      duration: "2:49",
      color:    ["#e8c87a", "#d4a853"],
      audio:    "songs/So_American-Olivia_Rodrigo.m4a",
      image:    "previews/So_American-Olivia_Rodrigo.jpg"
    },
    {
      name:     "lowkey",
      artist:   "NIKI",
      duration: "2:51",
      color:    ["#5c6bc0", "#3949ab"],
      audio:    "songs/Lowkey-Niki.m4a",
      image:    "previews/Lowkey-Niki.jpg"
    },
  ]
};

/* ════ SECTION 2 — COVER ════════════════════════════ */
(function () {
  var photo = document.getElementById("coverPhoto");
  if (!photo) return;

  photo.addEventListener("load", function () {
    document.querySelectorAll(".cover-cell").forEach(function (c) {
      c.style.display = "none";
    });
  });

  photo.addEventListener("error", function () {
    photo.style.display = "none";
    var colors = [
      ["#3d6b4f", "#5a8a6a"],
      ["#5a8a6a", "#7aab8a"],
      ["#7aab8a", "#a8c9b4"],
      ["#4a7c59", "#7aab8a"]
    ];
    document.querySelectorAll(".cover-cell").forEach(function (c, i) {
      c.style.background =
        "linear-gradient(135deg," + colors[i][0] + "," + colors[i][1] + ")";
      c.querySelector("span").style.display = "block";
    });
  });
})();

/* ════ SECTION 3 — HEADER ════════════════════════════ */
function renderHeader() {
  document.getElementById("playlistTitle").textContent = playlist.title;

  var avatar = document.querySelector(".creator-avatar");
  if (avatar && playlist.creatorIcon) {
    avatar.innerHTML =
      '<img src="' + playlist.creatorIcon + '" alt="' + playlist.creator + '" />';
  }

  /* description */
  var descEl = document.getElementById("descriptionText");
  if (descEl && playlist.description) {
    descEl.textContent = playlist.description;
  }

  updateHeaderMeta();
}

/* Update just the song count in the header meta (keeps creator name stable) */
function updateHeaderMeta() {
  var metaEl = document.getElementById("playlistMeta");
  if (!metaEl) return;
  metaEl.innerHTML =
    '<span class="creator-name">' + playlist.creator + "</span>" +
    " \u00B7 " + playlist.songs.length + " songs";
}

/* ════ SECTION 4 — DURATION HELPERS ════════════════════ */

/* Parse "M:SS" or "H:MM:SS" string → total seconds */
function parseDuration(str) {
  if (!str) return 0;
  var parts = str.split(":").map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

/* Format total seconds → "H:MM:SS" or "M:SS" */
function formatTotalDuration(totalSec) {
  totalSec = Math.floor(totalSec);
  var h = Math.floor(totalSec / 3600);
  var m = Math.floor((totalSec % 3600) / 60);
  var s = totalSec % 60;
  if (h > 0) {
    return h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  }
  return m + ":" + (s < 10 ? "0" : "") + s;
}

/* Human-readable short form e.g. "1 hr 6 min" */
function formatDurationHuman(totalSec) {
  totalSec = Math.floor(totalSec);
  var h = Math.floor(totalSec / 3600);
  var m = Math.floor((totalSec % 3600) / 60);
  var s = totalSec % 60;
  var parts = [];
  if (h > 0) parts.push(h + " hr");
  if (m > 0) parts.push(m + " min");
  if (parts.length === 0) parts.push(s + " sec");
  return parts.join(" ");
}

/* Compute total seconds for an array of song objects */
function computeTotalSeconds(songs) {
  return songs.reduce(function (acc, s) { return acc + parseDuration(s.duration); }, 0);
}

/* ════ SECTION 5 — STATE: search + sort ═════════════════ */
var searchQuery  = "";
var sortKey      = null;   /* null | "title" | "artist" */
var sortDir      = "asc";  /* "asc" | "desc" */

/* Returns a filtered + sorted view of playlist.songs (never mutates the original) */
function getVisibleSongs() {
  var q = searchQuery.trim().toLowerCase();

  var result = playlist.songs.filter(function (s) {
    if (!q) return true;
    return s.name.toLowerCase().indexOf(q) !== -1 ||
           s.artist.toLowerCase().indexOf(q) !== -1;
  });

  if (sortKey) {
    var key = sortKey;
    var dir = sortDir === "asc" ? 1 : -1;
    result = result.slice().sort(function (a, b) {
      var va = (key === "title" ? a.name : a.artist).toLowerCase();
      var vb = (key === "title" ? b.name : b.artist).toLowerCase();
      return va < vb ? -dir : va > vb ? dir : 0;
    });
  }

  return result;
}

/* ════ SECTION 6 — TRACK LIST RENDERER ════════════════ */

/* Wrap matching text in <mark> for search highlight */
function highlight(text, query) {
  if (!query) return escHtml(text);
  var q   = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  var re  = new RegExp("(" + q + ")", "gi");
  return escHtml(text).replace(re, "<mark>$1</mark>");
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderTrackList() {
  var list       = document.getElementById("trackList");
  var emptyState = document.getElementById("emptyState");
  var visible    = getVisibleSongs();
  var q          = searchQuery.trim().toLowerCase();

  list.innerHTML = "";

  if (visible.length === 0) {
    emptyState.classList.add("visible");
  } else {
    emptyState.classList.remove("visible");
  }

  visible.forEach(function (song, i) {
    var row = document.createElement("div");
    row.className = "track-row";
    row.style.animationDelay = (0.05 + i * 0.04) + "s";

    /* Store the real index into playlist.songs so playback works correctly */
    var realIndex = playlist.songs.indexOf(song);
    row.dataset.realIndex = realIndex;

    var thumbInner = song.image
      ? '<img src="' + escHtml(song.image) + '" alt="' + escHtml(song.name) + '" />'
      : "<span>" + (song.emoji || "") + "</span>";

    var thumbStyle = song.image
      ? ""
      : "background:linear-gradient(135deg," + song.color[0] + "," + song.color[1] + ");";

    row.innerHTML =
      '<div class="track-num-wrap">' +
        '<span class="track-num">'  + (i + 1) + "</span>" +
        '<span class="play-icon">&#9654;</span>' +
      "</div>" +
      '<div class="track-thumb" style="' + thumbStyle + '">' + thumbInner + "</div>" +
      '<div class="track-info">' +
        '<div class="track-name">'   + highlight(song.name,   q) + "</div>" +
        '<div class="track-artist">' + highlight(song.artist, q) + "</div>" +
      "</div>" +
      '<div class="track-duration" id="dur-' + realIndex + '">' + (song.duration || "\u2014") + "</div>";

    /* Clicking a filtered/sorted row plays by real playlist index */
    row.addEventListener("click", (function (idx) {
      return function () { selectTrack(idx); };
    })(realIndex));

    list.appendChild(row);
  });

  renderFooter(visible);
}

/* ════ SECTION 7 — FOOTER / STATS ══════════════════════ */
function renderFooter(visibleSongs) {
  var totalInfo = document.getElementById("totalInfo");
  if (!totalInfo) return;

  var all      = playlist.songs;
  var shown    = visibleSongs || getVisibleSongs();
  var isFiltered = shown.length !== all.length;
  var totalSec = computeTotalSeconds(shown);
  var durHuman = formatDurationHuman(totalSec);

  var countHtml;
  if (isFiltered) {
    countHtml =
      '<span class="stat-count">' + shown.length + '</span> of ' +
      '<span class="stat-count">' + all.length + '</span> songs' +
      '<span class="stat-filter">filtered</span>';
  } else {
    countHtml = '<span class="stat-count">' + all.length + '</span> songs';
  }

  totalInfo.innerHTML =
    countHtml +
    '<span class="stat-dot">&bull;</span>' +
    '<span class="stat-dur">' + durHuman + '</span>';
}

/* ════ SECTION 8 — SEARCH LOGIC ════════════════════════ */
(function () {
  var input     = document.getElementById("searchInput");
  var clearBtn  = document.getElementById("searchClear");
  if (!input) return;

  input.addEventListener("input", function () {
    searchQuery = input.value;
    clearBtn.classList.toggle("visible", searchQuery.length > 0);
    renderTrackList();
  });

  clearBtn.addEventListener("click", function () {
    input.value = "";
    searchQuery = "";
    clearBtn.classList.remove("visible");
    input.focus();
    renderTrackList();
  });
})();

/* ════ SECTION 9 — SORT LOGIC ══════════════════════════ */
(function () {
  var btns = document.querySelectorAll(".sort-btn");

  btns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.dataset.sort; /* "title" or "artist" */

      if (sortKey === key) {
        /* Same key → toggle direction */
        sortDir = sortDir === "asc" ? "desc" : "asc";
        btn.classList.toggle("desc", sortDir === "desc");
      } else {
        /* New key → reset other buttons, set asc */
        btns.forEach(function (b) { b.classList.remove("active", "desc"); });
        sortKey = key;
        sortDir = "asc";
        btn.classList.add("active");
        btn.classList.remove("desc");
      }

      renderTrackList();
      showToast(
        (key === "title" ? "\uD83D\uDD24 Title" : "\uD83C\uDFA4 Artist") +
        " — " + (sortDir === "asc" ? "A → Z" : "Z → A")
      );
    });
  });
})();

/* ════ SECTION 10 — AUDIO PLAYER ═════════════════════ */
var audio        = document.getElementById("audioEngine");
var playerBar    = document.getElementById("playerBar");
var playerDisc   = document.getElementById("playerDisc");
var playerArt    = document.getElementById("playerArt");
var playerEmoji  = document.getElementById("playerEmoji");
var playerSong   = document.getElementById("playerSong");
var playerArtist = document.getElementById("playerArtist");
var progressBar  = document.getElementById("progressBar");
var timeElapsed  = document.getElementById("timeElapsed");
var timeDuration = document.getElementById("timeDuration");
var btnPlay      = document.getElementById("btnPlay");

var currentIndex = null;
var isPlaying    = false;
var shuffleMode  = false;
var repeatMode   = false;   /* false | "one" | "all" */
var repeatPos    = 0;
var shuffleOrder = [];

function buildShuffleOrder() {
  shuffleOrder = playlist.songs.map(function (_, i) { return i; });
  for (var i = shuffleOrder.length - 1; i > 0; i--) {
    var j   = Math.floor(Math.random() * (i + 1));
    var tmp = shuffleOrder[i]; shuffleOrder[i] = shuffleOrder[j]; shuffleOrder[j] = tmp;
  }
}

function nextTrackIndex() {
  if (shuffleMode) {
    var pos = shuffleOrder.indexOf(currentIndex);
    return shuffleOrder[(pos + 1) % shuffleOrder.length];
  }
  return (currentIndex + 1) % playlist.songs.length;
}

function fmt(s) {
  if (isNaN(s) || s === Infinity) return "0:00";
  var m   = Math.floor(s / 60);
  var sec = Math.floor(s % 60);
  return m + ":" + (sec < 10 ? "0" : "") + sec;
}

function resetProgress() {
  progressBar.value = 0;
  progressBar.style.background = "rgba(255,255,255,0.18)";
  timeElapsed.textContent  = "0:00";
  timeDuration.textContent = "0:00";
}

function restoreDuration() {
  if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
    timeDuration.textContent = fmt(audio.duration);
  } else if (currentIndex !== null && playlist.songs[currentIndex].duration) {
    timeDuration.textContent = playlist.songs[currentIndex].duration;
  }
}

function setPlaying(playing) {
  isPlaying = playing;
  btnPlay.innerHTML = playing ? "&#10074;&#10074;" : "&#9654;";
  btnPlay.style.paddingLeft = playing ? "0" : "2px";

  var tPlay = document.getElementById("btnTransportPlay");
  if (tPlay) tPlay.innerHTML = playing ? "&#10074;&#10074;" : "&#9654;";

  if (playing) {
    playerDisc.classList.add("spinning");
  } else {
    playerDisc.classList.remove("spinning");
  }
}

function selectTrack(index) {
  var song = playlist.songs[index];

  /* Remove is-playing from all rows, then re-apply to the correct one */
  document.querySelectorAll(".track-row").forEach(function (r) {
    r.classList.remove("is-playing");
  });

  /* Find the visible row that maps to this real index */
  var activeRow = document.querySelector(".track-row[data-real-index='" + index + "']");
  if (activeRow) {
    activeRow.classList.add("is-playing");

    var scroller = document.getElementById("trackListScroll");
    if (scroller) {
      var rowTop    = activeRow.offsetTop;
      var rowHeight = activeRow.offsetHeight;
      var scrollTop = scroller.scrollTop;
      var visible   = scroller.clientHeight;
      if (rowTop < scrollTop) {
        scroller.scrollTo({ top: rowTop - 8, behavior: "smooth" });
      } else if (rowTop + rowHeight > scrollTop + visible) {
        scroller.scrollTo({ top: rowTop + rowHeight - visible + 8, behavior: "smooth" });
      }
    }
  }

  playerSong.textContent   = song.name;
  playerArtist.textContent = song.artist;
  playerDisc.style.background =
    "linear-gradient(135deg," + song.color[0] + "," + song.color[1] + ")";

  if (song.image) {
    playerArt.src             = song.image;
    playerArt.style.display   = "block";
    playerEmoji.style.display = "none";
  } else {
    playerArt.style.display   = "none";
    playerEmoji.style.display = "block";
    playerEmoji.textContent   = song.emoji || "\uD83C\uDFB5";
  }

  playerBar.classList.add("active");

  if (song.audio) {
    audio.src = song.audio;
    audio.load();
    currentIndex = index;
    resetProgress();
    audio.play()
      .then(function ()  { setPlaying(true); })
      .catch(function (e) {
        console.warn("Autoplay blocked:", e.message);
        setPlaying(false);
      });
  } else {
    audio.pause();
    audio.src    = "";
    currentIndex = index;
    setPlaying(false);
    resetProgress();
    if (song.duration) timeDuration.textContent = song.duration;
  }
}

/* Play / pause — mini player button */
btnPlay.addEventListener("click", function () {
  if (!audio.src || audio.src === window.location.href) return;
  if (isPlaying) {
    audio.pause();
    setPlaying(false);
  } else {
    audio.play().then(function () { setPlaying(true); });
  }
});

/* Progress bar sync */
audio.addEventListener("timeupdate", function () {
  if (!audio.duration) return;
  var pct = (audio.currentTime / audio.duration) * 100;
  progressBar.value = pct;
  progressBar.style.background =
    "linear-gradient(to right, var(--sage-light) " + pct + "%, rgba(255,255,255,0.18) " + pct + "%)";
  timeElapsed.textContent = fmt(audio.currentTime);
});

/* Set duration display when metadata is ready */
audio.addEventListener("loadedmetadata", function () {
  timeDuration.textContent = fmt(audio.duration);
  if (currentIndex !== null) {
    var el  = document.getElementById("dur-" + currentIndex);
    var dur = formatTotalDuration(audio.duration);
    if (el && dur) el.textContent = dur;
  }
});

/* Track ended — handle repeat / advance */
audio.addEventListener("ended", function () {
  setPlaying(false);
  resetProgress();

  if (repeatMode === "one") {
    restoreDuration();
    audio.currentTime = 0;
    audio.play()
      .then(function ()  { setPlaying(true); })
      .catch(function () {});

  } else if (repeatMode === "all" || repeatMode === false) {
    var next = nextTrackIndex();
    if (next !== null && (repeatMode === "all" || next > currentIndex || shuffleMode)) {
      selectTrack(next);
    }
  }
});

/* Seek */
progressBar.addEventListener("input", function () {
  if (!audio.duration) return;
  audio.currentTime = (progressBar.value / 100) * audio.duration;
});

/* ════ SECTION 11 — TRANSPORT CONTROLS ═══════════════ */
function goToNextTrack() {
  if (currentIndex === null) { selectTrack(0); return; }
  selectTrack(nextTrackIndex());
}

function goToPrevTrack() {
  if (currentIndex === null) { selectTrack(0); return; }
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  if (shuffleMode) {
    var pos  = shuffleOrder.indexOf(currentIndex);
    var prev = shuffleOrder[(pos - 1 + shuffleOrder.length) % shuffleOrder.length];
    selectTrack(prev);
  } else {
    selectTrack((currentIndex - 1 + playlist.songs.length) % playlist.songs.length);
  }
}

document.getElementById("btnTransportPlay").addEventListener("click", function () {
  if (isPlaying) {
    audio.pause();
    setPlaying(false);
  } else if (audio.src && audio.src !== window.location.href) {
    audio.play().then(function () { setPlaying(true); }).catch(function () {});
  } else {
    selectTrack(0);
  }
});

document.getElementById("btnTransportNext").addEventListener("click", goToNextTrack);
document.getElementById("btnTransportBack").addEventListener("click", goToPrevTrack);

document.getElementById("btnShuffle").addEventListener("click", function () {
  shuffleMode = !shuffleMode;
  this.classList.toggle("active", shuffleMode);
  if (shuffleMode) buildShuffleOrder();
  showToast(shuffleMode ? "\uD83D\uDD00 Shuffle on" : "\uD83D\uDD00 Shuffle off");
});

document.getElementById("btnRepeat").addEventListener("click", function () {
  repeatPos  = (repeatPos + 1) % 3;
  var modes  = [false, "one", "all"];
  var labels = ["\uD83D\uDD01 Repeat off", "\uD83D\uDD02 Repeat one", "\uD83D\uDD01 Repeat all"];
  repeatMode = modes[repeatPos];

  this.classList.toggle("active", repeatMode !== false);
  this.style.position = "relative";
  this.style.fontSize = repeatMode === "one" ? "10px" : "13px";
  this.innerHTML = repeatMode === "one"
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg><span style="position:absolute;top:1px;right:3px;font-size:9px;font-weight:700;font-family:var(--font-sf)">1</span>'
    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>';

  showToast(labels[repeatPos]);
});

/* ════ SECTION 12 — SHARE BUTTON ═════════════════════ */
function initShareButton() {
  document.getElementById("shareBtn").addEventListener("click", function () {
    var data = {
      title: playlist.title,
      text:  'Check out "' + playlist.title + '" by ' + playlist.creator,
      url:   window.location.href
    };
    if (navigator.share) {
      navigator.share(data).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
        .then(function ()  { showToast("\uD83D\uDD17 Link copied!"); })
        .catch(function () { showToast("\uD83C\uDFB5 Ready to share!"); });
    } else {
      showToast("\uD83C\uDFB5 Ready to share!");
    }
  });
}

function showToast(msg) {
  var t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(function () { t.classList.remove("show"); }, 2800);
}

/* ════ SECTION 13 — INIT ══════════════════════════════ */
renderHeader();
renderTrackList();
initShareButton();
buildShuffleOrder();

/* Scroll fade — hide when at bottom */
(function () {
  var scroller = document.getElementById("trackListScroll");
  if (!scroller) return;
  function checkBottom() {
    var atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 8;
    scroller.classList.toggle("at-bottom", atBottom);
  }
  scroller.addEventListener("scroll", checkBottom, { passive: true });
  setTimeout(checkBottom, 100);
})();

/* ════ SECTION 14 — RELATED PLAYLISTS SLIDER ═════════ */

/* ── Edit this array to add / remove related playlists ─ */
var relatedPlaylists = [
  {
    title: "Midnight Drives",
    cover: "playlist_covers/midnight_drives.jpg",
    href:  "midnight-drives.html"
  },

];

(function () {
  var track     = document.getElementById("sliderTrack");
  var prevBtn   = document.getElementById("sliderPrev");
  var nextBtn   = document.getElementById("sliderNext");
  if (!track || !prevBtn || !nextBtn) return;

  /* ── Build cards dynamically ─────────────────────── */
  relatedPlaylists.forEach(function (pl, i) {
    var card = document.createElement("div");
    card.className = "playlist-card";
    card.style.animationDelay = (0.05 + i * 0.06) + "s";

    /* Cover link */
    var coverLink = document.createElement("a");
    coverLink.href      = pl.href;
    coverLink.className = "playlist-card-link";
    coverLink.setAttribute("aria-label", pl.title);

    if (pl.cover) {
      var img = document.createElement("img");
      img.src   = pl.cover;
      img.alt   = pl.title;
      img.onerror = function () {
        /* Fallback: show emoji if image missing */
        coverLink.classList.add("no-image");
        coverLink.innerHTML = "🎵";
      };
      coverLink.appendChild(img);
    } else {
      coverLink.classList.add("no-image");
      coverLink.textContent = "🎵";
    }

    /* Title link */
    var titleLink = document.createElement("a");
    titleLink.href      = pl.href;
    titleLink.className = "playlist-card-title-link";
    titleLink.textContent = pl.title;

    card.appendChild(coverLink);
    card.appendChild(titleLink);
    track.appendChild(card);
  });

  /* ── Slider state ────────────────────────────────── */
  var currentOffset = 0;

  function getCardWidth() {
    var first = track.querySelector(".playlist-card");
    if (!first) return 162;
    var style = getComputedStyle(track);
    var gap   = parseFloat(style.gap) || 14;
    return first.offsetWidth + gap;
  }

  function getMaxOffset() {
    var wrapWidth  = track.parentElement.offsetWidth;
    var totalWidth = track.scrollWidth;
    return Math.max(0, totalWidth - wrapWidth);
  }

  function slideTo(offset) {
    var max     = getMaxOffset();
    currentOffset = Math.max(0, Math.min(offset, max));
    track.style.transform = "translateX(-" + currentOffset + "px)";
    prevBtn.disabled = currentOffset <= 0;
    nextBtn.disabled = currentOffset >= max;
  }

  /* Init */
  slideTo(0);

  nextBtn.addEventListener("click", function () {
    slideTo(currentOffset + getCardWidth() * 2);
  });
  prevBtn.addEventListener("click", function () {
    slideTo(currentOffset - getCardWidth() * 2);
  });

  /* ── Mouse wheel horizontal scroll ──────────────── */
  track.parentElement.addEventListener("wheel", function (e) {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; /* native horizontal */
    e.preventDefault();
    slideTo(currentOffset + e.deltaY * 0.8);
  }, { passive: false });

  /* ── Touch / drag support ────────────────────────── */
  var dragStart    = null;
  var dragStartOff = 0;

  function onPointerDown(e) {
    dragStart    = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    dragStartOff = currentOffset;
    track.classList.add("is-dragging");
    /* Prevent link navigation during drag */
    track.querySelectorAll("a").forEach(function (a) {
      a.setAttribute("data-drag-lock", "1");
    });
  }

  function onPointerMove(e) {
    if (dragStart === null) return;
    var x    = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    var diff = dragStart - x;
    slideTo(dragStartOff + diff);
  }

  function onPointerUp(e) {
    if (dragStart === null) return;
    var x    = e.type === "touchend" ? e.changedTouches[0].clientX : e.clientX;
    var moved = Math.abs(dragStart - x);
    dragStart = null;
    track.classList.remove("is-dragging");
    /* Re-enable links only if barely moved */
    setTimeout(function () {
      track.querySelectorAll("a[data-drag-lock]").forEach(function (a) {
        a.removeAttribute("data-drag-lock");
      });
    }, 10);
    /* Block click-through if drag distance > 6px */
    if (moved > 6) {
      track.addEventListener("click", function blockClick(ev) {
        ev.preventDefault();
        track.removeEventListener("click", blockClick);
      }, { once: true, capture: true });
    }
  }

  track.addEventListener("mousedown",  onPointerDown);
  track.addEventListener("mousemove",  onPointerMove);
  track.addEventListener("mouseup",    onPointerUp);
  track.addEventListener("mouseleave", onPointerUp);
  track.addEventListener("touchstart", onPointerDown, { passive: true });
  track.addEventListener("touchmove",  onPointerMove, { passive: true });
  track.addEventListener("touchend",   onPointerUp);

  /* Re-clamp on resize */
  window.addEventListener("resize", function () {
    slideTo(currentOffset);
  }, { passive: true });
})();
