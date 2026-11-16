/* 김상진님의 평생 여행 로그 — 앱 로직
   저장: 글·체크·코드 = localStorage, 사진 = IndexedDB(실패 시 localStorage) */
(function () {
  "use strict";

  var T = window.TRIP;
  var LS = "travelLog.v1";
  var PHOTO_LS = "tlp.";

  /* ---------------- 상태 ---------------- */
  function blank() {
    return { days: {}, comps: {}, checklist: {}, todos: {}, codes: {}, summary: { moment: "", line: "" }, settings: { big: false } };
  }
  function loadState() {
    var base = blank();
    try {
      var raw = JSON.parse(localStorage.getItem(LS) || "{}");
      for (var k in raw) if (raw[k] != null) base[k] = raw[k];
      if (!base.summary) base.summary = { moment: "", line: "" };
      if (!base.settings) base.settings = { big: false };
    } catch (e) { /* 저장값이 깨졌으면 빈 상태로 시작 */ }
    return base;
  }
  var S = loadState();
  var saveTimer = null;
  function save(now) {
    if (now) {
      try { localStorage.setItem(LS, JSON.stringify(S)); }
      catch (e) { toast("저장 공간이 부족해 저장하지 못했어요"); }
      return;
    }
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () { save(true); }, 350);
  }

  /* ---------------- 사진 저장소 ---------------- */
  var PhotoStore = (function () {
    var dbp = null;
    function openDB() {
      if (dbp) return dbp;
      dbp = new Promise(function (res, rej) {
        if (!window.indexedDB) return rej(new Error("no idb"));
        var req;
        try { req = indexedDB.open("travelLogPhotos", 1); } catch (e) { return rej(e); }
        req.onupgradeneeded = function () {
          if (!req.result.objectStoreNames.contains("photos")) req.result.createObjectStore("photos");
        };
        req.onsuccess = function () { res(req.result); };
        req.onerror = function () { rej(req.error); };
      });
      return dbp;
    }
    return {
      put: function (id, dataUrl) {
        return openDB().then(function (db) {
          return new Promise(function (res, rej) {
            var tx = db.transaction("photos", "readwrite");
            tx.objectStore("photos").put({ dataUrl: dataUrl, ts: Date.now() }, id);
            tx.oncomplete = function () { res(true); };
            tx.onerror = function () { rej(tx.error); };
          });
        }).catch(function () {
          try { localStorage.setItem(PHOTO_LS + id, dataUrl); } catch (e) { toast("사진 저장 공간이 부족해요"); }
        });
      },
      get: function (id) {
        return openDB().then(function (db) {
          return new Promise(function (res, rej) {
            var tx = db.transaction("photos", "readonly");
            var r = tx.objectStore("photos").get(id);
            r.onsuccess = function () { res(r.result ? r.result.dataUrl : null); };
            r.onerror = function () { rej(r.error); };
          });
        }).catch(function () { return null; }).then(function (v) {
          return v || localStorage.getItem(PHOTO_LS + id);
        });
      },
      del: function (id) {
        try { localStorage.removeItem(PHOTO_LS + id); } catch (e) {}
        return openDB().then(function (db) {
          return new Promise(function (res) {
            var tx = db.transaction("photos", "readwrite");
            tx.objectStore("photos").delete(id);
            tx.oncomplete = res; tx.onerror = res;
          });
        }).catch(function () {});
      }
    };
  })();

  var photoCache = {};
  function getPhoto(id) {
    if (photoCache[id]) return Promise.resolve(photoCache[id]);
    return PhotoStore.get(id).then(function (v) { if (v) photoCache[id] = v; return v; });
  }

  /* ---------------- 유틸 ---------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function todayStr() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function parseDate(s) {
    if (!s) return null;
    var m = String(s).match(/(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return null;
    return Date.UTC(+m[1], +m[2] - 1, +m[3]);
  }
  function daysUntil(dateStr) {
    var t = parseDate(dateStr);
    if (t == null) return null;
    var now = new Date();
    var today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((t - today) / 86400000);
  }
  function ddayText(n) {
    if (n == null) return "—";
    if (n === 0) return "D-DAY";
    return n > 0 ? "D-" + n : "D+" + Math.abs(n);
  }
  function parseDuration(s) {
    if (!s) return null;
    s = String(s).trim();
    var hms = s.match(/(\d{1,2})\s*:\s*(\d{1,2})(?:\s*:\s*(\d{1,2}))?/);
    if (hms) {
      if (hms[3] != null) return (+hms[1]) * 3600 + (+hms[2]) * 60 + (+hms[3]);
      return (+hms[1]) * 3600 + (+hms[2]) * 60;
    }
    var h = s.match(/(\d+)\s*시간/), mm = s.match(/(\d+)\s*분/);
    if (h || mm) return (h ? +h[1] * 3600 : 0) + (mm ? +mm[1] * 60 : 0);
    return null;
  }
  function fmtDur(sec) {
    if (sec == null) return "";
    var h = Math.floor(sec / 3600), m = Math.round((sec % 3600) / 60), s2 = sec % 60;
    if (h) return h + "시간 " + String(m).padStart(2, "0") + "분";
    if (m) return m + "분 " + String(s2).padStart(2, "0") + "초";
    return s2 + "초";
  }
  var toastTimer = null;
  function toast(msg) {
    var el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 2300);
  }
  function legacyCopy(text) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (e) { return false; }
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }).catch(function () { return legacyCopy(text); });
    }
    return Promise.resolve(legacyCopy(text));
  }

  /* ---------------- 지도 ---------------- */
  var ROB = {
    LAT: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90],
    X: [1.0000, 0.9986, 0.9954, 0.9900, 0.9822, 0.9730, 0.9600, 0.9427, 0.9216, 0.8962, 0.8679, 0.8350, 0.7986, 0.7597, 0.7186, 0.6732, 0.6213, 0.5722, 0.5322],
    Y: [0.0000, 0.0620, 0.1240, 0.1860, 0.2480, 0.3100, 0.3720, 0.4340, 0.4958, 0.5571, 0.6176, 0.6769, 0.7346, 0.7903, 0.8435, 0.8936, 0.9394, 0.9761, 1.0000]
  };
  var W = 1000, H = 440, CX = 120, SCALE = W / 5.332;

  function shiftLon(lon) { return ((lon - CX + 180) % 360 + 360) % 360 - 180; }
  function projPx(lon, lat) {
    var sl = shiftLon(lon);
    var a = Math.min(Math.abs(lat), 90);
    var i = Math.min(17, Math.floor(a / 5));
    var t = (a - ROB.LAT[i]) / 5;
    var xc = ROB.X[i] + (ROB.X[i + 1] - ROB.X[i]) * t;
    var yc = ROB.Y[i] + (ROB.Y[i + 1] - ROB.Y[i]) * t;
    return [0.8487 * (sl * Math.PI / 180) * xc, 1.3523 * yc * (lat < 0 ? -1 : 1)];
  }
  function toSvg(lon, lat) {
    var p = projPx(lon, lat);
    return [(p[0] + 2.666) * SCALE, (1.3523 - p[1]) * SCALE];
  }
  function ringPath(ring) {
    var d = "", prev = null, move = true;
    for (var i = 0; i < ring.length; i++) {
      var sl = shiftLon(ring[i][0]);
      var p = projPx(ring[i][0], ring[i][1]);
      var x = ((p[0] + 2.666) * SCALE).toFixed(1);
      var y = ((1.3523 - p[1]) * SCALE).toFixed(1);
      if (prev !== null && Math.abs(sl - prev) > 180) move = true;
      d += (move ? "M" : "L") + x + " " + y;
      prev = sl; move = false;
    }
    return d + "Z";
  }
  function arcPath(a, b, curve) {
    var A = toSvg(a.lon, a.lat), B = toSvg(b.lon, b.lat);
    var mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
    var dx = B[0] - A[0], dy = B[1] - A[1];
    var nx = -dy, ny = dx, nrm = Math.sqrt(nx * nx + ny * ny) || 1;
    var L = Math.sqrt(dx * dx + dy * dy);
    var cx = mx + nx / nrm * curve * L, cy = my + ny / nrm * curve * L;
    return {
      d: "M" + A[0].toFixed(1) + " " + A[1].toFixed(1) + "Q" + cx.toFixed(1) + " " + cy.toFixed(1) + " " + B[0].toFixed(1) + " " + B[1].toFixed(1),
      mid: [(A[0] + 2 * cx + B[0]) / 4, (A[1] + 2 * cy + B[1]) / 4]
    };
  }

  function renderMap() {
    var wrap = $("#mapwrap");
    if (!window.WORLD) { wrap.innerHTML = '<div class="mapempty">지도 데이터를 불러오지 못했어요.</div>'; return; }
    var cls = {};
    T.countries.forEach(function (c) { cls[c.code] = c.cls; });
    var out = [];
    out.push('<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="세계 지도 — 대한민국·호주·헝가리를 색칠하고 도시 핀과 예정 항로를 표시">');
    out.push('<rect width="' + W + '" height="' + H + '" fill="#DCEBF4"/>');

    var grid = "";
    [-60, -30, 0, 30, 60].forEach(function (lat) {
      var d = "";
      for (var lon = CX - 180; lon <= CX + 180; lon += 6) {
        var p = toSvg(lon, lat);
        d += (lon === CX - 180 ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1);
      }
      grid += '<path d="' + d + '" fill="none" stroke="#ffffff" stroke-width="1" opacity=".45"/>';
    });
    out.push(grid);

    var land = "";
    window.WORLD.forEach(function (c) {
      var kind = cls[c[0]];
      var fill = "#F3F1EA", sw = 0.7;
      if (kind === "home" || kind === "visited") { fill = "#2F7D6B"; sw = 1; }
      else if (kind === "future") { fill = "#E9A23B"; sw = 1; }
      var d = c[2].map(ringPath).join("");
      land += '<path d="' + d + '" fill="' + fill + '" stroke="#FFFFFF" stroke-width="' + sw + '" stroke-linejoin="round"><title>' + esc(c[1]) + "</title></path>";
    });
    out.push(land);

    var cityByKey = {};
    T.cities.forEach(function (c) { cityByKey[c.key] = c; });
    T.route.forEach(function (r) {
      var a = cityByKey[r.from], b = cityByKey[r.to];
      if (!a || !b) return;
      var ap = arcPath(a, b, r.curve);
      out.push('<path d="' + ap.d + '" fill="none" stroke="' + (r.dashed ? "#8A97A3" : "#1D5FA8") + '" stroke-width="3.4" stroke-linecap="round" ' + (r.dashed ? 'stroke-dasharray="8 7"' : "") + "/>");
      if (r.label) {
        var lx = ap.mid[0] + (r.lx || 0), ly = ap.mid[1] + (r.ly || -12);
        var w = r.label.length * 7.4 + 14;
        out.push('<g><rect x="' + (lx - w / 2).toFixed(1) + '" y="' + (ly - 14).toFixed(1) + '" width="' + w.toFixed(1) + '" height="18" rx="9" fill="#ffffff" opacity=".93"/>' +
          '<text x="' + lx.toFixed(1) + '" y="' + (ly - 0.5).toFixed(1) + '" text-anchor="middle" font-size="13" font-weight="700" fill="' + (r.dashed ? "#6B7683" : "#1D5FA8") + '">' + esc(r.label) + "</text></g>");
      }
    });

    var sg = toSvg(103.99, 1.36);
    out.push('<circle cx="' + (sg[0] - 20).toFixed(1) + '" cy="' + (sg[1] + 22).toFixed(1) + '" r="22" fill="none" stroke="#E9A23B" stroke-width="2"/>');
    out.push('<path d="M' + sg[0].toFixed(1) + " " + sg[1].toFixed(1) + "L" + (sg[0] - 14).toFixed(1) + " " + (sg[1] + 16).toFixed(1) + '" stroke="#E9A23B" stroke-width="1.6"/>');

    T.cities.forEach(function (c) {
      var p = toSvg(c.lon, c.lat);
      var color = c.kind === "home" ? "#2F7D6B" : (c.kind === "transit" || c.kind === "future") ? "#E9A23B" : "#1D5FA8";
      var r = c.kind === "home" ? 9 : 7.5;
      out.push('<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + r + '" fill="' + color + '" stroke="#fff" stroke-width="2.6"/>');
      out.push('<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="2.8" fill="#fff"/>');
      out.push('<text x="' + (p[0] + c.dx).toFixed(1) + '" y="' + (p[1] + c.dy).toFixed(1) + '" text-anchor="' + c.anchor + '" font-size="16" font-weight="700" fill="#1F2933" stroke="#ffffff" stroke-width="4.5" paint-order="stroke" stroke-linejoin="round">' + esc(c.name) + "</text>");
    });

    out.push("</svg>");
    wrap.innerHTML = out.join("");

    $("#mapLegend").innerHTML =
      '<span><i style="background:#2F7D6B"></i>다녀온 곳 — 호주(2026-10 대회)·대한민국</span>' +
      '<span><i style="background:#E9A23B"></i>예정 — 싱가포르 경유(11/19)·헝가리(2027-06)</span>' +
      '<span><span class="ln"></span>예정 항로 SQ615·SQ8494·QF644·VA485</span>' +
      '<span><span class="ln dash"></span>미확정 귀국편 JQ53</span>' +
      '<span><i style="background:#1D5FA8;border-radius:999px"></i>도시 핀</span>';
  }

  /* ---------------- 데이터 뷰 ---------------- */
  function compView(c) {
    var st = S.comps[c.id] || {};
    var v = {};
    for (var k in c) v[k] = c[k];
    for (var k2 in st) v[k2] = st[k2];
    return v;
  }
  function allComps() { return T.competitions.map(compView); }
  function ensureDay(date) {
    if (!S.days[date]) S.days[date] = { journal: "", photos: [], rep: null };
    if (!S.days[date].photos) S.days[date].photos = [];
    return S.days[date];
  }
  function ensureComp(id) {
    if (!S.comps[id]) S.comps[id] = {};
    var st = S.comps[id];
    if (!st.photos) st.photos = [];
    if (!st.certs) st.certs = [];
    return st;
  }
  function photoCount() {
    var n = 0;
    T.days.forEach(function (d) { var v = S.days[d.date]; if (v && v.photos) n += v.photos.filter(Boolean).length; });
    T.competitions.forEach(function (c) {
      var st = S.comps[c.id];
      if (!st) return;
      if (st.photos) n += st.photos.filter(Boolean).length;
      if (st.certs) n += st.certs.filter(Boolean).length;
    });
    return n;
  }

  /* ---------------- 통계 · D-day · 표 ---------------- */
  function renderStats() {
    var comps = allComps();
    var done = comps.filter(function (c) { return Number(c.distance) > 0 && parseDuration(c.time); });
    var km = done.reduce(function (s, c) { return s + Number(c.distance || 0); }, 0);
    var journalDays = T.days.filter(function (d) { var v = S.days[d.date]; return v && v.journal && v.journal.trim(); }).length;
    var photos = photoCount();
    var visitedCountries = T.countries.filter(function (c) { return c.cls === "home" || c.cls === "visited"; }).length;
    var ausCities = T.cities.filter(function (c) { return c.visit; }).length;
    var upcoming = comps.filter(function (c) { var n = daysUntil(c.date); return n != null && n >= 0; }).length;

    function stat(k, v, unit, note) {
      return '<div class="stat"><div class="k">' + k + '</div><div class="v">' + v + (unit ? "<small>" + unit + "</small>" : "") + "</div>" + (note ? '<div class="n">' + note + "</div>" : "") + "</div>";
    }
    $("#stats").innerHTML =
      stat("방문 국가", visitedCountries + "개국", "", "대한민국 · 호주 (＋예정: 헝가리)") +
      stat("방문 도시", ausCities + "곳", "", "호주 4곳 · 싱가포르는 경유 · 10월 대회 도시는 미입력") +
      stat("누적 수영 거리", String(km), "km", done.length ? done.length + "개 대회 완주 기록 합계" : "완주 기록 0건 — ④번에 시간을 적으면 자동 합산") +
      stat("등록된 대회", comps.length + "건", "", "완주 기록 " + done.length + "건 · 예정 " + upcoming + "건") +
      stat("사진", photos + " / 50", "칸", "날짜별 5칸 × 10일 · 대회 사진 포함") +
      stat("일지 입력률", journalDays + " / " + T.days.length, "일", journalDays ? "나머지 날짜도 채워 보세요" : "아직 비어 있음 — ③번에서 적을 수 있어요");
  }

  function renderDDay() {
    var comps = allComps().filter(function (c) { return parseDate(c.date); });
    comps.sort(function (a, b) { return parseDate(a.date) - parseDate(b.date); });
    var html = "", shown = 0;
    comps.forEach(function (c) {
      var n = daysUntil(c.date);
      if (n == null) return;
      var past = n < 0;
      var badge = c.badgeKind === "race" ? '<span class="badge race">대회</span>' : (past ? '<span class="badge warn">지난 대회</span>' : '<span class="badge done">예정</span>');
      var over = past ? "지난 대회" : (shown === 0 ? "가장 가까운 대회" : "다음 목표 대회");
      html += '<div class="item"><div class="overline">' + over + "</div>" +
        '<div class="title">' + esc(c.name) + badge + "</div>" +
        '<div class="meta">' + esc(c.date + (c.dateEnd ? " ~ " + c.dateEnd : "")) + " · " + esc(c.place) + "</div>" +
        '<div class="dday"><span class="num">' + ddayText(n) + '</span><span class="lbl">' + (past ? "지남" : "남음") + "</span></div>" +
        (c.official ? '<div class="meta">' + esc(c.official) + "</div>" : "") + "</div>";
      shown++;
    });
    $("#dday").innerHTML = html || '<div class="item"><div class="meta">등록된 대회 날짜가 없습니다.</div></div>';
  }

  function renderCountryTable() {
    var rows = T.countries.map(function (c) {
      return "<tr><td><b>" + esc(c.name) + "</b></td><td>" + esc(c.state) + "</td><td>" + esc(c.cities) + "</td></tr>";
    }).join("");
    $("#countryTable").innerHTML = "<thead><tr><th>나라</th><th>상태</th><th>도시·장소</th></tr></thead><tbody>" + rows + "</tbody>";
  }

  function renderTrips() {
    var t = T.trip;
    $("#trips").innerHTML =
      '<div class="item"><div class="overline">예정 · 11/19 출발</div><div class="title">' + esc(t.title) + "</div>" +
      '<div class="meta">' + esc(t.period) + "</div><div class=\"meta\">" + esc(t.route) + "</div></div>" +
      '<div class="item"><div class="overline">아카이브 · 기록 미입력</div><div class="title">2026년 10월 호주 수영대회</div>' +
      '<div class="meta">날짜 · 도시 미입력 — 완주 기록과 완주증·메달 사진을 받으면 ④번에 채웁니다</div></div>';
  }

  /* ---------------- 미확정 · 체크리스트 · 비상 ---------------- */
  function renderTodos() {
    $("#todos").innerHTML = T.todos.map(function (t) {
      var on = !!S.todos[t.id];
      return '<label class="check"><input type="checkbox" data-todo="' + t.id + '"' + (on ? " checked" : "") + "><span>" + esc(t.label) + ' <span class="badge warn">' + esc(t.due) + "</span></span></label>";
    }).join("");
    $$("[data-todo]").forEach(function (cb) {
      cb.addEventListener("change", function () { S.todos[cb.getAttribute("data-todo")] = cb.checked; save(true); });
    });
  }
  function renderChecklist() {
    var total = 0, done = 0;
    $("#checklist").innerHTML = T.checklist.map(function (g) {
      return '<div class="checkgroup"><h3>' + esc(g.group) + "</h3>" + g.items.map(function (it) {
        total++;
        var on = !!S.checklist[it.id];
        if (on) done++;
        return '<label class="check"><input type="checkbox" data-check="' + it.id + '"' + (on ? " checked" : "") + "><span>" + esc(it.label) + "</span></label>";
      }).join("") + "</div>";
    }).join("");
    $("#checkProgress").textContent = done + " / " + total + " 준비 완료";
    $$("[data-check]").forEach(function (cb) {
      cb.addEventListener("change", function () {
        S.checklist[cb.getAttribute("data-check")] = cb.checked;
        save(true); renderChecklist(); renderStats();
      });
    });
  }
  function renderEmergency() {
    $("#emergencyTable").innerHTML = "<thead><tr><th>기관</th><th>번호</th><th>비고</th></tr></thead><tbody>" +
      T.emergency.map(function (e) {
        return "<tr><td>" + esc(e.org) + "</td><td><b>" + esc(e.num) + "</b></td><td>" + esc(e.note) + "</td></tr>";
      }).join("") + "</tbody>";
    $("#consular").innerHTML = T.consular.map(function (s) { return "<li>" + s + "</li>"; }).join("");
    $("#lodgingTable").innerHTML = "<thead><tr><th>구간</th><th>숙소</th><th>위치</th></tr></thead><tbody>" +
      T.lodging.map(function (l) {
        return "<tr><td>" + esc(l.when) + "</td><td>" + esc(l.name) + "</td><td>" + esc(l.where) + "</td></tr>";
      }).join("") + "</tbody>";
  }

  /* ---------------- 사진 칸 ---------------- */
  function resizeImage(file, maxSide, quality) {
    maxSide = maxSide || 1400; quality = quality || 0.82;
    return new Promise(function (res, rej) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var w = img.naturalWidth, h = img.naturalHeight;
        var sc = Math.min(1, maxSide / Math.max(w, h));
        w = Math.max(1, Math.round(w * sc)); h = Math.max(1, Math.round(h * sc));
        var cv = document.createElement("canvas");
        cv.width = w; cv.height = h;
        cv.getContext("2d").drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        try { res(cv.toDataURL("image/jpeg", quality)); } catch (e) { rej(e); }
      };
      img.onerror = function () { URL.revokeObjectURL(url); rej(new Error("image")); };
      img.src = url;
    });
  }

  /* opts: {list, max, label, repGet, repSet, after} */
  function photoBlock(opts) {
    var box = document.createElement("div");
    var list = opts.list, max = opts.max, repGet = opts.repGet || function () { return null; };
    var repSet = opts.repSet || null;
    var uid = "ph" + Math.random().toString(36).slice(2, 8);
    box.innerHTML = '<div class="lbl" style="display:flex;justify-content:space-between;align-items:center"><span>' +
      esc(opts.label || "사진") + ' (<span class="photo-count">' + list.filter(Boolean).length + "/" + max + "</span>)</span></div>" +
      '<div class="photos"></div><input type="file" accept="image/*" multiple hidden>';
    var grid = box.querySelector(".photos");
    var input = box.querySelector("input[type=file]");
    var rep = repGet();

    list.forEach(function (pid, idx) {
      if (!pid) return;
      var cell = document.createElement("div");
      cell.className = "ph" + (rep === pid ? " rep" : "");
      cell.innerHTML = '<img alt="사진" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">' +
        '<button type="button" class="del" aria-label="사진 지우기">×</button>' +
        (repSet ? '<button type="button" class="repbtn">' + (rep === pid ? "대표" : "대표로") + "</button>" : "");
      var img = cell.querySelector("img");
      getPhoto(pid).then(function (src) { if (src) img.src = src; });
      cell.querySelector(".del").addEventListener("click", function () {
        if (!window.confirm("이 사진을 지울까요?")) return;
        PhotoStore.del(pid);
        delete photoCache[pid];
        list.splice(idx, 1);
        if (repSet && rep === pid) repSet(null);
        save(true);
        if (opts.after) opts.after();
      });
      if (repSet) {
        cell.querySelector(".repbtn").addEventListener("click", function () {
          repSet(rep === pid ? null : pid);
          save(true);
          if (opts.after) opts.after();
        });
      }
      grid.appendChild(cell);
    });

    if (list.filter(Boolean).length < max) {
      var add = document.createElement("button");
      add.type = "button";
      add.className = "ph-add";
      add.textContent = "＋ 사진";
      add.addEventListener("click", function () { input.click(); });
      grid.appendChild(add);
    }

    input.addEventListener("change", function () {
      var files = Array.prototype.slice.call(input.files || []).slice(0, max - list.filter(Boolean).length);
      input.value = "";
      if (!files.length) return;
      toast("사진을 준비하는 중…");
      var chain = Promise.resolve();
      files.forEach(function (f) {
        chain = chain.then(function () {
          return resizeImage(f).then(function (url) {
            var pid = "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
            return PhotoStore.put(pid, url).then(function () {
              photoCache[pid] = url;
              list.push(pid);
              if (repSet && !repGet()) repSet(pid);
            });
          });
        });
      });
      chain.then(function () {
        save(true);
        if (opts.after) opts.after();
        toast("사진을 붙였어요");
      }).catch(function () { toast("사진을 넣지 못했어요 — 다른 사진으로 해보세요"); });
    });
    return box;
  }

  /* ---------------- 날짜별 기록 ---------------- */
  function renderDays() {
    var host = $("#days");
    host.innerHTML = "";
    var today = todayStr();
    T.days.forEach(function (d) {
      var st = ensureDay(d.date);
      var card = document.createElement("article");
      card.className = "day" + (d.date === today ? " now" : "");
      var badge = d.badge ? '<span class="badge ' + (d.badgeKind || "") + '">' + esc(d.badge) + "</span>" : "";
      var nowTag = d.date === today ? '<span class="badge done">오늘</span>' : "";
      card.innerHTML =
        '<div class="day-head"><div class="day-date"><div class="d">' + d.date.slice(5).replace("-", "/") + '</div><div class="w">' + esc(d.dow) + "</div></div>" +
        '<div style="min-width:0"><div class="day-title">' + esc(d.title) + badge + nowTag + '</div>' +
        '<div class="day-sub">' + esc(d.tz) + " · " + esc(d.city) + "</div></div></div>" +
        '<div class="weather">☁ ' + esc(d.weather) + "</div>" +
        '<div class="day-body"><ul class="timeline">' +
        d.items.map(function (it) { return '<li><span class="t">' + esc(it.t) + '</span><span class="x">' + esc(it.x) + "</span></li>"; }).join("") +
        "</ul>" +
        '<label class="lbl">실제로 있었던 일</label>' +
        '<textarea data-journal="' + d.date + '" placeholder="예: 3시간 12분에 완주. 바람이 세서 마지막 2km가 힘들었다.">' + esc(st.journal || "") + "</textarea>" +
        '<div class="phostack"></div></div>';
      host.appendChild(card);

      var ta = card.querySelector("textarea");
      ta.addEventListener("input", function () { st.journal = ta.value; save(); renderStats(); });

      var ph = photoBlock({
        list: st.photos, max: 5, label: "사진",
        repGet: function () { return st.rep; },
        repSet: function (pid) { st.rep = pid; },
        after: function () { refresh(); }
      });
      card.querySelector(".phostack").appendChild(ph);

      if (st.rep) {
        var b = document.createElement("span");
        b.className = "badge done";
        b.textContent = "★ 대표사진";
        card.querySelector(".day-title").appendChild(b);
      }
    });
  }

  /* ---------------- 수영대회 ---------------- */
  function compField(c, key, label, type, ph) {
    return '<label class="lbl">' + esc(label) + '<input type="' + (type || "text") + '" data-comp="' + c.id + '" data-key="' + key + '" value="' + esc(c[key] == null ? "" : c[key]) + '" placeholder="' + esc(ph || "") + '"></label>';
  }
  function renderComps() {
    var host = $("#comps");
    host.innerHTML = "";
    allComps().forEach(function (c) {
      var st = ensureComp(c.id);
      var n = c.date ? daysUntil(c.date) : null;
      var card = document.createElement("article");
      card.className = "day";
      var statusBadge = c.time ? '<span class="badge done">완주 기록</span>'
        : (c.status === "기록 미입력" ? '<span class="badge warn">기록 미입력</span>' : (n != null && n >= 0 ? '<span class="badge race">예정</span>' : '<span class="badge">목표</span>'));
      card.innerHTML =
        '<div class="day-head"><div class="day-date"><div class="d">' + (c.date ? c.date.slice(5).replace("-", "/") : "—") + '</div><div class="w">' + esc(n == null ? "날짜 미입력" : ddayText(n)) + "</div></div>" +
        '<div style="min-width:0"><div class="day-title">' + esc(c.name) + statusBadge + "</div>" +
        '<div class="day-sub">' + esc(c.official || "대회명 미입력") + " · " + esc(c.place) + "</div></div></div>" +
        '<div class="day-body">' +
        '<div class="grid2">' + compField(c, "date", "날짜", "date") + compField(c, "name", "대회명") + "</div>" +
        compField(c, "place", "장소") +
        '<div class="grid2">' + compField(c, "event", "종목") + compField(c, "distance", "거리 (km)", "number") + "</div>" +
        '<div class="grid2">' + compField(c, "time", "내 기록 (예: 3:12:00)", "text", "완주 시간") + compField(c, "temp", "수온", "text", "예: 19℃") + "</div>" +
        compField(c, "weather", "날씨") +
        compField(c, "condition", "그날 컨디션", "text", "예: 잠 6시간, 어깨 컨디션 좋음") +
        compField(c, "note", "비고") +
        '<div class="certwrap"></div><div class="phostack"></div></div>';
      host.appendChild(card);

      card.querySelector(".certwrap").appendChild(photoBlock({
        list: st.certs, max: 1, label: "완주증 · 메달", after: function () { save(true); renderStats(); }
      }));
      card.querySelector(".phostack").appendChild(photoBlock({
        list: st.photos, max: 5, label: "대회 사진",
        repGet: function () { return st.rep; },
        repSet: function (pid) { st.rep = pid; },
        after: function () { refresh(); }
      }));

      $$("[data-comp='" + c.id + "']", card).forEach(function (inp) {
        inp.addEventListener("input", function () {
          var k = inp.getAttribute("data-key");
          st[k] = inp.value;
          save();
          if (k === "time" || k === "distance") { renderStats(); renderDDay(); renderDistTable(); renderTrend(); renderTotalKm(); renderSummaryStats(); }
        });
        if (inp.type === "date") {
          inp.addEventListener("change", function () { st.date = inp.value; save(true); renderComps(); renderDDay(); renderStats(); });
        }
      });
    });
  }

  function renderDistTable() {
    var comps = allComps().filter(function (c) { return Number(c.distance) > 0 && parseDuration(c.time); });
    var rows = [1.5, 3, 5, 10].map(function (d) {
      var match = comps.filter(function (c) { return Math.abs(Number(c.distance) - d) < 0.01; });
      match.sort(function (a, b) { return parseDuration(a.time) - parseDuration(b.time); });
      var best = match[0];
      return "<tr><td><b>" + d + "km</b></td><td>" + (best ? fmtDur(parseDuration(best.time)) : "(미입력)") + "</td><td>" + (best ? esc(best.name) : "(미입력)") + "</td><td>" + (best ? esc(best.date || "") : "(미입력)") + "</td></tr>";
    }).join("");
    $("#distTable").innerHTML = "<thead><tr><th>거리</th><th>최고 기록</th><th>대회</th><th>날짜</th></tr></thead><tbody>" + rows + "</tbody>";
  }
  function totalKm() {
    return allComps().filter(function (c) { return Number(c.distance) > 0 && parseDuration(c.time); })
      .reduce(function (s, c) { return s + Number(c.distance || 0); }, 0);
  }
  function renderTotalKm() { $("#totalKm").textContent = String(totalKm()); }
  function renderTrend() {
    var comps = allComps().filter(function (c) { return Number(c.distance) > 0 && parseDuration(c.time); });
    var host = $("#trendChart");
    if (!comps.length) {
      host.innerHTML = '<div class="empty">아직 완주 기록이 없습니다. 쿠지 10km 기록을 ④번 카드의 <b>내 기록</b> 칸에 적으면 여기에 페이스 추이가 그려집니다.</div>';
      return;
    }
    comps.sort(function (a, b) { return Number(a.distance) - Number(b.distance); });
    var padL = 46, padR = 14, padT = 18, padB = 30, w = 640, h = 220;
    var paces = comps.map(function (c) { return parseDuration(c.time) / (Number(c.distance) * 10); });
    var maxP = Math.max.apply(null, paces) * 1.3, minP = Math.min.apply(null, paces) * 0.55;
    var slot = (w - padL - padR) / comps.length;
    var bw = Math.min(58, slot - 16);
    var bars = "", labels = "";
    comps.forEach(function (c, i) {
      var x = padL + slot * (i + 0.5) - bw / 2;
      var pace = paces[i];
      var bh = Math.max(6, (pace - minP) / Math.max(1, maxP - minP) * (h - padT - padB));
      var y = h - padB - bh;
      bars += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + bh.toFixed(1) + '" rx="6" fill="#2F7D6B"></rect>' +
        '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (y - 6).toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#0F352E">' + Math.floor(pace / 60) + ":" + String(Math.round(pace % 60)).padStart(2, "0") + "</text>";
      labels += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (h - padB + 17) + '" text-anchor="middle" font-size="12" fill="#5C6773">' + esc(c.distance + "km") + "</text>";
    });
    host.innerHTML = '<svg viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="거리별 페이스(100m당) 추이">' +
      '<line x1="' + padL + '" y1="' + (h - padB) + '" x2="' + (w - padR) + '" y2="' + (h - padB) + '" stroke="#DDE5E1"/>' +
      bars + labels +
      '<text x="2" y="14" font-size="11" fill="#86929E">페이스 / 100m</text></svg>';
  }

  /* ---------------- 예약 코드 ---------------- */
  function renderCodes() {
    var host = $("#codes");
    host.innerHTML = "";
    T.bookings.forEach(function (b) {
      var row = document.createElement("div");
      row.className = "code-row";
      row.innerHTML =
        '<div class="code-top"><span class="code-what">' + esc(b.what) + '</span><span class="code-when">' + esc(b.when) + "</span></div>" +
        '<div class="code-prov">' + esc(b.prov) + "</div>" +
        '<div class="code-line"><input type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" data-code="' + b.id + '" placeholder="예약번호 직접 입력 (이 기기에만 저장)" value="' + esc(S.codes[b.id] || "") + '">' +
        '<button class="btn-copy" type="button" data-copy="' + b.id + '">복사</button></div>';
      host.appendChild(row);
    });
    $$("[data-code]").forEach(function (inp) {
      inp.addEventListener("input", function () { S.codes[inp.getAttribute("data-code")] = inp.value; save(); });
    });
    $$("[data-copy]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-copy");
        var v = (S.codes[id] || "").trim();
        if (!v) {
          toast("아직 코드를 적지 않았어요");
          var inp = $("[data-code='" + id + "']");
          if (inp) inp.focus();
          return;
        }
        copyText(v).then(function (ok) {
          if (ok) {
            btn.textContent = "복사됨"; btn.classList.add("got");
            toast("예약 코드를 복사했어요");
          } else {
            toast("복사하지 못했어요 — 칸을 길게 눌러 복사하세요");
          }
          setTimeout(function () { btn.textContent = "복사"; btn.classList.remove("got"); }, 1800);
        });
      });
    });
  }

  /* ---------------- 한 장 요약 ---------------- */
  function summaryRows() {
    var comps = allComps();
    var race = comps.filter(function (c) { return c.badgeKind === "race"; })[0] || comps[0];
    var racePhotos = race && S.comps[race.id] && S.comps[race.id].photos ? S.comps[race.id].photos.filter(Boolean).length : 0;
    var journalDays = T.days.filter(function (d) { var v = S.days[d.date]; return v && v.journal && v.journal.trim(); }).length;
    var km = totalKm();
    return [
      ["다녀온 곳", T.trip.places],
      ["수영대회", race ? race.name + " — 기록 " + (race.time || "(미입력)") + " · 사진 " + racePhotos + "/5" : "(미입력)"],
      ["액티비티", T.trip.activities],
      ["일지", journalDays + "일 기록 · 사진 " + photoCount() + "/50"],
      ["누적 수영", km ? km + " km" : "0 km (완주 기록 입력 전)"],
      ["가장 기억에 남는 순간", S.summary.moment || "(여행 후 적어 주세요)"],
      ["한 줄 소감", S.summary.line || "(여행 후 적어 주세요)"]
    ];
  }
  function renderSummaryStats() { /* 요약은 열 때마다 새로 만듭니다 */ }
  function openSummary() {
    var rows = summaryRows();
    $("#summaryBody").innerHTML =
      '<div class="sum-card"><h2>' + esc(T.name) + "님의 호주 여행</h2>" +
      '<div class="when">' + esc(T.trip.period) + " · 9박 10일</div>" +
      rows.filter(function (r) { return r[0].indexOf("순간") < 0 && r[0].indexOf("소감") < 0; })
        .map(function (r) { return '<div class="sum-row"><div class="k">' + esc(r[0]) + '</div><div class="v">' + esc(r[1]) + "</div></div>"; }).join("") +
      '<label class="lbl">가장 기억에 남는 순간<input type="text" id="sumMoment" value="' + esc(S.summary.moment || "") + '" placeholder="예: 쿠지 바다 마지막 1km"></label>' +
      '<label class="lbl">한 줄 소감<input type="text" id="sumLine" value="' + esc(S.summary.line || "") + '" placeholder="예: 바람과 파도가 다 이겨 줬다"></label>' +
      '<p class="sum-note">가족에게 보여 줄 한 장 요약입니다. 여권번호·연락처·숙소 상세 주소·예약 코드는 담기지 않습니다.</p></div>';
    $("#summaryModal").hidden = false;
    $("#sumMoment").addEventListener("input", function (e) { S.summary.moment = e.target.value; save(); });
    $("#sumLine").addEventListener("input", function (e) { S.summary.line = e.target.value; save(); });
  }
  function summaryText() {
    return [T.name + "님의 호주 여행", T.trip.period + " · 9박 10일"]
      .concat(summaryRows().map(function (r) { return r[0] + ": " + r[1]; })).join("\n");
  }

  /* ---------------- 백업 / 복원 ---------------- */
  function allPhotoIds() {
    var ids = [];
    T.days.forEach(function (d) { var v = S.days[d.date]; if (v && v.photos) ids = ids.concat(v.photos.filter(Boolean)); });
    T.competitions.forEach(function (c) {
      var st = S.comps[c.id];
      if (!st) return;
      if (st.photos) ids = ids.concat(st.photos.filter(Boolean));
      if (st.certs) ids = ids.concat(st.certs.filter(Boolean));
    });
    var out = [], seen = {};
    ids.forEach(function (id) { if (!seen[id]) { seen[id] = 1; out.push(id); } });
    return out;
  }
  function doBackup() {
    var ids = allPhotoIds();
    toast("백업 파일을 만드는 중…");
    Promise.all(ids.map(function (id) { return getPhoto(id).then(function (v) { return [id, v]; }); })).then(function (pairs) {
      var photos = {};
      pairs.forEach(function (p) { if (p[1]) photos[p[0]] = p[1]; });
      var data = { app: "travel-log", version: 1, savedAt: new Date().toISOString(), who: T.name, state: S, photos: photos };
      var blob = new Blob([JSON.stringify(data)], { type: "application/json" });
      var a = document.createElement("a");
      var d = new Date();
      a.href = URL.createObjectURL(blob);
      a.download = "여행로그-백업-" + d.getFullYear() + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0") + ".json";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
      toast("백업 파일을 내려받았어요 · 사진 " + Object.keys(photos).length + "장 포함");
    });
  }
  function doRestore(file) {
    var fr = new FileReader();
    fr.onload = function () {
      var data;
      try { data = JSON.parse(fr.result); } catch (e) { toast("백업 파일을 읽지 못했어요"); return; }
      if (!data || !data.state) { toast("여행 로그 백업 파일이 아니에요"); return; }
      if (!window.confirm("지금 이 기기의 기록을 백업 파일 내용으로 바꿀까요? 지금 기록은 사라집니다.")) return;
      S = loadMerge(data.state);
      var puts = Object.keys(data.photos || {}).map(function (id) {
        photoCache[id] = data.photos[id];
        return PhotoStore.put(id, data.photos[id]);
      });
      Promise.all(puts).then(function () {
        save(true); applyBig(); refresh();
        toast("백업을 불러왔어요");
      });
    };
    fr.readAsText(file);
  }
  function loadMerge(st) {
    var base = blank();
    for (var k in st) if (st[k] != null) base[k] = st[k];
    if (!base.summary) base.summary = { moment: "", line: "" };
    if (!base.settings) base.settings = { big: false };
    return base;
  }

  /* ---------------- 탭 · 큰 글씨 ---------------- */
  function applyBig() {
    var on = !!(S.settings && S.settings.big);
    document.documentElement.classList.toggle("big", on);
    var b = $("#btnBig");
    b.setAttribute("aria-pressed", on ? "true" : "false");
    b.textContent = on ? "가− 보통 글씨" : "가+ 큰 글씨";
  }
  function showTab(name) {
    $$(".tab").forEach(function (t) { t.classList.toggle("is-active", t.getAttribute("data-tab") === name); });
    $$(".panel").forEach(function (p) { p.classList.toggle("is-active", p.id === "panel-" + name); });
    if (location.hash.slice(1) !== name) {
      try { history.replaceState(null, "", "#" + name); } catch (e) { location.hash = name; }
    }
    window.scrollTo(0, 0);
  }

  function refresh() {
    renderStats();
    renderDDay();
    renderDays();
    renderComps();
    renderDistTable();
    renderTrend();
    renderTotalKm();
    renderCodes();
  }

  function init() {
    applyBig();
    renderMap();
    renderCountryTable();
    renderTrips();
    renderTodos();
    renderChecklist();
    renderEmergency();
    refresh();

    $$(".tab").forEach(function (t) {
      t.addEventListener("click", function () { showTab(t.getAttribute("data-tab")); });
    });
    var initial = (location.hash || "").replace("#", "");
    if (["cover", "prep", "days", "comp", "codes"].indexOf(initial) >= 0) showTab(initial);

    $("#btnBig").addEventListener("click", function () {
      S.settings.big = !S.settings.big; save(true); applyBig();
    });
    $("#btnSummary").addEventListener("click", openSummary);
    $("#btnCloseSummary").addEventListener("click", function () { $("#summaryModal").hidden = true; });
    $("#summaryModal").addEventListener("click", function (e) { if (e.target.id === "summaryModal") $("#summaryModal").hidden = true; });
    $("#btnCopySummary").addEventListener("click", function () {
      copyText(summaryText()).then(function (ok) { toast(ok ? "요약 글을 복사했어요 — 가족에게 붙여 넣으세요" : "복사하지 못했어요"); });
    });
    $("#btnPrintSummary").addEventListener("click", function () { window.print(); });
    $("#btnBackup").addEventListener("click", doBackup);
    $("#btnRestore").addEventListener("click", function () { $("#fileRestore").click(); });
    $("#fileRestore").addEventListener("change", function (e) {
      if (e.target.files && e.target.files[0]) doRestore(e.target.files[0]);
      e.target.value = "";
    });
    $("#btnCheckReset").addEventListener("click", function () {
      if (!window.confirm("체크한 준비물을 모두 지울까요?")) return;
      S.checklist = {}; save(true); renderChecklist(); renderStats();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") $("#summaryModal").hidden = true; });
    window.TL = { state: function () { return S; }, refresh: refresh };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
