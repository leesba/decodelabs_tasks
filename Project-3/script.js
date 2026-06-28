/* DecodeLabs Project 3 — The Memory Vault */

const API = 'api/';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let deleteTargetId   = null;
let deleteTargetName = null;

// ===== INIT =====
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav
const navToggle = document.querySelector('.nav-toggle');
const navMenu   = document.querySelector('.nav-menu');

navToggle?.addEventListener('click', () => {
  const open = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!open));
  navMenu.classList.toggle('is-open', !open);
});

navMenu?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

// Close modals on overlay click
document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});

document.getElementById('delete-overlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeDeleteModal();
});

// ===== LOAD INTERNS (READ) =====
async function loadInterns() {
  const tbody = document.getElementById('table-body');
  tbody.innerHTML = '<tr><td colspan="7" class="tbl-loading">Loading records...</td></tr>';

  try {
    const res   = await fetch(API + 'read.php');
    const data  = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="tbl-loading">No records found. Add your first intern!</td></tr>';
      updateStats([]);
      return;
    }

    updateStats(data);
    renderTable(data);
  } catch {
    tbody.innerHTML = '<tr><td colspan="7" class="tbl-loading" style="color:#DC2626">Could not connect to database. Make sure XAMPP Apache + MySQL are running.</td></tr>';
  }
}

