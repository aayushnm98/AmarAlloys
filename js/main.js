/* Heritage Alloys - small behaviours. No libraries needed. */

/* ---------- Mobile menu ---------- */
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;
  function set(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  toggle.addEventListener('click', function () { set(!nav.classList.contains('open')); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) { set(false); toggle.focus(); }
  });
})();

/* ---------- Brushed-metal highlight: one sweep on load, then follows the pointer ---------- */
(function () {
  var mast = document.querySelector('.masthead');
  if (!mast) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function place(x, y) {
    mast.style.setProperty('--mx', x + '%');
    mast.style.setProperty('--my', y + '%');
  }
  if (reduce) { place(32, 28); return; }

  var following = false;
  var start = performance.now();
  var duration = 2600;
  function sweep(now) {
    if (following) return;
    var p = Math.min((now - start) / duration, 1);
    var eased = 1 - Math.pow(1 - p, 3);
    place(-10 + eased * 42, 20 + Math.sin(p * Math.PI) * 14);
    if (p < 1) requestAnimationFrame(sweep);
  }
  requestAnimationFrame(sweep);

  mast.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    following = true;
    var r = mast.getBoundingClientRect();
    place(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
  });
})();

/* ---------- "Open now" status, worked out from the hours on the page ---------- */
(function () {
  var els = document.querySelectorAll('[data-open-status]');
  if (!els.length || !window.Intl) return;
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function minutes(t) { var p = t.split(':'); return +p[0] * 60 + +p[1]; }
  function label(mins) {
    var h = Math.floor(mins / 60), m = mins % 60, ap = h >= 12 ? 'pm' : 'am';
    h = h % 12 || 12;
    return h + ':' + (m < 10 ? '0' : '') + m + ' ' + ap;
  }

  els.forEach(function (el) {
    var tz = el.getAttribute('data-tz') || 'Asia/Kolkata';
    var open = minutes(el.getAttribute('data-open'));
    var close = minutes(el.getAttribute('data-close'));
    var openDays = el.getAttribute('data-days').split(',').map(Number);
    var parts;
    try {
      parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    } catch (e) { return; }
    var map = {};
    parts.forEach(function (p) { map[p.type] = p.value; });
    var today = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(map.weekday);
    var now = +map.hour * 60 + +map.minute;
    var isOpen = openDays.indexOf(today) !== -1 && now >= open && now < close;

    var text;
    if (isOpen) {
      text = 'Open now, until ' + label(close);
    } else {
      var next = -1, add = 0;
      for (var i = 0; i < 7; i++) {
        var d = (today + i) % 7;
        if (openDays.indexOf(d) === -1) continue;
        if (i === 0 && now >= open) continue;
        next = d; add = i; break;
      }
      var when = add === 0 ? 'today' : add === 1 ? 'tomorrow' : days[next];
      text = 'Closed, opens ' + when + ' ' + label(open);
    }
    el.textContent = text;
    el.setAttribute('data-state', isOpen ? 'open' : 'closed');
    el.hidden = false;
  });
})();

/* ---------- Catalogue: highlight the family being read ---------- */
(function () {
  var links = document.querySelectorAll('.catalog-nav a');
  if (!links.length || !('IntersectionObserver' in window)) return;
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      links.forEach(function (a) { a.removeAttribute('aria-current'); });
      var a = byId[en.target.id];
      if (a) a.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  document.querySelectorAll('.family').forEach(function (s) { io.observe(s); });
})();

/* ---------- Gallery lightbox with previous / next ---------- */
(function () {
  var dlg = document.getElementById('lightbox');
  var tiles = Array.prototype.slice.call(document.querySelectorAll('[data-full]'));
  if (!dlg || !dlg.showModal || !tiles.length) return;
  var img = dlg.querySelector('img');
  var cap = dlg.querySelector('[data-caption-out]');
  var index = 0;

  function show(i) {
    index = (i + tiles.length) % tiles.length;
    var t = tiles[index];
    img.src = t.getAttribute('data-full');
    img.alt = t.getAttribute('data-alt') || '';
    cap.textContent = t.getAttribute('data-caption') || '';
  }
  tiles.forEach(function (t, i) {
    t.addEventListener('click', function () { show(i); dlg.showModal(); });
  });
  dlg.querySelector('[data-prev]').addEventListener('click', function () { show(index - 1); });
  dlg.querySelector('[data-next]').addEventListener('click', function () { show(index + 1); });
  dlg.querySelector('[data-close]').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
})();

/* ---------- Enquiry form: checks on leaving a field, clear errors, instant feedback ---------- */
(function () {
  var form = document.getElementById('enquiry');
  if (!form) return;
  var status = form.querySelector('.form-status');
  var button = form.querySelector('button[type="submit"]');
  var name = form.elements.name, phone = form.elements.phone, email = form.elements.email, message = form.elements.message;

  function errorFor(field) { return form.querySelector('[data-error-for="' + field.id + '"]'); }
  function setError(field, text) {
    var box = errorFor(field);
    if (!box) return;
    var span = box.querySelector('span');
    if (text) {
      span.textContent = text;
      box.hidden = false;
      field.setAttribute('aria-invalid', 'true');
    } else {
      box.hidden = true;
      field.removeAttribute('aria-invalid');
    }
  }
  function check(field) {
    var v = field.value.trim();
    if (field === name) setError(name, v ? '' : 'Please tell us your name.');
    if (field === message) setError(message, v ? '' : 'Please tell us what you need.');
    if (field === phone || field === email) {
      var hasContact = phone.value.trim() || email.value.trim();
      setError(phone, hasContact ? '' : 'Please add a phone number or an email address so we can reply.');
      if (email.value.trim() && !/^\S+@\S+\.\S+$/.test(email.value.trim())) {
        setError(email, 'This email address looks incomplete. Please check it, or leave it empty and give a phone number.');
      } else { setError(email, ''); }
    }
  }
  [name, phone, email, message].forEach(function (f) {
    f.addEventListener('blur', function () { if (f.value.trim() || f.hasAttribute('aria-invalid')) check(f); });
    f.addEventListener('input', function () { if (f.hasAttribute('aria-invalid')) check(f); });
  });

  function valid() {
    check(name); check(message); check(phone);
    return !form.querySelector('[aria-invalid="true"]');
  }
  function showSent() {
    var box = document.getElementById('sent');
    form.hidden = true;
    box.hidden = false;
    box.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.className = 'form-status';
    if (!valid()) {
      form.querySelector('[aria-invalid="true"]').focus();
      return;
    }
    if (form.action.indexOf('YOUR_FORM_ID') !== -1) {
      status.className = 'form-status is-error';
      status.textContent = 'This form is not connected yet. Please call us or send a WhatsApp message.';
      return;
    }
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    status.textContent = 'Sending...';
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (res) {
        if (!res.ok) throw new Error('failed');
        form.reset();
        status.textContent = '';
        showSent();
      })
      .catch(function () {
        status.className = 'form-status is-error';
        status.textContent = 'Your message could not be sent. Please try again, or call us or send a WhatsApp message.';
      })
      .then(function () { button.disabled = false; button.removeAttribute('aria-busy'); });
  });
})();

/* ---------- Footer year ---------- */
document.querySelectorAll('[data-year]').forEach(function (el) {
  el.textContent = new Date().getFullYear();
});
