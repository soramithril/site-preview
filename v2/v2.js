/* Jeff's Junk version 2: the only script. Menu, the price slider, and which board row starts open. */
(function () {
  var each = function (l, f) { Array.prototype.forEach.call(l, f); };
  // the header is the current mockup's, so its menu works the same way: line under it once you scroll, phone menu, dropdowns
  var head = document.querySelector('.site-head'), mBtn = document.querySelector('.menu-btn'), mNav = document.getElementById('mnav');
  if (head) {
    var onScroll = function () { head.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    mBtn.addEventListener('click', function () { var o = mNav.classList.toggle('open'); mBtn.setAttribute('aria-expanded', o); mBtn.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); });
    mNav.addEventListener('click', function (e) { if (e.target.closest('a')) { mNav.classList.remove('open'); mBtn.setAttribute('aria-expanded', 'false'); } });
    each(mNav.querySelectorAll('.m-more'), function (b) { b.addEventListener('click', function () { b.setAttribute('aria-expanded', b.closest('.mrow').classList.toggle('open')); }); });
    var dds = head.querySelectorAll('.nav .dd'), shut = function (keep) { each(dds, function (d) { if (d !== keep) { d.classList.remove('open'); d.querySelector('.dd-btn').setAttribute('aria-expanded', 'false'); } }); };
    each(dds, function (d) {
      var b = d.querySelector('.dd-btn');
      b.addEventListener('click', function (e) { e.stopPropagation(); shut(d); d.classList.remove('shut'); b.setAttribute('aria-expanded', d.classList.toggle('open')); });
      d.querySelector('.dd-panel').addEventListener('click', function (e) { if (!e.target.closest('a')) return; d.classList.remove('open'); d.classList.add('shut'); b.setAttribute('aria-expanded', 'false'); });
      d.addEventListener('mouseleave', function () { d.classList.remove('shut'); });
    });
    document.addEventListener('click', function () { shut(null); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') shut(null); });
  }

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
      q('.cta').textContent = j ? 'Text a photo to confirm' : 'Book this bin'; q('.cta').href = j ? c.dataset.text : c.dataset.book;
    }
    each(segs, function (b) { b.addEventListener('click', function () { mode = b.dataset.m; each(segs, function (x) { x.setAttribute('aria-pressed', x === b); }); q('.pj').hidden = mode !== 'j'; q('.pb').hidden = mode !== 'b'; draw(); }); });
    range.addEventListener('input', draw);
    each(sizes, function (b) { b.addEventListener('click', function () { bi = +b.dataset.i; each(sizes, function (x) { x.setAttribute('aria-pressed', x === b); }); draw(); }); });
    draw();
  });

  // "Can you take my ...?": answers from the two lists on the page
  each(document.querySelectorAll('[data-take]'), function (box) {
    var sec = box.parentElement, out = box.querySelector('.take-a'), inp = box.querySelector('input');
    var list = function (sel) { var a = []; each(sec.querySelectorAll(sel + ' .chip'), function (c) { a.push(c.textContent.trim().toLowerCase()); }); return a; };
    var yes = list('[data-yes]'), no = list('[data-no]');
    var hit = function (a, v) { for (var i = 0; i < a.length; i++) { var w = a[i].replace(/s$/, ''); if (v.indexOf(w) > -1 || (v.length > 2 && a[i].indexOf(v) > -1)) return a[i]; } };
    inp.addEventListener('input', function () {
      var v = inp.value.trim().toLowerCase().replace(/s$/, ''), n, y; out.className = 'take-a';
      if (v.length < 3) { out.textContent = 'Type an item, like "fridge" or "swing set".'; return; }
      if ((n = hit(no, v))) { out.textContent = "Sorry, we can't take " + n + '.'; out.classList.add('n'); }
      else if ((y = hit(yes, v))) { out.textContent = 'Yes, we take ' + y + '.'; out.classList.add('y'); }
      else out.textContent = 'Not on our lists. Call or text and we will tell you.';
    });
  });

  // the mockup's forms send nothing
  each(document.querySelectorAll('form[data-mock]'), function (f) { f.addEventListener('submit', function (e) { e.preventDefault(); f.querySelector('.sent').hidden = false; }); });
})();
