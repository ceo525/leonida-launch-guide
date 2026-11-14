(function () {
  'use strict';
  // Launch moment: 19 November 2026, 00:00 in the visitor's local time zone.
  var target = new Date(2026, 10, 19, 0, 0, 0).getTime();
  var root = document.getElementById('countdown');
  if (!root) return;
  var els = {
    d: root.querySelector('[data-unit="days"]'),
    h: root.querySelector('[data-unit="hours"]'),
    m: root.querySelector('[data-unit="minutes"]'),
    s: root.querySelector('[data-unit="seconds"]')
  };
  var note = document.getElementById('countdown-note');
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function tick() {
    var left = target - Date.now();
    if (left <= 0) {
      els.d.textContent = '0'; els.h.textContent = '00'; els.m.textContent = '00'; els.s.textContent = '00';
      if (note) note.textContent = 'The countdown has reached zero. Open the tracker and start your checklist.';
      clearInterval(timer);
      return;
    }
    var total = Math.floor(left / 1000);
    els.d.textContent = String(Math.floor(total / 86400));
    els.h.textContent = pad(Math.floor((total % 86400) / 3600));
    els.m.textContent = pad(Math.floor((total % 3600) / 60));
    els.s.textContent = pad(total % 60);
  }
  var timer = setInterval(tick, 1000);
  tick();
})();
