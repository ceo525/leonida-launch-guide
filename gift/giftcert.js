/* Leonida Gift Kit - client-side gift certificate renderer. No external assets.
   drawCert(canvas, {to, from, edition, message, scale, watermark}) draws a 1500x1000 (x scale) certificate. */
(function () {
  "use strict";
  var W = 1500, H = 1000;
  var FONT = "'Segoe UI', system-ui, sans-serif";
  var EDITIONS = {
    standard: "GRAND THEFT AUTO VI \u00b7 STANDARD EDITION",
    ultimate: "GRAND THEFT AUTO VI \u00b7 ULTIMATE EDITION",
    upgrade: "GTA VI \u00b7 ULTIMATE EDITION UPGRADE"
  };

  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  function clean(raw, max, fallback) {
    var s = String(raw || "").replace(/[^\p{L}\p{N} .,!?&'"()\-:;+]/gu, "").replace(/\s+/g, " ").trim();
    if (s.length > max) s = s.slice(0, max);
    return s || fallback;
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

  // Shrink the font until the text fits maxW.
  function fitText(ctx, text, weight, size, maxW, min) {
    var s = size;
    ctx.font = weight + " " + s + "px " + FONT;
    while (s > min && ctx.measureText(text).width > maxW) {
      s -= 2;
      ctx.font = weight + " " + s + "px " + FONT;
    }
    return s;
  }

  function wrap(ctx, text, maxW, maxLines) {
    var words = text.split(" "), lines = [], line = "";
    for (var i = 0; i < words.length; i++) {
      var test = line ? line + " " + words[i] : words[i];
      if (ctx.measureText(test).width > maxW && line) {
        lines.push(line);
        line = words[i];
        if (lines.length === maxLines) break;
      } else {
        line = test;
      }
    }
    if (lines.length < maxLines && line) lines.push(line);
    return lines.slice(0, maxLines);
  }

  function drawCert(canvas, opts) {
    var to = clean(opts.to, 24, "YOUR FAVOURITE PLAYER");
    var from = clean(opts.from, 24, "SOMEONE WHO KNOWS YOU");
    var message = clean(opts.message, 140, "");
    var edition = EDITIONS[opts.edition] || EDITIONS.standard;
    var scale = opts.scale || 1;
    canvas.width = Math.round(W * scale);
    canvas.height = Math.round(H * scale);
    var ctx = canvas.getContext("2d");
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.textBaseline = "alphabetic";
    var seed = hash(to + "|" + from);

    // dark margin, then the art clipped to the inner frame so skyline and palm stay inside it
    roundRect(ctx, 0, 0, W, H, 40);
    ctx.fillStyle = "#12072b";
    ctx.fill();
    roundRect(ctx, 34, 34, W - 68, H - 68, 22);
    ctx.save();
    ctx.clip();
    var bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#12072b");
    bg.addColorStop(0.5, "#3a0f5c");
    bg.addColorStop(0.8, "#8f1d63");
    bg.addColorStop(1, "#c8483f");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // striped sun, low on the right, behind the skyline
    var cx = 1220, cy = 760, r = 210;
    var sun = ctx.createLinearGradient(0, cy - r, 0, cy + r);
    sun.addColorStop(0, "#ffd36b");
    sun.addColorStop(0.6, "#ff9a3c");
    sun.addColorStop(1, "#ff3d81");
    ctx.fillStyle = sun;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#8f1d63";
    for (var i = 0; i < 6; i++) ctx.fillRect(cx - r, cy + 10 + i * 30, r * 2, 5 + i * 2);

    // skyline (right third only, so it never sits under text)
    ctx.fillStyle = "#12072b";
    var x = 1000, s = seed;
    while (x < W) {
      s = (Math.imul(s, 1103515245) + 12345) >>> 0;
      var bw = 34 + (s % 60);
      var bh = 60 + ((s >>> 8) % 170);
      if (x + bw > W - 54) bw = W - 54 - x;
      if (bw < 24) break;
      ctx.fillRect(x, H - 120 - bh, bw, bh + 120);
      x += bw + 4;
    }
    // palm
    ctx.strokeStyle = "#12072b"; ctx.lineCap = "round";
    var px = 1330, py = H - 110, ph = 300;
    ctx.lineWidth = 11;
    ctx.beginPath(); ctx.moveTo(px, py); ctx.quadraticCurveTo(px + 28, py - ph / 2, px + 8, py - ph); ctx.stroke();
    ctx.lineWidth = 8;
    for (var k = 0; k < 6; k++) {
      var ang = -Math.PI + k * (Math.PI / 5);
      ctx.beginPath(); ctx.moveTo(px + 8, py - ph);
      ctx.quadraticCurveTo(px + 8 + Math.cos(ang) * 55, py - ph - 38, px + 8 + Math.cos(ang) * 110, py - ph + 28 + Math.abs(Math.sin(ang)) * 10);
      ctx.stroke();
    }
    // ground band
    ctx.fillRect(0, H - 120, W, 120);
    ctx.restore();

    // frames
    ctx.lineWidth = 6;
    ctx.strokeStyle = "rgba(255,211,107,0.9)";
    roundRect(ctx, 18, 18, W - 36, H - 36, 30); ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(40,224,208,0.7)";
    roundRect(ctx, 34, 34, W - 68, H - 68, 22); ctx.stroke();

    // header
    ctx.fillStyle = "#28e0d0";
    ctx.font = "700 30px " + FONT;
    ctx.fillText("A GIFT FROM THE STATE OF LEONIDA", 80, 105);
    ctx.fillStyle = "#ffd36b";
    fitText(ctx, "GIFT CERTIFICATE", "900", 84, 900, 50);
    ctx.fillText("GIFT CERTIFICATE", 76, 190);

    // edition line
    ctx.fillStyle = "#fff7ef";
    fitText(ctx, edition, "700", 34, 900, 22);
    ctx.fillText(edition, 80, 245);

    // recipient
    ctx.fillStyle = "#e4d3ea";
    ctx.font = "600 26px " + FONT;
    ctx.fillText("THIS ONE IS FOR", 80, 330);
    var ig = ctx.createLinearGradient(80, 340, 900, 420);
    ig.addColorStop(0, "#ffd36b"); ig.addColorStop(1, "#ff3d81");
    ctx.fillStyle = ig;
    fitText(ctx, to.toUpperCase(), "900", 92, 900, 44);
    ctx.fillText(to.toUpperCase(), 76, 420);

    // from
    ctx.fillStyle = "#e4d3ea";
    ctx.font = "600 26px " + FONT;
    ctx.fillText("FROM", 80, 490);
    ctx.fillStyle = "#fff7ef";
    fitText(ctx, from, "800", 48, 860, 28);
    ctx.fillText(from, 80, 545);

    // message
    if (message) {
      ctx.fillStyle = "#fff7ef";
      ctx.font = "italic 500 34px " + FONT;
      var lines = wrap(ctx, "\u201c" + message + "\u201d", 860, 3);
      for (var m = 0; m < lines.length; m++) ctx.fillText(lines[m], 80, 620 + m * 46);
    }

    // stamp
    ctx.save();
    ctx.translate(1120, 250);
    ctx.rotate(-0.1);
    ctx.strokeStyle = "#ff3d81"; ctx.lineWidth = 7;
    roundRect(ctx, -230, -70, 460, 140, 18); ctx.stroke();
    ctx.fillStyle = "#ff3d81";
    ctx.textAlign = "center";
    ctx.font = "900 40px " + FONT;
    ctx.fillText("VALID IN LEONIDA", 0, -8, 420);
    ctx.font = "800 30px " + FONT;
    ctx.fillText("FROM 19.11.26", 0, 38, 420);
    ctx.restore();
    ctx.textAlign = "left";

    // footer, on the ground band
    ctx.fillStyle = "#e4d3ea";
    ctx.font = "500 22px " + FONT;
    ctx.fillText("Unofficial fan item. Not affiliated with Rockstar Games. Not a game code.", 80, H - 52);

    if (opts.watermark) {
      ctx.save();
      ctx.globalAlpha = 0.36;
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 120px " + FONT;
      ctx.textAlign = "center";
      for (var wy = 0; wy < 3; wy++) {
        ctx.save();
        ctx.translate(W / 2, 240 + wy * 300);
        ctx.rotate(-0.22);
        ctx.fillText("PREVIEW  PREVIEW", 0, 0);
        ctx.restore();
      }
      ctx.restore();
    }
    return { to: to, from: from };
  }

  window.LeonidaGift = { drawCert: drawCert, clean: clean };
})();
