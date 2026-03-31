/* ════════════════════════════════════════════════════════
   script.js — Playlist Share Preview Card
   Edit Section 1 to customise your playlist.
════════════════════════════════════════════════════════ */

/* ════ SECTION 1 — PLAYLIST DATA (edit here) ═════════ */
var playlist = {
  title:       "Forest Dusk Sessions",
  creator:     "grace",
  creatorIcon: "user_icon/icon.jpg",
  totalSongs:  20,
  coverEmoji:  ["\uD83C\uDF3F", "\uD83C\uDF42", "\uD83C\uDF05", "\uD83C\uDF38"],

  songs: [
    {
      name:     "Love U Like That",
      artist:   "Lauv",
      duration: "3:24",
      color:    ["#8b9fe8", "#5b6fd4"],
      audio:    "songs/Love_U_Like_That-Lauv.m4a",
      image:    "previews/Love_U_Like_That-Lauv.jpg" 
    },
    {
      name:     "Mean It",
      artist:   "Lauv",
      duration: "3:52",
      color:    ["#f4b98e", "#e8834a"],
      audio:    "songs/Mean_It-Lauv_Lany.m4a",
      image:    "previews/Mean_It-Lauv_Lany.jpg" 
    },
    {
      name:     "Bloom",
      artist:   "The Paper Kites",
      duration: "3:44",
      emoji:    "\uD83C\uDF38",
      color:    ["#e8849e", "#c0607e"]
    },
    {
      name:     "Skinny Love",
      artist:   "Bon Iver",
      duration: "3:58",
      emoji:    "\uD83C\uDF32",
      color:    ["#2d5a27", "#4a7c59"]
    },
    {
      name:     "August",
      artist:   "Taylor Swift",
      duration: "4:21",
      emoji:    "\uD83C\uDF3E",
      color:    ["#e8c87a", "#d4a853"]
    },
    {
      name:     "The Night Will Always Win",
      artist:   "Manchester Orchestra",
      duration: "4:02",
      emoji:    "\uD83C\uDF19",
      color:    ["#5c6bc0", "#3949ab"]
    },
    {
      name:     "Holocene",
      artist:   "Bon Iver",
      duration: "5:37",
      emoji:    "\u2603\uFE0F",
      color:    ["#81d4fa", "#0288d1"]
    }
  ]
};

/* ════ SECTION 2 — COVER (photo already in HTML) ═════ */
/* Hide emoji cells when cover photo loads successfully */
(function() {
  var photo = document.getElementById("coverPhoto");
  if (!photo) return;
  photo.addEventListener("load", function() {
    var cells = document.querySelectorAll(".cover-cell");
    cells.forEach(function(c) { c.style.display = "none"; });
  });
  photo.addEventListener("error", function() {
    /* Photo failed — remove it and show gradient cells */
    photo.style.display = "none";
    var cells = document.querySelectorAll(".cover-cell");
    var colors = [
      ["#3d6b4f","#5a8a6a"],
      ["#5a8a6a","#7aab8a"],
      ["#7aab8a","#a8c9b4"],
      ["#4a7c59","#7aab8a"]
    ];
    cells.forEach(function(c, i) {
      c.style.background = "linear-gradient(135deg," + colors[i][0] + "," + colors[i][1] + ")";
      c.querySelector("span").style.display = "block";
    });
  });
})();

/* ════ SECTION 3 — HEADER ═══════════════════════════ */
function renderHeader() {
  document.getElementById("playlistTitle").textContent = playlist.title;

  /* Swap emoji avatar for the creator icon image if provided */
  var avatar = document.querySelector(".creator-avatar");
  if (avatar && playlist.creatorIcon) {
    avatar.innerHTML = '<img src="' + playlist.creatorIcon + '" alt="' + playlist.creator + '" />';
  }

  /* Build meta text */
  var meta = document.getElementById("playlistMeta");
  meta.innerHTML =
    '<span class="creator-name">' + playlist.creator + '</span>' +
    ' \u00B7 ' + playlist.totalSongs + ' songs';
}

