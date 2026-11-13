/* Jeff's Junk version 2: the only script. Menu, the price slider, and which board row starts open. */
(function () {
  var each = function (l, f) { Array.prototype.forEach.call(l, f); };
  var hd = document.querySelector('.hd'), mb = document.querySelector('.menu-b');
  if (mb) mb.addEventListener('click', function () { var o = hd.classList.toggle('open'); mb.setAttribute('aria-expanded', o); mb.textContent = o ? 'Close' : 'Menu'; });

  // desktop has room to start with the most booked row open; phones start closed so every price fits the first screen
  if (window.matchMedia('(min-width:900px)').matches) each(document.querySelectorAll('.board details[data-first]'), function (d) { d.open = true; });

  // the price slider (skin 2). Prices and words come from the page itself, so the HTML stays the one place they live.
  each(document.querySelectorAll('[data-calc]'), function (c) {
    var q = function (s) { return c.querySelector(s); }, J = JSON.parse(q('[data-junk]').textContent), B = JSON.parse(q('[data-bins]').textContent);
    var mode = 'j', bi = 1, segs = c.querySelectorAll('.seg button'), sizes = c.querySelectorAll('.sizes button'), range = q('input[type=range]');
    function draw() {
      var j = mode === 'j', i = +range.value, r = j ? J[i] : B[bi];
      q('.big').textContent = r.p; q('.sayline').textContent = r.say; q('.from').hidden = !(j && i === 0);
      q('.polar').hidden = !j; if (j) { q('.pile').src = r.img; q('.cap2').textContent = r.cap; }
      q('.cta').textContent = j ? 'Text a photo to confirm' : 'Book this bin';
    }
    each(segs, function (b) { b.addEventListener('click', function () { mode = b.dataset.m; each(segs, function (x) { x.setAttribute('aria-pressed', x === b); }); q('.pj').hidden = mode !== 'j'; q('.pb').hidden = mode !== 'b'; draw(); }); });
    range.addEventListener('input', draw);
    each(sizes, function (b) { b.addEventListener('click', function () { bi = +b.dataset.i; each(sizes, function (x) { x.setAttribute('aria-pressed', x === b); }); draw(); }); });
    draw();
  });
})();
