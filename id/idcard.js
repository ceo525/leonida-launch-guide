/* Leonida Citizen ID - client-side card renderer. No external assets.
   drawCard(canvas, {alias, scale, watermark}) draws a 1500x945 (x scale) ID card. */
(function () {
  "use strict";
  var W = 1500, H = 945;

  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  function citizenNumber(alias) {
    var a = hash("leonida:" + alias.toLowerCase());
    var b = hash("citizen:" + alias.toLowerCase());
    var p1 = String(a % 10000).padStart(4, "0");
    var p2 = String(b % 1000000).padStart(6, "0");
    return "LN-" + p1 + "-" + p2;
  }

  function cleanAlias(raw) {
    var s = String(raw || "").replace(/[^\p{L}\p{N} ._\-']/gu, "").trim();
    if (s.length > 22) s = s.slice(0, 22);
    return s || "UNKNOWN CITIZEN";
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawCard(canvas, opts) {
    var alias = cleanAlias(opts.alias);
    var scale = opts.scale || 1;
    canvas.width = Math.round(W * scale);
    canvas.height = Math.round(H * scale);
    var ctx = canvas.getContext("2d");
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    var seed = hash(alias);

    // background: Vice-dusk gradient
    var bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#12072b");
    bg.addColorStop(0.45, "#3a0f5c");
    bg.addColorStop(0.75, "#8f1d63");
    bg.addColorStop(1, "#c8483f");
    roundRect(ctx, 0, 0, W, H, 48);
    ctx.save();
    ctx.clip();
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // sun with stripes
    var cx = 1160, cy = 520, r = 250;
    var sun = ctx.createLinearGradient(0, cy - r, 0, cy + r);
    sun.addColorStop(0, "#ffd36b");
    sun.addColorStop(0.55, "#ff9a3c");
    sun.addColorStop(1, "#ff3d81");
    ctx.fillStyle = sun;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#8f1d63";
    for (var i = 0; i < 7; i++) {
      var y = cy + 20 + i * 34;
      ctx.fillRect(cx - r, y, r * 2, 6 + i * 2.2);
    }

    // skyline silhouette (deterministic per alias)
    ctx.fillStyle = "#12072b";
    var x = 840, s = seed;
    while (x < W) {
      s = (Math.imul(s, 1103515245) + 12345) >>> 0;
      var bw = 40 + (s % 70);
      var bh = 90 + ((s >>> 8) % 220);
      ctx.fillRect(x, H - 170 - bh, bw, bh + 170);
      x += bw + 4;
    }
    // palms
    function palm(px, py, h) {
      ctx.strokeStyle = "#12072b"; ctx.lineWidth = 12; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(px, py); ctx.quadraticCurveTo(px + 30, py - h / 2, px + 10, py - h); ctx.stroke();
      ctx.lineWidth = 9;
      for (var k = 0; k < 6; k++) {
        var ang = -Math.PI + k * (Math.PI / 5);
        ctx.beginPath(); ctx.moveTo(px + 10, py - h);
        ctx.quadraticCurveTo(px + 10 + Math.cos(ang) * 60, py - h - 40, px + 10 + Math.cos(ang) * 120, py - h + 30 + Math.abs(Math.sin(ang)) * 10);
        ctx.stroke();
      }
    }
    palm(1330, H - 160, 300);

    // ground band
    ctx.fillStyle = "#12072b";
    ctx.fillRect(0, H - 170, W, 170);
    ctx.restore();

    // frame
    ctx.lineWidth = 6;
    ctx.strokeStyle = "rgba(255,211,107,0.85)";
    roundRect(ctx, 18, 18, W - 36, H - 36, 36);
    ctx.stroke();

    // header
    ctx.fillStyle = "#ffd36b";
    ctx.font = "800 64px 'Segoe UI', system-ui, sans-serif";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("STATE OF LEONIDA", 70, 120);
    ctx.fillStyle = "#fff7ef";
    ctx.font = "600 34px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText("CITIZEN IDENTIFICATION", 72, 168);

    // photo box with initial
    ctx.fillStyle = "rgba(18,7,43,0.75)";
    roundRect(ctx, 70, 215, 260, 320, 22); ctx.fill();
    ctx.strokeStyle = "#28e0d0"; ctx.lineWidth = 4; ctx.stroke();
    var ig = ctx.createLinearGradient(70, 215, 330, 535);
    ig.addColorStop(0, "#ffd36b"); ig.addColorStop(1, "#ff3d81");
    ctx.fillStyle = ig;
    ctx.font = "900 200px 'Segoe UI', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(alias.charAt(0).toUpperCase(), 200, 450);
    ctx.textAlign = "left";

    // fields
    function field(label, value, fx, fy, size) {
      ctx.fillStyle = "#e4d3ea";
      ctx.font = "600 26px 'Segoe UI', system-ui, sans-serif";
      ctx.fillText(label, fx, fy);
      ctx.fillStyle = "#fff7ef";
      ctx.font = "800 " + (size || 52) + "px 'Segoe UI', system-ui, sans-serif";
      ctx.fillText(value, fx, fy + (size || 52) + 6);
    }
    var aliasSize = alias.length > 14 ? 46 : 60;
    field("ALIAS", alias.toUpperCase(), 380, 250, aliasSize);
    field("CITIZEN NO.", citizenNumber(alias), 380, 390, 46);
    field("VALID FROM", "19 NOV 2026", 380, 510, 46);

    // stamp
    ctx.save();
    ctx.translate(500, 690);
    ctx.rotate(-0.12);
    ctx.strokeStyle = "#ff3d81"; ctx.lineWidth = 7;
    roundRect(ctx, -270, -58, 540, 116, 16); ctx.stroke();
    ctx.fillStyle = "#ff3d81";
    ctx.font = "900 40px 'Segoe UI', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("DOORS OPEN 19.11.26", 0, 14, 480);
    ctx.restore();

    // footer line
    ctx.fillStyle = "#e4d3ea";
    ctx.font = "500 22px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText("Unofficial fan item. Not affiliated with Rockstar Games.", 70, H - 50);
    ctx.textAlign = "right";
    ctx.fillText("ceo525.github.io/leonida-launch-guide/id", W - 70, H - 50);
    ctx.textAlign = "left";

    if (opts.watermark) {
      ctx.save();
      ctx.globalAlpha = 0.38;
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 120px 'Segoe UI', system-ui, sans-serif";
      ctx.textAlign = "center";
      for (var wy = 0; wy < 3; wy++) {
        ctx.save();
        ctx.translate(W / 2, 220 + wy * 300);
        ctx.rotate(-0.25);
        ctx.fillText("PREVIEW  PREVIEW", 0, 0);
        ctx.restore();
      }
      ctx.restore();
    }
    return { alias: alias, number: citizenNumber(alias) };
  }

  window.LeonidaID = { drawCard: drawCard, citizenNumber: citizenNumber, cleanAlias: cleanAlias };
})();