/* ════ SECTION 4 — TRACK LIST ═══════════════════════ */
/* Duration cache: stores actual audio durations keyed by audio src */
var durationCache = {};

function formatTime(s) {
  if (isNaN(s) || s === Infinity || s <= 0) return null;
  var m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return m + ":" + (sec < 10 ? "0" : "") + sec;
}

function fetchAudioDuration(src, callback) {
  if (durationCache[src]) { callback(durationCache[src]); return; }
  var tmp = new Audio();
  tmp.preload = "metadata";
  tmp.addEventListener("loadedmetadata", function() {
    var dur = formatTime(tmp.duration);
    if (dur) {
      durationCache[src] = dur;
      callback(dur);
    }
    tmp.src = "";
  });
  tmp.addEventListener("error", function() { tmp.src = ""; });
  tmp.src = src;
}

function renderTrackList() {
  var list = document.getElementById("trackList");

  playlist.songs.forEach(function(song, i) {
    var row = document.createElement("div");
    row.className = "track-row";
    row.style.animationDelay = (0.1 + i * 0.055) + "s";
    row.dataset.index = i;

    var thumbInner;
    if (song.image) {
      thumbInner = '<img src="' + song.image + '" alt="' + song.name + '" />';
    } else {
      thumbInner = "<span>" + song.emoji + "</span>";
    }
    var thumbStyle = song.image ? "" :
      "background:linear-gradient(135deg," + song.color[0] + "," + song.color[1] + ");";

    /* Use static duration as initial value; will update if audio loads */
    var displayDur = song.duration || "—";

    row.innerHTML =
      '<div class="track-num-wrap">' +
        '<span class="track-num">' + (i + 1) + "</span>" +
        '<span class="play-icon">&#9654;</span>' +
      "</div>" +
      '<div class="track-thumb" style="' + thumbStyle + '">' + thumbInner + "</div>" +
      '<div class="track-info">' +
        '<div class="track-name">'   + song.name   + "</div>" +
        '<div class="track-artist">' + song.artist + "</div>" +
      "</div>" +
      '<div class="track-duration" id="dur-' + i + '">' + displayDur + "</div>";

    row.addEventListener("click", function() { selectTrack(i); });
    list.appendChild(row);

    /* Dynamically update duration from actual audio metadata */
    if (song.audio) {
      fetchAudioDuration(song.audio, function(realDur) {
        var el = document.getElementById("dur-" + i);
        if (el) el.textContent = realDur;
        /* also update the playlist data so player bar is accurate */
        song.duration = realDur;
      });
    }
  });
}

/* ════ SECTION 5 — FOOTER ═══════════════════════════ */
function renderFooter() {
  document.getElementById("totalInfo").innerHTML =
    "Showing <strong>" + playlist.songs.length +
    " of " + playlist.totalSongs + "</strong> songs";
}

/* ════ SECTION 6 — AUDIO PLAYER ════════════════════ */
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
var repeatMode   = false;    /* false | "one" | "all" */
var repeatCycle  = ["off", "one", "all"];
var repeatPos    = 0;

/* Shuffle state */
var shuffleOrder = [];

function buildShuffleOrder() {
  shuffleOrder = playlist.songs.map(function(_, i) { return i; });
  for (var i = shuffleOrder.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = shuffleOrder[i]; shuffleOrder[i] = shuffleOrder[j]; shuffleOrder[j] = tmp;
  }
}

function nextTrackIndex() {
  if (shuffleMode) {
    /* find current position in shuffleOrder */
    var pos = shuffleOrder.indexOf(currentIndex);
    return shuffleOrder[(pos + 1) % shuffleOrder.length];
  }
  return (currentIndex + 1) % playlist.songs.length;
}