function renderTable(interns) {
  const tbody = document.getElementById('table-body');
  tbody.innerHTML = interns.map(intern => `
    <tr>
      <td><span style="color:#9CA3AF;font-family:'Roboto Mono',monospace;font-size:0.8rem">${intern.id}</span></td>
      <td><strong>${escHtml(intern.name)}</strong></td>
      <td style="color:#6B7280;font-size:0.85rem">${escHtml(intern.email)}</td>
      <td>${escHtml(intern.domain)}</td>
      <td style="font-family:'Roboto Mono',monospace;font-size:0.82rem">${escHtml(intern.batch)}</td>
      <td>
        <span class="status-badge status-${intern.status}">
          ${intern.status === 'active' ? '●' : '○'} ${intern.status}
        </span>
      </td>
      <td>
        <div class="tbl-actions">
          <button class="btn-edit" onclick="openEditModal(${intern.id},'${escAttr(intern.name)}','${escAttr(intern.email)}','${escAttr(intern.domain)}','${escAttr(intern.batch)}','${intern.status}')">Edit</button>
          <button class="btn-del"  onclick="openDeleteModal(${intern.id},'${escAttr(intern.name)}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function updateStats(interns) {
  const active   = interns.filter(i => i.status === 'active').length;
  const inactive = interns.length - active;
  document.getElementById('stat-total').textContent    = interns.length;
  document.getElementById('stat-active').textContent   = active;
  document.getElementById('stat-inactive').textContent = inactive;
}

// ===== ADD MODAL =====
function openAddModal() {
  document.getElementById('modal-title').textContent    = 'Add Intern';
  document.getElementById('submit-btn').textContent     = 'Add Intern';
  document.getElementById('form-id').value              = '';
  document.getElementById('form-name').value            = '';
  document.getElementById('form-email').value           = '';
  document.getElementById('form-domain').value          = '';
  document.getElementById('form-batch').value           = '2026';
  document.querySelector('input[name="status"][value="active"]').checked = true;
  clearFormErrors();
  document.getElementById('modal-overlay').classList.add('is-open');
  document.getElementById('form-name').focus();
}

// ===== EDIT MODAL =====
function openEditModal(id, name, email, domain, batch, status) {
  document.getElementById('modal-title').textContent    = 'Edit Intern';
  document.getElementById('submit-btn').textContent     = 'Save Changes';
  document.getElementById('form-id').value              = id;
  document.getElementById('form-name').value            = name;
  document.getElementById('form-email').value           = email;
  document.getElementById('form-domain').value          = domain;
  document.getElementById('form-batch').value           = batch;
  document.querySelector(`input[name="status"][value="${status}"]`).checked = true;
  clearFormErrors();
  document.getElementById('modal-overlay').classList.add('is-open');
  document.getElementById('form-name').focus();
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('is-open');
}

// ===== FORM SUBMIT (CREATE / UPDATE) =====
document.getElementById('intern-form').addEventListener('submit', async e => {
  e.preventDefault();
  clearFormErrors();

  const id     = document.getElementById('form-id').value;
  const name   = document.getElementById('form-name').value.trim();
  const email  = document.getElementById('form-email').value.trim();
  const domain = document.getElementById('form-domain').value.trim();
  const batch  = document.getElementById('form-batch').value;
  const status = document.querySelector('input[name="status"]:checked').value;

  let valid = true;

  if (!name) {
    document.getElementById('err-name').textContent = '✗ Name is required';
    document.getElementById('form-name').classList.add('input-error');
    valid = false;
  }

  if (!email) {
    document.getElementById('err-email').textContent = '✗ Email is required';
    document.getElementById('form-email').classList.add('input-error');
    valid = false;
  } else if (!EMAIL_RE.test(email)) {
    document.getElementById('err-email').textContent = '✗ Invalid email format';
    document.getElementById('form-email').classList.add('input-error');
    valid = false;
  }

  if (!domain) {
    document.getElementById('err-domain').textContent = '✗ Domain is required';
    document.getElementById('form-domain').classList.add('input-error');
    valid = false;
  }

  if (!valid) return;

  const submitBtn = document.getElementById('submit-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';

  const payload  = { name, email, domain, batch, status };
  const isEdit   = !!id;
  if (isEdit) payload.id = id;

  const endpoint = isEdit ? 'update.php' : 'create.php';
  const method   = isEdit ? 'PUT' : 'POST';

  try {
    const res  = await fetch(API + endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (!res.ok) {
      showApiMsg(data.error || 'Something went wrong', false);
    } else {
      closeModal();
      loadInterns();
    }
  } catch {
    showApiMsg('Network error. Check XAMPP is running.', false);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = isEdit ? 'Save Changes' : 'Add Intern';
  }
});

// ===== DELETE MODAL =====
function openDeleteModal(id, name) {
  deleteTargetId   = id;
  deleteTargetName = name;
  document.getElementById('delete-name-display').textContent = name;
  document.getElementById('delete-overlay').classList.add('is-open');
}

function closeDeleteModal() {
  document.getElementById('delete-overlay').classList.remove('is-open');
  deleteTargetId   = null;
  deleteTargetName = null;
}

async function confirmDelete() {
  if (!deleteTargetId) return;

  try {
    const res  = await fetch(API + 'delete.php', {
      method:  'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ id: deleteTargetId })
    });
    const data = await res.json();

    if (res.ok) {
      closeDeleteModal();
      loadInterns();
    } else {
      closeDeleteModal();
      alert(data.error || 'Delete failed');
    }
  } catch {
    closeDeleteModal();
    alert('Network error');
  }
}

// ===== CONTACT FORM =====
document.querySelector('.contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;

  e.currentTarget.querySelectorAll('[required]').forEach(field => {
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
    const success = e.currentTarget.querySelector('.form-success');
    if (success) success.textContent = '✓ Message sent. Build with integrity.';
    e.currentTarget.reset();
    setTimeout(() => { if (success) success.textContent = ''; }, 4000);
  }
});

// ===== HELPERS =====
function clearFormErrors() {
  ['err-name','err-email','err-domain'].forEach(id => {
    document.getElementById(id).textContent = '';
  });
  ['form-name','form-email','form-domain'].forEach(id => {
    document.getElementById(id).classList.remove('input-error');
  });
  showApiMsg('', true);
}

function showApiMsg(msg, isOk) {
  const el = document.getElementById('form-api-msg');
  el.textContent = msg;
  el.className   = 'form-api-msg' + (isOk ? ' is-ok' : '');
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escAttr(str) {
  if (!str) return '';
  return String(str).replace(/'/g, "\\'");
}

// ===== START =====
loadInterns();
