(function () {
  'use strict';
  var KEY = 'leonida-launch-guide:progress:v1';
  var data = typeof TRACKER_DATA !== 'undefined' ? TRACKER_DATA : [];
  var root = document.getElementById('tracker');
  var statusEl = document.getElementById('status');
  var fill = document.getElementById('bar-fill');
  var bar = document.getElementById('bar');
  var label = document.getElementById('progress-label');
  var checked = {};
  var validIds = {};
  var total = 0;

  data.forEach(function (s) { s.items.forEach(function (i) { validIds[i.id] = true; total++; }); });

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      var parsed = raw ? JSON.parse(raw) : {};
      Object.keys(parsed).forEach(function (id) { if (validIds[id] && parsed[id] === true) checked[id] = true; });
    } catch (e) { checked = {}; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(checked)); }
    catch (e) { say('Could not save in this browser. Use Export to keep a copy.'); }
  }
  function say(msg) { statusEl.textContent = msg; }

  function render() {
    root.innerHTML = '';
    data.forEach(function (section, si) {
      var card = document.createElement('section');
      card.className = 'card';
      var h = document.createElement('h2');
      h.style.marginTop = '0';
      var meta = document.createElement('span');
      meta.className = 'section-meta';
      meta.id = 'meta-' + si;
      h.appendChild(document.createTextNode(section.title + ' '));
      h.appendChild(meta);
      card.appendChild(h);
      var ul = document.createElement('ul');
      ul.className = 'check';
      section.items.forEach(function (item) {
        var li = document.createElement('li');
        var lab = document.createElement('label');
        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = !!checked[item.id];
        cb.addEventListener('change', function () {
          if (cb.checked) checked[item.id] = true; else delete checked[item.id];
          save(); update();
        });
        var span = document.createElement('span');
        span.textContent = item.text;
        lab.appendChild(cb); lab.appendChild(span);
        li.appendChild(lab); ul.appendChild(li);
      });
      card.appendChild(ul);
      root.appendChild(card);
    });
    update();
  }

  function update() {
    var done = Object.keys(checked).length;
    var pct = total ? Math.round((done / total) * 100) : 0;
    fill.style.width = pct + '%';
    bar.setAttribute('aria-valuenow', String(pct));
    label.textContent = done + ' of ' + total + ' done (' + pct + '%)';
    data.forEach(function (s, si) {
      var n = s.items.filter(function (i) { return checked[i.id]; }).length;
      var m = document.getElementById('meta-' + si);
      if (m) m.textContent = '(' + n + '/' + s.items.length + ')';
    });
  }

  document.getElementById('btn-export').addEventListener('click', function () {
    var payload = { app: 'leonida-launch-guide', version: 1, exported: new Date().toISOString(), checked: Object.keys(checked) };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'launch-progress.json';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    say('Progress exported as launch-progress.json.');
  });

  var fileInput = document.getElementById('file-import');
  document.getElementById('btn-import').addEventListener('click', function () { fileInput.click(); });
  fileInput.addEventListener('change', function () {
    var f = fileInput.files && fileInput.files[0];
    if (!f) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var obj = JSON.parse(String(reader.result));
        if (!obj || !Array.isArray(obj.checked)) throw new Error('bad shape');
        var next = {}; var skipped = 0;
        obj.checked.forEach(function (id) { if (validIds[id]) next[id] = true; else skipped++; });
        checked = next; save(); render();
        say('Imported ' + Object.keys(next).length + ' items' + (skipped ? ' (' + skipped + ' unknown ignored)' : '') + '.');
      } catch (e) { say('That file is not a valid progress export. Nothing was changed.'); }
      fileInput.value = '';
    };
    reader.onerror = function () { say('Could not read that file.'); };
    reader.readAsText(f);
  });

  document.getElementById('btn-reset').addEventListener('click', function () {
    if (window.confirm('Clear all progress on this device? Export first if you want a backup.')) {
      checked = {}; save(); render(); say('Progress cleared.');
    }
  });

  load();
  render();
})();
