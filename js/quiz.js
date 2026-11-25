/* Trinigram quiz — runs entirely in the browser.
   No network calls, no storage, no analytics. Questions, scoring and results
   text are carried over unchanged from the original trinigram.com app. */
(function (root) {
  "use strict";

  var QUESTIONS = [
    { id: "q1", text: "How often do you pause to notice details in the natural world (e.g., plants, sky, animals)?", category: "G" },
    { id: "q2", text: "How frequently do you examine passages where Jesus interacts with others in the Bible?", category: "P" },
    { id: "q3", text: "How often do you schedule time for reflective prayer before making decisions?", category: "A" },
    { id: "q4", text: "To what extent do you perceive your life as fitting within a purposeful divine plan?", category: "G" },
    { id: "q5", text: "How much influence does Jesus' example of gentleness have on your everyday behaviour?", category: "P" },
    { id: "q6", text: "In quiet moments, how aware are you of a sense of spiritual presence?", category: "A" },
    { id: "q7", text: "I feel awe at humanity's resilience.", category: "G" },
    { id: "q8", text: "How often do you analyse Jesus' responses to various situations described in scripture?", category: "P" },
    { id: "q9", text: "I tune in without expecting signs.", category: "A" },
    { id: "q10", text: "I find beauty in small moments.", category: "G" },
    { id: "q11", text: "Jesus' steady manner is a key model I aspire to emulate.", category: "P" },
    { id: "q12", text: "I regularly practice listening for the Spirit.", category: "A" },
    { id: "q13", text: "During difficult circumstances, how frequently do you interpret events as influenced by God?", category: "G" },
    { id: "q14", text: "I reflect on Jesus' movements.", category: "P" },
    { id: "q15", text: "When facing challenges, how clearly can you differentiate between personal thoughts and what you regard as spiritual guidance?", category: "A" },
    { id: "q16", text: "I feel compassion for others' flaws.", category: "G" },
    { id: "q17", text: "I see Jesus' example in struggle.", category: "P" },
    { id: "q18", text: "I feel the Spirit's presence in tough moments.", category: "A" },
    { id: "q19", text: "I experience God's grace in daily life.", category: "G" },
    { id: "q20", text: "I seek to understand and internalize Jesus' way of explaining life.", category: "P" },
    { id: "q21", text: "I sense the Spirit's nudge in choices.", category: "A" },
    { id: "q22", text: "I'm compassionate to myself.", category: "G" },
    { id: "q23", text: "To what degree do Jesus' communication patterns shape how you speak with others?", category: "P" },
    { id: "q24", text: "I stay tuned to the Spirit's peace.", category: "A" },
    { id: "q25", text: "I see others as God's gift.", category: "G" },
    { id: "q26", text: "I study Jesus' calm responses to inform how I react.", category: "P" },
    { id: "q27", text: "I feel the Spirit's steady presence.", category: "A" },
    { id: "q28", text: "I regularly experience wonder when considering the complexity of God's creation.", category: "G" },
    { id: "q29", text: "I intentionally study how Jesus navigated daily life and relationships as a model for my own.", category: "P" },
    { id: "q30", text: "I'm open to the Spirit's whisper.", category: "A" }
  ];

  var DEFAULT_ANSWER = 3; // the original preselects 3 on every question

  var NARRATIVE = {
    glory: {
      primary: "This is your primary strength. You have a strong sense of God's design and purpose in creation. You easily recognize beauty and meaning in the world around you and in others.",
      secondary: "This is a secondary strength in your faith. You have a solid awareness of God as Designer and can recognize His work in creation and daily life.",
      "balanced-high": "This is one of your balanced strengths. You have a good awareness of God's design and purpose in creation and can often recognize beauty and meaning around you.",
      balanced: "You maintain a balanced awareness of God as Designer along with your other dimensions of faith.",
      developing: "This is a developing area in your faith journey. With practice, you can deepen your recognition of God's glory in everyday life.",
      growth: "This appears to be your growth opportunity. Developing practices that help you recognize God's design in creation can strengthen this dimension."
    },
    pursuit: {
      primary: "This is your primary strength. You actively study and follow Jesus' example, and His teachings significantly shape how you navigate relationships and challenges.",
      secondary: "This is a secondary strength in your faith. You have a solid understanding of Jesus' approach to life and relationships, which provides clarity in your faith journey.",
      "balanced-high": "This is one of your balanced strengths. You regularly look to Jesus' example and teachings to inform your own life decisions.",
      balanced: "You maintain a balanced focus on Jesus' example along with your other dimensions of faith.",
      developing: "This is a developing area in your faith journey. Deepening your study of how Jesus lived can provide more clarity for your own life.",
      growth: "This appears to be your growth opportunity. Intentionally studying how Jesus lived and taught can provide a clearer model for your life."
    },
    attunement: {
      primary: "This is your primary strength. You have developed a strong awareness of the Holy Spirit's guidance in your life and regularly recognize and respond to the Spirit's presence.",
      secondary: "This is a secondary strength in your faith. You have a good awareness of the Spirit's guidance and can often sense divine direction in your decisions.",
      "balanced-high": "This is one of your balanced strengths. You recognize the Holy Spirit's guidance in your life and can discern this presence in important moments.",
      balanced: "You maintain a balanced awareness of the Spirit's guidance along with your other dimensions of faith.",
      developing: "This is a developing area in your faith journey. With practice, you can develop greater sensitivity to the Spirit's guidance.",
      growth: "This appears to be your growth opportunity. Creating space to listen and attune to the Spirit can transform your daily spiritual experience."
    }
  };

  /* ---------- scoring: identical math to the original ---------- */
  function computeScores(questions, answers) {
    var sum = { G: 0, P: 0, A: 0 }, count = { G: 0, P: 0, A: 0 };
    questions.forEach(function (q) {
      var v = answers[q.id] || 0;
      sum[q.category] += v;
      count[q.category]++;
    });
    var glory = count.G > 0 ? sum.G / count.G : 0;
    var pursuit = count.P > 0 ? sum.P / count.P : 0;
    var attunement = count.A > 0 ? sum.A / count.A : 0;
    var gP = glory / 5 * 100, pP = pursuit / 5 * 100, aP = attunement / 5 * 100;
    var total = gP + pP + aP;
    // Guard (not in the original): all-zero answers would divide by zero and show NaN.
    // Treat that case as an even split, which is what the formula gives for equal scores.
    if (total === 0) { gP = pP = aP = 1; total = 3; }
    var N = Math.round(gP / total * 100), M = Math.round(pP / total * 100), A = Math.round(aP / total * 100);
    var T = N + M + A;
    if (T !== 100) {
      var d = 100 - T;
      if (N >= M && N >= A) N += d; else if (M >= N && M >= A) M += d; else A += d;
    }
    return { glory: glory, pursuit: pursuit, attunement: attunement,
             gloryPercentage: N, pursuitPercentage: M, attunementPercentage: A };
  }

  /* Highest / Lowest badges: rank by percentage (stable sort, Glory > Pursuit > Attunement on ties) */
  function ranks(r) {
    var list = [
      { name: "glory", value: r.gloryPercentage },
      { name: "pursuit", value: r.pursuitPercentage },
      { name: "attunement", value: r.attunementPercentage }
    ];
    var sorted = stableSortDesc(list);
    var out = {};
    sorted.forEach(function (x, i) { out[x.name] = i + 1; });
    return out;
  }

  /* Narrative category per dimension: gaps of 5 points or more count as distinct */
  function classify(r) {
    var y = stableSortDesc([
      { name: "glory", value: r.gloryPercentage },
      { name: "pursuit", value: r.pursuitPercentage },
      { name: "attunement", value: r.attunementPercentage }
    ]);
    var gaps = [y[0].value - y[1].value, y[1].value - y[2].value];
    var big = function (g) { return g >= 5; };
    var x = {};
    if (big(gaps[0])) {
      x[y[0].name] = "primary";
      if (big(gaps[1])) { x[y[1].name] = "secondary"; x[y[2].name] = "growth"; }
      else { x[y[1].name] = "developing"; x[y[2].name] = "developing"; }
    } else {
      x[y[0].name] = "balanced-high";
      x[y[1].name] = "balanced-high";
      x[y[2].name] = big(gaps[1]) ? "growth" : "balanced";
    }
    return x;
  }

  function stableSortDesc(list) {
    return list.map(function (v, i) { return { v: v, i: i }; })
      .sort(function (a, b) { return (b.v.value - a.v.value) || (a.i - b.i); })
      .map(function (o) { return o.v; });
  }

  function shuffle(arr) {
    var s = arr.slice();
    for (var w = s.length - 1; w > 0; w--) {
      var e = Math.floor(Math.random() * (w + 1));
      var t = s[w]; s[w] = s[e]; s[e] = t;
    }
    return s;
  }

  function summaryText(r) {
    return "TRINIGRAM RESULTS:\n----------------\n" +
      "Glory (Father): " + r.gloryPercentage + "%\n" +
      "Pursuit (Son): " + r.pursuitPercentage + "%\n" +
      "Attunement (Spirit): " + r.attunementPercentage + "%\n\n" +
      "Thank you for using Trinigram! Visit trinigram.com for more resources.";
  }

  /* Results Venn: circle size follows the original rule, diameter = max(80 + percentage, 90) */
  function resultsVenn(r) {
    var rad = function (p) { return Math.max(80 + p, 90) / 2; };
    var rg = rad(r.gloryPercentage), rp = rad(r.pursuitPercentage), ra = rad(r.attunementPercentage);
    var gx = 150, gy = 104, px = 112, py = 170, ax = 188, ay = 170, cx = 150, cy = 148;
    return '<svg class="results-venn" viewBox="0 0 300 290" role="img" aria-label="Your balance: Glory ' +
      r.gloryPercentage + '%, Pursuit ' + r.pursuitPercentage + '%, Attunement ' + r.attunementPercentage + '%">' +
      '<defs><radialGradient id="rglow" cx="' + cx + '" cy="' + cy + '" r="40" gradientUnits="userSpaceOnUse">' +
      '<stop offset="0" stop-color="#fffaf0" stop-opacity="0.9"/><stop offset="0.5" stop-color="#f6e6b8" stop-opacity="0.45"/>' +
      '<stop offset="1" stop-color="#f6e6b8" stop-opacity="0"/></radialGradient></defs>' +
      '<g style="isolation:isolate">' +
      '<circle cx="' + gx + '" cy="' + gy + '" r="' + rg + '" fill="#d4a94a" fill-opacity="0.7" style="mix-blend-mode:multiply"/>' +
      '<circle cx="' + px + '" cy="' + py + '" r="' + rp + '" fill="#b23a3c" fill-opacity="0.6" style="mix-blend-mode:multiply"/>' +
      '<circle cx="' + ax + '" cy="' + ay + '" r="' + ra + '" fill="#3f68ad" fill-opacity="0.6" style="mix-blend-mode:multiply"/>' +
      '</g><circle cx="' + cx + '" cy="' + cy + '" r="40" fill="url(#rglow)"/>' +
      '<g fill="none" stroke="#3b2a1a" stroke-width="0.9" stroke-opacity="0.85">' +
      '<circle cx="' + gx + '" cy="' + gy + '" r="' + rg + '"/><circle cx="' + px + '" cy="' + py + '" r="' + rp + '"/>' +
      '<circle cx="' + ax + '" cy="' + ay + '" r="' + ra + '"/></g>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="2" fill="#3b2a1a"/>' +
      '<g font-family="Cormorant Garamond, Georgia, serif" font-size="26" font-weight="600" text-anchor="middle">' +
      '<text x="' + gx + '" y="' + (gy - rg + 30) + '" fill="#5c3f10">G</text>' +
      '<text x="' + (px - rp * 0.45) + '" y="' + (py + rp * 0.45) + '" fill="#6e1619">P</text>' +
      '<text x="' + (ax + ra * 0.45) + '" y="' + (ay + ra * 0.45) + '" fill="#1a3361">A</text></g></svg>';
  }

  var api = { QUESTIONS: QUESTIONS, NARRATIVE: NARRATIVE, computeScores: computeScores,
              classify: classify, ranks: ranks, summaryText: summaryText, shuffle: shuffle,
              resultsVenn: resultsVenn, DEFAULT_ANSWER: DEFAULT_ANSWER };

  if (typeof module !== "undefined" && module.exports) { module.exports = api; return; }
  root.Trinigram = api;

  /* ---------- UI ---------- */
  function $(id) { return document.getElementById(id); }

  function init() {
    var form = $("quiz");
    if (!form) return;
    var order = shuffle(QUESTIONS);
    var answers = {};
    var idx = 0;
    var labels = { 0: "Never", 5: "Always" };

    function resetAnswers() { QUESTIONS.forEach(function (q) { answers[q.id] = DEFAULT_ANSWER; }); }
    resetAnswers();

    function render(focus) {
      var q = order[idx];
      $("q-text").textContent = q.text;
      var opts = $("q-options");
      opts.innerHTML = "";
      for (var v = 0; v <= 5; v++) {
        var label = document.createElement("label");
        label.className = "opt";
        var input = document.createElement("input");
        input.type = "radio";
        input.name = q.id;
        input.value = String(v);
        input.checked = answers[q.id] === v;
        input.setAttribute("aria-label", v + (labels[v] ? " (" + labels[v] + ")" : ""));
        input.addEventListener("change", function (e) { answers[q.id] = Number(e.target.value); });
        var face = document.createElement("span");
        face.className = "opt-face";
        face.setAttribute("aria-hidden", "true");
        face.textContent = String(v);
        label.appendChild(input);
        label.appendChild(face);
        if (labels[v]) {
          var cap = document.createElement("span");
          cap.className = "opt-caption";
          cap.setAttribute("aria-hidden", "true");
          cap.textContent = labels[v];
          label.appendChild(cap);
        }
        opts.appendChild(label);
      }
      var n = order.length;
      $("progress-text").textContent = "Question " + (idx + 1) + " of " + n;
      var pct = Math.round(idx / n * 100);
      $("progress-pct").textContent = pct + "%";
      $("progress-fill").style.width = pct + "%";
      $("live").textContent = "Question " + (idx + 1) + " of " + n;
      $("prev").disabled = idx === 0;
      $("next").textContent = idx === n - 1 ? "Show the Results" : "Next →";
      if (focus) $("q-text").focus();
    }

    function showResults() {
      var r = computeScores(order, answers);
      var cls = classify(r), rk = ranks(r);
      $("results-venn").innerHTML = resultsVenn(r);
      ["glory", "pursuit", "attunement"].forEach(function (k) {
        var p = r[k + "Percentage"];
        $("pct-" + k).textContent = p + "%";
        $("bar-" + k).style.width = p + "%";
        $("narr-" + k).textContent = NARRATIVE[k][cls[k]];
        var b = document.querySelector('[data-badge="' + k + '"]');
        if (rk[k] === 1) { b.textContent = "Highest"; b.classList.remove("hidden"); }
        else if (rk[k] === 3) { b.textContent = "Lowest"; b.classList.remove("hidden"); }
        else { b.textContent = ""; b.classList.add("hidden"); }
      });
      $("quiz-view").classList.add("hidden");
      $("results-view").classList.remove("hidden");
      $("status").textContent = "";
      window.scrollTo(0, 0);
      $("results-view").focus();
      showResults.last = r;
    }

    $("next").addEventListener("click", function () {
      if (idx < order.length - 1) { idx++; render(true); } else { showResults(); }
    });
    $("prev").addEventListener("click", function () { if (idx > 0) { idx--; render(true); } });

    $("retake").addEventListener("click", function () {
      resetAnswers();
      idx = 0;
      $("results-view").classList.add("hidden");
      $("quiz-view").classList.remove("hidden");
      render(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      $("q-text").focus();
    });
    $("print").addEventListener("click", function () {
      $("status").textContent = "Save as PDF or print your results for future reference.";
      window.print();
    });
    $("copy").addEventListener("click", function () {
      var text = summaryText(showResults.last);
      var done = function () { $("status").textContent = "A summary of your results has been copied to your clipboard."; };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
      } else { fallbackCopy(text); done(); }
    });

    function fallbackCopy(text) {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "absolute"; ta.style.left = "-9999px";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (e) { /* ignore */ }
      document.body.removeChild(ta);
    }

    form.addEventListener("submit", function (e) { e.preventDefault(); });
    form.classList.remove("hidden");
    render(false);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(typeof window !== "undefined" ? window : this);