function selectTrack(index) {
  var song = playlist.songs[index];

  document.querySelectorAll(".track-row").forEach(function(r) {
    r.classList.remove("is-playing");
  });
  var activeRow = document.querySelectorAll(".track-row")[index];
  activeRow.classList.add("is-playing");

  /* Scroll the active track into view smoothly */
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

  playerSong.textContent   = song.name;
  playerArtist.textContent = song.artist;
  playerDisc.style.background =
    "linear-gradient(135deg," + song.color[0] + "," + song.color[1] + ")";

  if (song.image) {
    playerArt.src = song.image;
    playerArt.style.display = "block";
    playerEmoji.style.display = "none";
  } else {
    playerArt.style.display = "none";
    playerEmoji.style.display = "block";
    playerEmoji.textContent = song.emoji || "\uD83C\uDFB5";
  }

  playerBar.classList.add("active");

  if (song.audio) {
    /* Always reload so replaying after finish works correctly */
    audio.src = song.audio;
    audio.load();
    currentIndex = index;
    resetProgress();
    audio.play().then(function() {
      setPlaying(true);
    }).catch(function(e) {
      console.warn("Autoplay blocked:", e.message);
      setPlaying(false);
    });
  } else {
    audio.pause();
    audio.src = "";
    currentIndex = index;
    setPlaying(false);
    resetProgress();
    /* Show static duration */
    if (song.duration) timeDuration.textContent = song.duration;
  }
}

function setPlaying(playing) {
  isPlaying = playing;
  btnPlay.innerHTML = playing ? "&#10074;&#10074;" : "&#9654;";
  btnPlay.style.paddingLeft = playing ? "0" : "2px";
  /* Transport play button */
  var tPlay = document.getElementById("btnTransportPlay");
  if (tPlay) tPlay.innerHTML = playing ? "&#10074;&#10074;" : "&#9654;";
  if (playing) {
    playerDisc.classList.add("spinning");
  } else {
    playerDisc.classList.remove("spinning");
  }
}

btnPlay.addEventListener("click", function() {
  if (!audio.src || audio.src === window.location.href) return;
  if (isPlaying) {
    audio.pause();
    setPlaying(false);
  } else {
    audio.play().then(function() { setPlaying(true); });
  }
});

audio.addEventListener("timeupdate", function() {
  if (!audio.duration) return;
  var pct = (audio.currentTime / audio.duration) * 100;
  progressBar.value = pct;
  progressBar.style.background =
    "linear-gradient(to right, var(--sage-light) " + pct + "%, rgba(255,255,255,0.18) " + pct + "%)";
  timeElapsed.textContent = fmt(audio.currentTime);
});

audio.addEventListener("loadedmetadata", function() {
  /* FIX: always set duration from current audio element on (re)load */
  timeDuration.textContent = fmt(audio.duration);
  /* Update the duration display in the track list dynamically */
  if (currentIndex !== null) {
    var el = document.getElementById("dur-" + currentIndex);
    var dur = formatTime(audio.duration);
    if (el && dur) el.textContent = dur;
  }
});

audio.addEventListener("ended", function() {
  setPlaying(false);
  resetProgress();

  if (repeatMode === "one") {
    /* Replay same track */
    audio.currentTime = 0;
    audio.play().then(function() { setPlaying(true); }).catch(function(){});
  } else if (repeatMode === "all" || repeatMode === false) {
    /* Advance to next (repeat-all wraps, no-repeat stops at end) */
    var next = nextTrackIndex();
    if (next !== null && (repeatMode === "all" || next > currentIndex || shuffleMode)) {
      selectTrack(next);
    }
  }
});

progressBar.addEventListener("input", function() {
  if (!audio.duration) return;
  audio.currentTime = (progressBar.value / 100) * audio.duration;
});

function fmt(s) {
  if (isNaN(s) || s === Infinity) return "0:00";
  var m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return m + ":" + (sec < 10 ? "0" : "") + sec;
}

function resetProgress() {
  progressBar.value = 0;
  progressBar.style.background = "rgba(255,255,255,0.18)";
  timeElapsed.textContent  = "0:00";
  timeDuration.textContent = "0:00";
}

