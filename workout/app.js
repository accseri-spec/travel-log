/* 김상진님의 운동 로그 — 화면 그리기와 기기 저장
   외부 라이브러리 없이 혼자 동작합니다(SVG 차트 직접 그림). */
(function () {
  "use strict";

  var KEY = "workoutlog.v1";
  var D = (typeof WORKOUT_DATA !== "undefined") ? WORKOUT_DATA : window.WORKOUT_DATA;
  var SPORTS = {
    swim: { name: "수영", icon: "🏊" },
    run: { name: "러닝", icon: "🏃" },
    strength: { name: "근력", icon: "🏋️" }
  };
  var DOW = ["일", "월", "화", "수", "목", "금", "토"];
  var state = { memos: {}, manual: [], big: false, filter: "all", selDay: null };

  /* ---------------- 저장 ---------------- */
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return;
      var s = JSON.parse(raw);
      if (s && typeof s === "object") {
        state.memos = s.memos && typeof s.memos === "object" ? s.memos : {};
        state.manual = Array.isArray(s.manual) ? s.manual : [];
        state.big = !!s.big;
        state.filter = s.filter || "all";
      }
    } catch (e) { /* 저장값이 깨졌으면 빈 상태로 시작 */ }
  }
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        version: 1, savedAt: new Date().toISOString(),
        memos: state.memos, manual: state.manual, big: state.big, filter: state.filter
      }));
      updateStorageLine();
    } catch (e) { toast("이 브라우저에는 저장할 수 없습니다"); }
  }
  function updateStorageLine() {
    var el = document.getElementById("storageLine");
    if (!el) return;
    var memoCount = Object.keys(state.memos).filter(function (k) { return state.memos[k] && state.memos[k].trim(); }).length;
    el.textContent = "지금 이 기기에 저장된 것: 컨디션 메모 " + memoCount + "개 · 직접 추가한 운동 " + state.manual.length + "건";
  }

  /* ---------------- 도우미 ---------------- */
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function parseDate(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  // 기록이 모두 한국 시간(KST) 기준이라 D-day도 한국 날짜로 셉니다.
  function todayKST() {
    try {
      var s = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return parseDate(s);
    } catch (e) { /* 시간대를 못 읽으면 기기 시간으로 */ }
    var t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
  }
  function todayStr() { var t = new Date(); return t.getFullYear() + "-" + pad(t.getMonth() + 1) + "-" + pad(t.getDate()); }
  function mmdd(s) { var p = s.split("-"); return (+p[1]) + "/" + (+p[2]); }
  function dowOf(s) { return DOW[parseDate(s).getDay()]; }
  function fmtDur(sec) {
    if (sec == null || isNaN(sec)) return "—";
    sec = Math.round(sec);
    var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return h > 0 ? h + ":" + pad(m) + ":" + pad(s) : m + ":" + pad(s);
  }
  function km(n) { return (Math.round(n * 100) / 100).toFixed(2).replace(/\.?0+$/, ""); }
  function km1(n) { return (Math.round(n * 10) / 10).toFixed(1); }
  function int(n) { return Number(n).toLocaleString("ko-KR"); }
  function daysBetween(a, b) {
    var A = new Date(a.getFullYear(), a.getMonth(), a.getDate());
    var B = new Date(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.round((B - A) / 86400000);
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  var toastTimer;
  function toast(msg) {
    var t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  /* ---------------- 기록 합치기 ---------------- */
  function allRecords() {
    var all = D.records.slice();
    state.manual.forEach(function (m) {
      all.push({
        id: m.id, date: m.date, time: m.time || "", sport: m.sport,
        place: m.place || (SPORTS[m.sport] ? SPORTS[m.sport].name : ""),
        distanceM: m.distanceM || null, distanceKm: m.distanceKm || null,
        seconds: m.seconds || null, pace: m.pace || "",
        hrAvg: m.hrAvg || null, hrMax: m.hrMax || null, kcal: m.kcal || null,
        extra: m.extra || "", manual: true
      });
    });
    all.sort(function (a, b) {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1;
      return (b.time || "99:99") < (a.time || "99:99") ? -1 : 1;
    });
    return all;
  }
  function monthTotals(prefix) {
    var t = { swim: { n: 0, km: 0 }, run: { n: 0, km: 0 }, strength: 0, seconds: 0, kcal: 0 };
    allRecords().forEach(function (r) {
      if (r.date.slice(0, 7) !== prefix) return;
      if (r.sport === "swim") { t.swim.n++; t.swim.km += (r.distanceM || 0) / 1000; }
      else if (r.sport === "run") { t.run.n++; t.run.km += (r.distanceKm || 0); }
      else if (r.sport === "strength") { t.strength++; }
      t.seconds += r.seconds || 0;
      t.kcal += r.kcal || 0;
    });
    return t;
  }

  /* ---------------- ① 요약 & D-day ---------------- */
  function renderHeader() {
    document.getElementById("syncLine").textContent =
      "마지막 동기화 " + D.meta.syncedAt + " · " + D.meta.source + " · " + D.meta.autoSync + " · 기간 " + D.meta.coverage;
  }

  function ddText(d) { return d > 0 ? "D-" + d : (d === 0 ? "D-DAY" : "D+" + (-d)); }

  /* 대회 D-day — 평상시엔 이름과 D-day만, 누르면 상세가 펼쳐집니다 */
  function renderRaces() {
    var today = todayKST();
    var open = -1;
    D.races.forEach(function (r, i) {
      if (open < 0 && daysBetween(today, parseDate(r.date)) >= 0) open = i;
    });
    var html = D.races.map(function (r, i) {
      var d = daysBetween(today, parseDate(r.date));
      var det = (r.detail || []).map(function (row) {
        return "<div class=\"rrow\"><span class=\"rk\">" + esc(row[0]) + "</span><span class=\"rv\">" + row[1] + "</span></div>";
      }).join("");
      var prep = "";
      if (r.prep) {
        var start = parseDate(D.meta.coverage.split(" ~ ")[0].replace(/\./g, "-").slice(0, 10));
        var total = daysBetween(start, parseDate(r.date)) || 1;
        var done = Math.max(0, Math.min(1, daysBetween(start, today) / total));
        prep = "<div class=\"prep\"><div class=\"prep-bar\"><i style=\"width:" + (done * 100).toFixed(1) + "%\"></i></div>" +
          "<p class=\"hint\">준비 " + int(total) + "일 중 " + Math.round(done * 100) + "% 지남 · 한국 날짜 기준</p></div>";
      }
      return "<div class=\"race" + (i === open ? " is-next" : "") + "\">" +
        "<button class=\"race-btn\" type=\"button\" aria-expanded=\"false\">" +
          "<span class=\"race-nm\">" + esc(r.short || r.name) + "</span>" +
          "<span class=\"race-dday\"><b>" + ddText(d) + "</b><span class=\"chev\"></span></span>" +
        "</button>" +
        "<div class=\"race-det\">" + det + prep + "</div>" +
      "</div>";
    }).join("");

    var box = document.getElementById("raceList");
    if (!box) return;
    box.innerHTML = html;
    Array.prototype.forEach.call(box.querySelectorAll(".race-btn"), function (btn) {
      btn.addEventListener("click", function () {
        var card = btn.parentNode;
        var isOpen = card.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    });
  }

  /* 이번 달 합계 */
  function tcell(k, v, unit) {
    return "<div class=\"tcell\"><div class=\"k\">" + k + "</div><div class=\"v\">" + v +
      (unit ? "<small>" + unit + "</small>" : "") + "</div></div>";
  }
  function renderMonthTotal() {
    var t = monthTotals("2026-11");
    var el = document.getElementById("monthTotal");
    if (!el) return;
    el.innerHTML =
      "<div class=\"totalhead\"><span>이번 달 합계</span><em>11월 · 1~18일</em></div>" +
      "<div class=\"tgrid\">" +
        tcell("총 거리", km(t.swim.km + t.run.km), "km") +
        tcell("운동 시간", fmtDur(t.seconds), "") +
        tcell("칼로리", int(t.kcal), "kcal") +
      "</div>" +
      "<p class=\"tn\">수영 " + t.swim.n + "회 " + km(t.swim.km) + " km · 러닝 " + t.run.n + "회 " +
        km(t.run.km) + " km · 근력 " + t.strength + "회</p>";
  }

  /* 이번 달 / 지난 주 / 최근 30일 — 작은 여닫이 */
  function renderWindows() {
    var nov = monthTotals("2026-11");
    var box = document.getElementById("windowAcc");
    if (!box) return;
    box.innerHTML = D.windows.map(function (w) {
      var isMonth = w.label === "이번 달";
      var swim = isMonth ? nov.swim : w.swim;
      var run = isMonth ? nov.run : w.run;
      var st = isMonth ? nov.strength : w.strength;
      return "<div class=\"acc-item\">" +
        "<button class=\"acc-btn\" type=\"button\" aria-expanded=\"false\">" +
          "<span class=\"ak\">" + esc(w.label) + "</span>" +
          "<span class=\"as\">" + esc(w.sub || "") + "</span>" +
          "<span class=\"chev\"></span>" +
        "</button>" +
        "<div class=\"acc-body\">" +
          "<div class=\"arow\"><span class=\"an\">🏊 수영</span><span class=\"av\">" + swim.n + "회 · " + km(swim.km) + " km</span></div>" +
          "<div class=\"arow\"><span class=\"an\">🏃 러닝</span><span class=\"av\">" + run.n + "회 · " + km(run.km) + " km</span></div>" +
          "<div class=\"arow\"><span class=\"an\">🏋️ 근력</span><span class=\"av\">" + st + "회</span></div>" +
          (w.note ? "<p class=\"anote\">" + esc(w.note) + "</p>" : "") +
        "</div>" +
      "</div>";
    }).join("");
    Array.prototype.forEach.call(box.querySelectorAll(".acc-btn"), function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.parentNode;
        var isOpen = item.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    });
  }

  /* 11월 달력 — 운동한 날은 종목 색 점으로 표시 */
  function renderCalendars() {
    var recs = allRecords();
    renderCal(document.getElementById("calSummary"), "2026-11", recs, { interactive: false });
    renderCal(document.getElementById("calRecords"), "2026-11", recs, { interactive: true });
  }

  function renderCal(el, prefix, recs, opts) {
    if (!el) return;
    var p = prefix.split("-");
    var y = +p[0], mo = +p[1];
    var daysInMonth = new Date(y, mo, 0).getDate();
    var firstDow = new Date(y, mo - 1, 1).getDay();
    var byDate = {};
    recs.forEach(function (r) {
      if (r.date.slice(0, 7) !== prefix) return;
      var o = byDate[r.date] || (byDate[r.date] = {});
      o[r.sport] = (o[r.sport] || 0) + 1;
    });
    var known = {};
    D.days.forEach(function (d) { known[d.date] = true; });
    var today = todayKST();

    var html = DOW.map(function (w, i) {
      return "<div class=\"cw" + (i === 0 ? " sun" : "") + "\">" + w + "</div>";
    }).join("");
    for (var b = 0; b < firstDow; b++) html += "<div class=\"cblank\"></div>";

    for (var d = 1; d <= daysInMonth; d++) {
      var ds = prefix + "-" + pad(d);
      var sp = byDate[ds];
      var dt = new Date(y, mo - 1, d);
      var isToday = daysBetween(dt, today) === 0;
      var isFuture = dt > today;
      var cls = (sp ? "is-rec" : (isFuture ? "is-future" : "is-empty")) +
        (isToday ? " is-today" : "") + (state.selDay === ds ? " is-sel" : "");
      var dots = "<span class=\"dots\"></span>";
      if (sp) {
        dots = "<span class=\"dots\">" + ["swim", "run", "strength"].filter(function (k) { return sp[k]; })
          .map(function (k) { return "<i class=\"" + k + "\"></i>"; }).join("") + "</span>";
      }
      var inner = "<span class=\"dn\">" + d + "</span>" + dots;
      var clickable = opts.interactive && !isFuture && !!(sp || known[ds]);
      if (clickable) {
        html += "<button class=\"cday " + cls + "\" type=\"button\" data-date=\"" + ds +
          "\" aria-pressed=\"" + (state.selDay === ds ? "true" : "false") +
          "\" aria-label=\"" + mo + "월 " + d + "일 · " + (sp ? "기록 있음" : "기록 없음") + "\">" + inner + "</button>";
      } else {
        html += "<div class=\"cday " + cls + "\">" + inner + "</div>";
      }
    }
    el.innerHTML = html;

    if (opts.interactive) {
      el.onclick = function (e) {
        var btn = e.target && e.target.closest ? e.target.closest("button.cday[data-date]") : null;
        if (btn) jumpToDay(btn.getAttribute("data-date"));
      };
    }
  }

  /* 달력에서 날짜를 누르면 그날 기록 카드로 이동 + 잠깐 강조 */
  function jumpToDay(ds) {
    state.selDay = ds;
    Array.prototype.forEach.call(document.querySelectorAll("#calRecords button.cday[data-date]"), function (b) {
      var on = b.getAttribute("data-date") === ds;
      b.classList.toggle("is-sel", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    var card = document.querySelector("#recordList .rec[data-date=\"" + ds + "\"]");
    if (!card && state.filter !== "all") {
      state.filter = "all";
      syncFilterChips();
      save();
      renderRecords();
      card = document.querySelector("#recordList .rec[data-date=\"" + ds + "\"]");
    }
    if (!card) card = document.querySelector("#emptyDays .rec[data-date=\"" + ds + "\"]");
    if (!card) return;
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    highlightCard(card);
  }
  var flashTimer;
  function highlightCard(card) {
    Array.prototype.forEach.call(document.querySelectorAll(".rec.flash"), function (c) { c.classList.remove("flash"); });
    card.classList.add("flash");
    clearTimeout(flashTimer);
    flashTimer = setTimeout(function () { card.classList.remove("flash"); }, 2600);
  }

  /* 3K 메달권 페이스 비교 바 (1,500 m 내 기록 vs 메달권) */
  function paceText(sec) {
    var m = Math.floor(sec / 60);
    var s = sec - m * 60;
    var t = (Math.round(s * 10) / 10).toFixed(1);
    return m + ":" + (s < 10 ? "0" + t : t);
  }
  function renderPaceBars() {
    var box = document.getElementById("paceBars");
    if (!box) return;
    var rows = [
      { key: "mine", name: "내 1,500 m 최고", sec: 90.1, note: "1:30.1 /100m · 22:32 (2026-11-11)" },
      { key: "bud", name: "2017 부다페스트 메달권", sec: 91.5, note: "1:31.5 /100m · 45:42~45:47 (3,000 m)" },
      { key: "doha", name: "2024 도하 메달권", sec: 81.2, note: "1:21.2 /100m · 40:35 (3,000 m 3위)" }
    ];
    box.innerHTML = rows.map(function (r) {
      var w = Math.max(6, Math.min(100, r.sec / 100 * 100));
      return "<div class=\"pbar " + r.key + "\">" +
        "<span class=\"pn\">" + r.name + "</span>" +
        "<span class=\"pv\">" + paceText(r.sec) + "</span>" +
        "<span class=\"ptrack\"><i class=\"pfill\" style=\"width:" + w.toFixed(1) + "%\"></i></span>" +
        "<span class=\"pnote\">" + r.note + "</span>" +
      "</div>";
    }).join("");
  }

  /* ---------------- ② 차트 ---------------- */
  var tip = null;
  function showTip(evt, text) {
    if (!tip) tip = document.getElementById("tip");
    tip.innerHTML = text;
    tip.hidden = false;
    var x, y;
    if (evt && evt.clientX != null && evt.clientX !== 0) { x = evt.clientX; y = evt.clientY; }
    else if (evt && evt.target && evt.target.getBoundingClientRect) {
      var r = evt.target.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top;
    } else return;
    var w = tip.offsetWidth || 140, h = tip.offsetHeight || 34;
    var left = Math.min(Math.max(8, x - w / 2), window.innerWidth - w - 8);
    var top = y - h - 10 < 8 ? y + 16 : y - h - 10;
    tip.style.left = left + "px";
    tip.style.top = top + "px";
  }
  function hideTip() { if (!tip) tip = document.getElementById("tip"); tip.hidden = true; }

  function niceMax(v) {
    if (v <= 0) return 1;
    var steps = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 7.5, 8, 10];
    var mag = Math.pow(10, Math.floor(Math.log(v) / Math.LN10));
    for (var k = 0; k < 4; k++) {
      for (var i = 0; i < steps.length; i++) {
        var cand = steps[i] * mag;
        if (cand >= v) return cand;
      }
      mag *= 10;
    }
    return 10 * mag;
  }
  function axisNum(v) {
    return (Math.abs(v - Math.round(v)) < 0.05) ? String(Math.round(v)) : String(Math.round(v * 10) / 10);
  }

  function drawBarChart(el, items, opts) {
    var W = Math.max(260, el.clientWidth || 340);
    var H = W < 420 ? 172 : (W < 760 ? 210 : 250);
    var m = { l: 34, r: 14, t: 22, b: 28 };
    var pw = W - m.l - m.r, ph = H - m.t - m.b;
    var max = niceMax(Math.max.apply(null, items.map(function (i) { return i.value; })) * 1.06);
    var slot = pw / items.length;
    var barW = Math.min(W < 420 ? 22 : (W < 760 ? 40 : 62), slot * 0.5);
    var svg = ["<svg width=\"" + W + "\" height=\"" + H + "\" viewBox=\"0 0 " + W + " " + H + "\" role=\"img\">"];
    // 그리드 + y축 눈금
    var DIV = 5;
    for (var g = 0; g <= DIV; g++) {
      var val = max * g / DIV, y = m.t + ph * (1 - g / DIV);
      svg.push("<line class=\"gridline\" x1=\"" + m.l + "\" y1=\"" + y.toFixed(1) + "\" x2=\"" + (W - m.r) + "\" y2=\"" + y.toFixed(1) + "\"/>");
      svg.push("<text class=\"axis\" x=\"" + (m.l - 6) + "\" y=\"" + (y + 3).toFixed(1) + "\" text-anchor=\"end\">" +
        axisNum(val) + "</text>");
    }
    // 평균선
    if (opts.avg != null) {
      var ay = m.t + ph * (1 - opts.avg / max);
      svg.push("<line x1=\"" + m.l + "\" y1=\"" + ay.toFixed(1) + "\" x2=\"" + (W - m.r) + "\" y2=\"" + ay.toFixed(1) +
        "\" stroke=\"#E9A23B\" stroke-width=\"1.4\" stroke-dasharray=\"4 3\" opacity=\".9\"/>");
    }
    var placedLabels = [];
    items.forEach(function (it, i) {
      var cx = m.l + slot * i + slot / 2;
      var h = it.value <= 0 ? 0 : Math.max(2, ph * (it.value / max));
      var y = m.t + ph - h;
      var color = it.value <= 0 ? "#E3EAE7" : (it.color || opts.color);
      svg.push("<rect class=\"bar\" data-i=\"" + i + "\" x=\"" + (cx - barW / 2).toFixed(1) + "\" y=\"" + y.toFixed(1) +
        "\" width=\"" + barW.toFixed(1) + "\" height=\"" + h.toFixed(1) + "\" rx=\"4\" fill=\"" + color + "\"" +
        (it.hl ? " stroke=\"#0F352E\" stroke-width=\"1.5\"" : "") + "/>");
      if (it.value > 0) {
        var lbl = opts.decimals ? (Math.round(it.value * 10) / 10) : Math.round(it.value);
        var lblText = String(lbl);
        // 좁은 화면에서 이웃 막대 숫자가 겹치지 않도록 필요한 만큼만 위로 한 줄씩 엇갈려 놓는다
        var lblW = lblText.length * 5.6 + 3;
        var dy = 0;
        var rows = [0, -11, -22];
        for (var r = 0; r < rows.length; r++) {
          var free = true;
          for (var p = 0; p < placedLabels.length; p++) {
            var o = placedLabels[p];
            if (o.dy === rows[r] && Math.abs(o.cx - cx) < (o.w + lblW) / 2 + 1) { free = false; break; }
          }
          if (free) { dy = rows[r]; break; }
          dy = rows[r];
        }
        placedLabels.push({ cx: cx, w: lblW, dy: dy });
        svg.push("<text class=\"barlabel\" x=\"" + cx.toFixed(1) + "\" y=\"" + (y - 5 + dy).toFixed(1) + "\" text-anchor=\"middle\">" + lblText + "</text>");
      }
      svg.push("<text class=\"ticklabel\" x=\"" + cx.toFixed(1) + "\" y=\"" + (H - 9) + "\" text-anchor=\"middle\">" + esc(it.label) + "</text>");
      // 터치/호버 영역
      svg.push("<rect class=\"hit\" data-i=\"" + i + "\" tabindex=\"0\" x=\"" + (m.l + slot * i).toFixed(1) + "\" y=\"" + m.t +
        "\" width=\"" + slot.toFixed(1) + "\" height=\"" + ph + "\" rx=\"4\"/>");
    });
    svg.push("</svg>");
    el.innerHTML = svg.join("");

    Array.prototype.forEach.call(el.querySelectorAll(".hit"), function (hit) {
      var i = +hit.getAttribute("data-i");
      var it = items[i];
      function on(e) { showTip(e, it.tip); highlight(el, i, true); }
      function off() { hideTip(); highlight(el, i, false); }
      hit.addEventListener("pointerenter", function (e) { if (e.pointerType !== "touch") on(e); });
      hit.addEventListener("pointerdown", function (e) {
        on(e);
        clearTimeout(pinTimer);
        pinTimer = setTimeout(off, 4000);
      });
      hit.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") off(); });
      hit.addEventListener("focus", on);
      hit.addEventListener("blur", off);
    });
  }
  var pinTimer;
  function setUnit(chartId, text) {
    var card = document.getElementById(chartId);
    if (!card) return;
    var head = card.parentNode.querySelector(".unit");
    if (head) head.textContent = text;
  }
  function highlight(el, i, on) {
    var bar = el.querySelector('.bar[data-i="' + i + '"]');
    if (bar) bar.classList.toggle("is-on", on);
  }

  function renderCharts() {
    var rows = D.monthly.map(function (m) { return m; });
    var nov = monthTotals("2026-11");
    var last = rows[rows.length - 1];
    last.swim = { n: nov.swim.n, km: nov.swim.km };
    last.run = { n: nov.run.n, km: nov.run.km };
    last.strength = nov.strength;

    var swimItems = rows.map(function (m) {
      return {
        label: m.label, value: m.swim.km,
        tip: "<b>" + m.label + "</b><br>수영 " + m.swim.n + "회 · " + km(m.swim.km) + " km" +
          (m.swim.n ? "<br>1회당 평균 " + km(m.swim.km / m.swim.n) + " km" : "") + (m.tag ? "<br>" + esc(m.tag) : "")
      };
    });
    var runItems = rows.map(function (m) {
      return {
        label: m.label, value: m.run.km,
        tip: "<b>" + m.label + "</b><br>러닝 " + m.run.n + "회 · " + km(m.run.km) + " km" +
          (m.run.n ? "<br>1회당 평균 " + km(m.run.km / m.run.n) + " km" : "")
      };
    });
    var stItems = rows.map(function (m) {
      return { label: m.label, value: m.strength, color: m.strength ? "#B4503A" : "#E3EAE7", tip: "<b>" + m.label + "</b><br>근력 " + m.strength + "회" };
    });

    function avgOf(items) {
      var vals = items.map(function (i) { return i.value; }).filter(function (v) { return v > 0; });
      return vals.length ? vals.reduce(function (a, b) { return a + b; }, 0) / vals.length : null;
    }

    var avgSwim = avgOf(swimItems), avgRun = avgOf(runItems), avgSt = avgOf(stItems);
    drawBarChart(document.getElementById("chartSwim"), swimItems, { color: "#1D5FA8", decimals: true, avg: avgSwim });
    drawBarChart(document.getElementById("chartRun"), runItems, { color: "#E9A23B", decimals: true, avg: avgRun });
    drawBarChart(document.getElementById("chartStrength"), stItems, { color: "#B4503A", decimals: false, avg: avgSt });

    setUnit("chartSwim", "km · 회 · 평균 " + km(avgSwim) + " km");
    setUnit("chartRun", "km · 회 · 평균 " + km(avgRun) + " km");
    setUnit("chartStrength", "회 · 평균 " + Math.round(avgSt) + "회");

    // 월별 표
    var tbl = document.getElementById("monthlyTable");
    var head = "<thead><tr><th>월</th><th>수영</th><th>러닝</th><th>근력</th><th>합계 거리</th></tr></thead>";
    var body = rows.map(function (m) {
      return "<tr><td><b>" + m.label + "</b></td>" +
        "<td class=\"num\">" + m.swim.n + "회 · " + km(m.swim.km) + " km</td>" +
        "<td class=\"num\">" + (m.run.n ? m.run.n + "회 · " + km(m.run.km) + " km" : "—") + "</td>" +
        "<td class=\"num\">" + (m.strength ? m.strength + "회" : "—") + "</td>" +
        "<td class=\"num\"><b>" + km(m.swim.km + m.run.km) + " km</b></td></tr>";
    }).join("");
    tbl.innerHTML = head + "<tbody>" + body + "</tbody>";
  }

  /* ---------------- ③ 개인 최고 ---------------- */
  function renderPR() {
    document.getElementById("prAsOf").textContent = D.pr.swimAsOf;
    document.getElementById("prSwimNote").textContent = "출처: 가민 커넥트 개인 기록 · 최장 수영은 2026-10-25.";
    document.getElementById("prRunNote").textContent = D.pr.runAsOf;
    document.getElementById("prSwim").innerHTML = D.pr.swim.map(function (p) {
      return "<div class=\"prrow\"><span class=\"dist\">" + esc(p.dist) + "</span>" +
        "<span class=\"time\">" + esc(p.time) + (p.pace && p.pace !== "—" ? "<small>" + esc(p.pace) + "</small>" : "") + "</span>" +
        "<span class=\"date\"><b>기록일</b>" + esc(p.date.replace(/-/g, ".")) + "</span></div>";
    }).join("");
    document.getElementById("prRun").innerHTML = D.pr.run.map(function (p) {
      return "<div class=\"prrow\"><span class=\"dist\">" + esc(p.dist) + "</span>" +
        "<span class=\"time\">" + esc(p.time) + (p.pace && p.pace !== "—" ? "<small>" + esc(p.pace) + "</small>" : "") + "</span>" +
        "<span class=\"date\"><b>기록일</b>" + esc(p.date.replace(/-/g, ".")) + "</span></div>";
    }).join("");
  }

  /* ---------------- ④ 기록 목록 ---------------- */
  function renderMonthSum() {
    var t = monthTotals("2026-11");
    var parts = [
      ["합계", km(t.swim.km + t.run.km) + " km", true],
      ["수영", km(t.swim.km) + " km", false],
      ["러닝", km(t.run.km) + " km", false],
      ["근력", t.strength + "회", false],
      ["시간", fmtDur(t.seconds), false],
      ["칼로리", int(t.kcal) + " kcal", false]
    ];
    document.getElementById("monthSum").innerHTML = parts.map(function (p) {
      return "<span class=\"msum" + (p[2] ? " main" : "") + "\"><em>" + p[0] + "</em><b>" + p[1] + "</b></span>";
    }).join("");
  }

  function recCard(r) {
    var s = SPORTS[r.sport] || { name: r.sport, icon: "•" };
    var distCell = "";
    if (r.sport === "swim" && r.distanceM) distCell = numCell("거리", int(r.distanceM), "m");
    else if (r.sport === "run" && r.distanceKm) distCell = numCell("거리", km(r.distanceKm), "km");
    else if (r.sport === "strength") distCell = numCell("세트 수", r.sets ? r.sets : "—", "");

    var cells = distCell +
      numCell("시간", fmtDur(r.seconds), "") +
      (r.pace ? numCell("평균 페이스", r.pace.replace(" /100m", "").replace(" /km", ""), r.pace.indexOf("/100m") > -1 ? "/100m" : "/km") : "") +
      (r.hrAvg ? numCell("심박 평균/최대", r.hrAvg + (r.hrMax ? "/" + r.hrMax : ""), "bpm") : "");

    var memo = state.memos[r.id] || "";
    return "<article class=\"rec" + (r.manual ? " manual" : "") + "\" data-id=\"" + esc(r.id) +
      "\" data-date=\"" + esc(r.date) + "\" data-sport=\"" + esc(r.sport) + "\">" +
      "<div class=\"rec-head\">" +
        "<div class=\"rec-date\"><div class=\"d\">" + esc(mmdd(r.date)) + "</div><div class=\"w\">" + dowOf(r.date) + "</div></div>" +
        "<div style=\"flex:1;min-width:0\">" +
          "<div class=\"rec-title\"><span class=\"icon " + esc(r.sport) + "\">" + s.icon + "</span>" + esc(r.place || s.name) +
            (r.manual ? "<span class=\"badge amber\">직접 입력</span>" : "") +
            (r.time ? "<span class=\"badge teal\">" + esc(r.time) + "</span>" : "") + "</div>" +
          "<div class=\"rec-sub\">" + (r.kcal ? int(r.kcal) + " kcal" : "") + (r.manual ? (r.kcal ? " · " : "") + "내가 추가한 기록" : "") + "</div>" +
        "</div>" +
      "</div>" +
      "<div class=\"rec-body\">" +
        "<div class=\"nums\">" + cells + "</div>" +
        (r.extra ? "<p class=\"extra\">" + esc(r.extra) + "</p>" : "") +
        (r.fact ? "<p class=\"fact\">" + esc(r.fact) + "</p>" : "") +
        (r.coach ? "<div class=\"coach\"><div class=\"ch\">🧑‍🏫 코치가 전하는 말</div><p>" + esc(r.coach) + "</p></div>" : "") +
        "<label class=\"lbl\" for=\"memo-" + esc(r.id) + "\">컨디션 메모" +
          "<span class=\"note-saved\" id=\"saved-" + esc(r.id) + "\">저장됨</span></label>" +
        "<textarea id=\"memo-" + esc(r.id) + "\" data-memo=\"" + esc(r.id) + "\" rows=\"2\" " +
          "placeholder=\"" + (r.sport === "swim" ? "예: 물 22도, 팔 힘 좋았음" : r.sport === "run" ? "예: 무릎 괜찮음, 마지막 1km 힘들었음" : "예: 하체 위주, 다음날 뻐근함") + "\">" + esc(memo) + "</textarea>" +
        (r.manual ? "<button class=\"del\" type=\"button\" data-del=\"" + esc(r.id) + "\">이 기록 삭제</button>" : "") +
      "</div>" +
    "</article>";
  }
  function numCell(k, v, unit) {
    return "<div class=\"numcell\"><div class=\"k\">" + k + "</div><div class=\"v\">" + v + (unit ? "<small>" + unit + "</small>" : "") + "</div></div>";
  }

  function renderRecords() {
    var all = allRecords();
    var counts = { all: all.length, swim: 0, run: 0, strength: 0 };
    all.forEach(function (r) { if (counts[r.sport] != null) counts[r.sport]++; });
    document.getElementById("cAll").textContent = counts.all;
    document.getElementById("cSwim").textContent = counts.swim;
    document.getElementById("cRun").textContent = counts.run;
    document.getElementById("cStrength").textContent = counts.strength;

    var list = state.filter === "all" ? all : all.filter(function (r) { return r.sport === state.filter; });
    var box = document.getElementById("recordList");
    box.innerHTML = list.length ? list.map(recCard).join("") : "<div class=\"card empty\">이 종목 기록이 아직 없습니다.</div>";
    bindMemos(box);
    renderEmptyDays(all);
  }

  var saveTimers = {};
  function bindMemos(box) {
    Array.prototype.forEach.call(box.querySelectorAll("textarea[data-memo]"), function (ta) {
      var id = ta.getAttribute("data-memo");
      ta.addEventListener("input", function () {
        var v = ta.value;
        if (v && v.trim()) state.memos[id] = v; else delete state.memos[id];
        clearTimeout(saveTimers[id]);
        saveTimers[id] = setTimeout(function () {
          save();
          var flag = document.getElementById("saved-" + id);
          if (flag) { flag.classList.add("on"); setTimeout(function () { flag.classList.remove("on"); }, 1200); }
        }, 350);
      });
      ta.addEventListener("blur", function () {
        clearTimeout(saveTimers[id]);
        save();
        var flag = document.getElementById("saved-" + id);
        if (flag) { flag.classList.add("on"); setTimeout(function () { flag.classList.remove("on"); }, 1200); }
      });
    });
    Array.prototype.forEach.call(box.querySelectorAll("button[data-del]"), function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-del");
        if (!confirm("이 직접 입력 기록을 지울까요?")) return;
        state.manual = state.manual.filter(function (m) { return m.id !== id; });
        delete state.memos[id];
        save(); renderAll(); toast("기록을 지웠습니다");
      });
    });
  }

  function renderEmptyDays(all) {
    var box = document.getElementById("emptyDays");
    var has = {};
    all.forEach(function (r) { has[r.date] = true; });
    var empty = D.days.filter(function (d) { return !has[d.date]; });
    if (!empty.length) { box.innerHTML = "<div class=\"card empty\">11/1~11/18 모든 날에 기록이 있습니다.</div>"; return; }
    box.innerHTML = empty.map(function (d) {
      var id = "day-" + d.date;
      return "<article class=\"rec\" data-date=\"" + esc(d.date) + "\" data-sport=\"-\">" +
        "<div class=\"rec-head\">" +
          "<div class=\"rec-date\"><div class=\"d\">" + esc(mmdd(d.date)) + "</div><div class=\"w\">" + d.dow + "</div></div>" +
          "<div style=\"flex:1;min-width:0\"><div class=\"rec-sub\" style=\"margin-top:.35rem\">운동 기록 없음 · 그날 몸 상태나 이유를 한 줄</div></div>" +
        "</div>" +
        "<div class=\"rec-body\">" +
          "<textarea data-memo=\"" + id + "\" rows=\"2\" placeholder=\"예: 장거리 이동, 회복일 / 예: 파도 심해 입수 안 함\">" + esc(state.memos[id] || "") + "</textarea>" +
        "</div></article>";
    }).join("");
    bindMemos(box);
  }

  /* ---------------- 필터 ---------------- */
  function syncFilterChips() {
    Array.prototype.forEach.call(document.querySelectorAll("#filters .chip"), function (c) {
      var on = c.getAttribute("data-sport") === state.filter;
      c.classList.toggle("is-active", on);
      c.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }
  function bindFilters() {
    Array.prototype.forEach.call(document.querySelectorAll("#filters .chip"), function (chip) {
      chip.addEventListener("click", function () {
        state.filter = chip.getAttribute("data-sport");
        syncFilterChips();
        save(); renderRecords();
      });
    });
    syncFilterChips();
  }

  /* ---------------- 새 운동 추가 ---------------- */
  function bindAddForm() {
    var form = document.getElementById("addForm");
    var fSport = document.getElementById("fSport");
    var hint = document.getElementById("fDistHint");
    document.getElementById("fDate").value = todayStr();
    function syncHint() {
      hint.textContent = fSport.value === "swim" ? "(m)" : fSport.value === "run" ? "(km)" : "(해당 없음)";
      document.getElementById("fDist").disabled = fSport.value === "strength";
    }
    fSport.addEventListener("change", syncHint);
    syncHint();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var date = document.getElementById("fDate").value;
      var sport = fSport.value;
      var dist = parseFloat(document.getElementById("fDist").value);
      var mins = parseFloat(document.getElementById("fMin").value);
      if (!date) { toast("날짜를 넣어 주세요"); return; }
      if (!(dist > 0) && !(mins > 0)) { toast("거리나 시간 중 하나는 넣어 주세요"); return; }
      var rec = {
        id: "m-" + Date.now(),
        date: date, time: "", sport: sport,
        seconds: mins > 0 ? Math.round(mins * 60) : null,
        hrAvg: parseInt(document.getElementById("fHr").value, 10) || null,
        kcal: parseInt(document.getElementById("fKcal").value, 10) || null
      };
      if (sport === "swim" && dist > 0) rec.distanceM = dist;
      if (sport === "run" && dist > 0) rec.distanceKm = dist;
      if (rec.seconds && ((sport === "swim" && rec.distanceM) || (sport === "run" && rec.distanceKm))) {
        var meters = sport === "swim" ? rec.distanceM : rec.distanceKm * 1000;
        var per = rec.seconds / meters * 100;
        if (sport === "swim") rec.pace = Math.floor(per / 60) + ":" + pad(Math.round(per % 60)) + " /100m";
        else rec.pace = fmtDur(rec.seconds / (meters / 1000)) + " /km";
      }
      var note = document.getElementById("fNote").value;
      state.manual.push(rec);
      if (note && note.trim()) state.memos[rec.id] = note;
      save();
      form.reset();
      document.getElementById("fDate").value = todayStr();
      syncHint();
      renderAll();
      toast("기록을 추가했습니다");
    });
  }

  /* ---------------- 백업 / 복원 ---------------- */
  function backup() {
    var data = {
      app: "workout-log", version: 1, owner: D.meta.owner,
      savedAt: new Date().toISOString(),
      memos: state.memos, manual: state.manual, big: state.big, filter: state.filter
    };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "운동로그-백업-" + todayStr() + ".json";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
    toast("백업 파일을 내려받았습니다");
  }
  function restoreFile(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var d = JSON.parse(reader.result);
        if (!d || (!d.memos && !d.manual)) throw new Error("형식");
        if (!confirm("이 기기에 저장된 메모와 직접 추가한 기록을 백업 파일 내용으로 바꿉니다. 계속할까요?")) return;
        state.memos = d.memos || {};
        state.manual = Array.isArray(d.manual) ? d.manual : [];
        if (typeof d.big === "boolean") state.big = d.big;
        save(); applyBig(); renderAll();
        toast("백업을 불러왔습니다");
      } catch (e) { toast("이 파일은 운동 로그 백업이 아닙니다"); }
    };
    reader.readAsText(file);
  }
  function bindStorage() {
    document.getElementById("btnBackup").addEventListener("click", backup);
    document.getElementById("btnBackup2").addEventListener("click", backup);
    var inp = document.getElementById("fileRestore");
    document.getElementById("btnRestore").addEventListener("click", function () { inp.click(); });
    document.getElementById("btnRestore2").addEventListener("click", function () { inp.click(); });
    inp.addEventListener("change", function () { if (inp.files && inp.files[0]) { restoreFile(inp.files[0]); inp.value = ""; } });
    document.getElementById("btnClear").addEventListener("click", function () {
      if (!confirm("이 기기에 저장한 메모·직접 추가한 기록·큰 글씨 설정을 모두 지웁니다. 되돌릴 수 없습니다. 계속할까요?")) return;
      state.memos = {}; state.manual = []; state.big = false;
      save(); applyBig(); renderAll();
      toast("내 입력을 모두 지웠습니다");
    });
  }

  /* ---------------- 큰 글씨 · 탭 ---------------- */
  function applyBig() {
    document.documentElement.classList.toggle("big", state.big);
    var btn = document.getElementById("btnBig");
    btn.setAttribute("aria-pressed", state.big ? "true" : "false");
    btn.textContent = state.big ? "가− 보통 글씨" : "가+ 큰 글씨";
  }
  function bindBig() {
    document.getElementById("btnBig").addEventListener("click", function () {
      state.big = !state.big; applyBig(); save();
      renderCharts(); // 글씨 크기가 바뀌면 차트 폭이 달라집니다
    });
  }
  function bindTabs() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll("#tabs .tab"));
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var el = document.getElementById(tab.getAttribute("data-target"));
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    var secs = tabs.map(function (t) { return document.getElementById(t.getAttribute("data-target")); }).filter(Boolean);
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        tabs.forEach(function (t) {
          t.classList.toggle("is-active", t.getAttribute("data-target") === en.target.id);
        });
      });
    }, { rootMargin: "-25% 0px -65% 0px", threshold: 0 });
    secs.forEach(function (s) { io.observe(s); });
  }

  /* ---------------- 시작 ---------------- */
  function renderAll() {
    renderHeader();
    renderRaces();
    renderCalendars();
    renderMonthTotal();
    renderWindows();
    renderCharts();
    renderPR();
    renderPaceBars();
    renderMonthSum();
    renderRecords();
    updateStorageLine();
  }

  load();
  applyBig();
  renderAll();
  bindFilters();
  bindAddForm();
  bindStorage();
  bindBig();
  bindTabs();

  window.addEventListener("resize", function () {
    clearTimeout(window.__rt);
    window.__rt = setTimeout(function () { renderCharts(); }, 250);
  });
  window.addEventListener("scroll", hideTip, { passive: true });
  document.addEventListener("pointerdown", function (e) {
    if (!e.target || !e.target.classList || !e.target.classList.contains("hit")) hideTip();
  }, true);
})();
