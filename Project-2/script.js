/* DecodeLabs Project 2 — The Nervous System */

// Dynamic copyright year
document.getElementById('year').textContent = new Date().getFullYear();

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.querySelector('.nav-toggle');
const navMenu   = document.querySelector('.nav-menu');

navToggle?.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  navMenu.classList.toggle('is-open', !isOpen);
});

navMenu?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

// ===== LIVE GET DEMO =====
const btnGet    = document.getElementById('btn-get');
const getOutput = document.getElementById('get-output');

btnGet?.addEventListener('click', async () => {
  getOutput.innerHTML = '<p class="out-loading">Sending request...</p>';
  btnGet.disabled = true;

  try {
    const t0  = Date.now();
    const res = await fetch('https://jsonplaceholder.typicode.com/users?_limit=3');
    const ms  = Date.now() - t0;
    const users = await res.json();

    let html = '';
    html += `<p><span class="out-dim">REQUEST  </span> <span class="out-method-get">GET</span> /users?_limit=3</p>`;
    html += `<p><span class="out-dim">STATUS   </span> <span class="out-ok">${res.status} ${res.statusText}</span>  ·  ${ms}ms</p>`;
    html += `<p><span class="out-dim">——————————————————————————————</span></p>`;

    users.forEach(user => {
      html += `<p>{</p>`;
      html += `<p>&nbsp;&nbsp;<span class="out-key">"id"</span>: <span class="out-num">${user.id}</span>,</p>`;
      html += `<p>&nbsp;&nbsp;<span class="out-key">"name"</span>: <span class="out-str">"${user.name}"</span>,</p>`;
      html += `<p>&nbsp;&nbsp;<span class="out-key">"email"</span>: <span class="out-str">"${user.email}"</span></p>`;
      html += `<p>}</p>`;
    });

    getOutput.innerHTML = html;
  } catch {
    getOutput.innerHTML = '<p class="out-err">→ Network error. Check your connection.</p>';
  } finally {
    btnGet.disabled = false;
  }
});

// ===== LIVE POST DEMO =====
const postForm   = document.getElementById('post-form');
const postOutput = document.getElementById('post-output');
const nameInput  = document.getElementById('demo-name');
const emailInput = document.getElementById('demo-email');
const errName    = document.getElementById('error-name');
const errEmail   = document.getElementById('error-email');
const EMAIL_RE   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validatePostForm() {
  let valid = true;

  if (!nameInput.value.trim()) {
    errName.textContent = '✗ Name is required';
    nameInput.classList.add('input-invalid');
    valid = false;
  } else {
    errName.textContent = '';
    nameInput.classList.remove('input-invalid');
  }

  if (!emailInput.value.trim()) {
    errEmail.textContent = '✗ Email is required';
    emailInput.classList.add('input-invalid');
    valid = false;
  } else if (!EMAIL_RE.test(emailInput.value)) {
    errEmail.textContent = '✗ Invalid email format';
    emailInput.classList.add('input-invalid');
    valid = false;
  } else {
    errEmail.textContent = '';
    emailInput.classList.remove('input-invalid');
  }

  return valid;
}

postForm?.addEventListener('submit', async e => {
  e.preventDefault();
  if (!validatePostForm()) return;

  const payload = {
    name:  nameInput.value.trim(),
    email: emailInput.value.trim(),
    batch: '2026',
    role:  'intern'
  };

  postOutput.innerHTML = '<p class="out-loading">Sending request...</p>';

  try {
    const t0  = Date.now();
    const res = await fetch('https://jsonplaceholder.typicode.com/users', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    });
    const ms   = Date.now() - t0;
    const data = await res.json();

    let html = '';
    html += `<p><span class="out-dim">REQUEST  </span> <span class="out-method-post">POST</span> /users</p>`;
    html += `<p><span class="out-dim">PAYLOAD  </span> { name, email, batch, role }</p>`;
    html += `<p><span class="out-dim">STATUS   </span> <span class="out-created">201 Created</span>  ·  ${ms}ms</p>`;
    html += `<p><span class="out-dim">——————————————————————————————</span></p>`;
    html += `<p>{</p>`;

    Object.entries(data).forEach(([k, v]) => {
      const valHtml = typeof v === 'string'
        ? `<span class="out-str">"${v}"</span>`
        : `<span class="out-num">${v}</span>`;
      html += `<p>&nbsp;&nbsp;<span class="out-key">"${k}"</span>: ${valHtml}</p>`;
    });

    html += `<p>}</p>`;
    postOutput.innerHTML = html;
  } catch {
    postOutput.innerHTML = '<p class="out-err">→ Network error. Check your connection.</p>';
  }
});

// ===== CONTACT FORM VALIDATION =====
const contactForm = document.querySelector('.contact-form');

contactForm?.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;

  contactForm.querySelectorAll('[required]').forEach(field => {
    const err = field.parentElement.querySelector('.form-error');

    if (!field.value.trim()) {
      if (err) err.textContent = 'This field is required.';
      field.classList.add('input-error');
      valid = false;
    } else if (field.type === 'email' && !EMAIL_RE.test(field.value)) {
      if (err) err.textContent = 'Please enter a valid email.';
      field.classList.add('input-error');
      valid = false;
    } else {
      if (err) err.textContent = '';
      field.classList.remove('input-error');
    }
  });

  if (valid) {
    const success = contactForm.querySelector('.form-success');
    if (success) success.textContent = '✓ Message sent. Build with integrity.';
    contactForm.reset();
    setTimeout(() => { if (success) success.textContent = ''; }, 4000);
  }
});