/* ════ SECTION 7 — TRANSPORT CONTROLS ══════════════ */
function goToNextTrack() {
  if (currentIndex === null) { selectTrack(0); return; }
  var next = nextTrackIndex();
  if (next !== null) selectTrack(next);
}

document.getElementById("btnTransportPlay").addEventListener("click", function() {
  if (isPlaying) {
    audio.pause();
    setPlaying(false);
  } else if (audio.src && audio.src !== window.location.href) {
    audio.play().then(function() { setPlaying(true); }).catch(function(){});
  } else {
    /* No track selected — start from first */
    selectTrack(0);
  }
});

document.getElementById("btnShuffle").addEventListener("click", function() {
  shuffleMode = !shuffleMode;
  this.classList.toggle("active", shuffleMode);
  if (shuffleMode) buildShuffleOrder();
  showToast(shuffleMode ? "\uD83D\uDD00 Shuffle on" : "\uD83D\uDD00 Shuffle off");
});

/* Next button — transport bar only */
document.getElementById("btnTransportNext").addEventListener("click", goToNextTrack);

/* Back button */
function goToPrevTrack() {
  if (currentIndex === null) { selectTrack(0); return; }
  /* If more than 3s in, restart current track instead */
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  if (shuffleMode) {
    var pos = shuffleOrder.indexOf(currentIndex);
    var prev = shuffleOrder[(pos - 1 + shuffleOrder.length) % shuffleOrder.length];
    selectTrack(prev);
  } else {
    selectTrack((currentIndex - 1 + playlist.songs.length) % playlist.songs.length);
  }
}
document.getElementById("btnTransportBack").addEventListener("click", goToPrevTrack);

document.getElementById("btnRepeat").addEventListener("click", function() {
  repeatPos = (repeatPos + 1) % 3;
  var modes = [false, "one", "all"];
  repeatMode = modes[repeatPos];
  var labels = ["\uD83D\uDD01 Repeat off", "\uD83D\uDD02 Repeat one", "\uD83D\uDD01 Repeat all"];
  this.classList.toggle("active", repeatMode !== false);
  /* Show "1" badge on repeat-one */
  this.style.fontSize = repeatMode === "one" ? "10px" : "13px";
  this.innerHTML = repeatMode === "one"
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg><span style="position:absolute;top:1px;right:3px;font-size:9px;font-weight:700;font-family:var(--font-sf)">1</span>'
    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>';
  this.style.position = "relative";
  showToast(labels[repeatPos]);
});

/* ════ SECTION 8 — SHARE BUTTON ════════════════════ */
function initShareButton() {
  document.getElementById("shareBtn").addEventListener("click", function() {
    var data = {
      title: playlist.title,
      text:  'Check out "' + playlist.title + '" by ' + playlist.creator,
      url:   window.location.href
    };
    if (navigator.share) {
      navigator.share(data).catch(function() {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
        .then(function()  { showToast("\uD83D\uDD17 Link copied!"); })
        .catch(function() { showToast("\uD83C\uDFB5 Ready to share!"); });
    } else {
      showToast("\uD83C\uDFB5 Ready to share!");
    }
  });
}

function showToast(msg) {
  var t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(function() { t.classList.remove("show"); }, 2800);
}

/* ════ SECTION 9 — INIT ════════════════════════════ */
renderHeader();
renderTrackList();
renderFooter();
initShareButton();
buildShuffleOrder();

/* ── Scroll listener: remove fade when at bottom ─── */
(function() {
  var scroller = document.getElementById("trackListScroll");
  if (!scroller) return;
  function checkBottom() {
    var atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 8;
    scroller.classList.toggle("at-bottom", atBottom);
  }
  scroller.addEventListener("scroll", checkBottom, { passive: true });
  /* Initial check (short list = already at bottom) */
  setTimeout(checkBottom, 100);
})();
