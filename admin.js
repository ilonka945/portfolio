// ===== Admin: přihlášení + správa článků blogu (Firebase Auth + Firestore) =====

const loginSection = document.getElementById('login-section');
const editorSection = document.getElementById('editor-section');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

const postForm = document.getElementById('post-form');
const postIdField = document.getElementById('post-id');
const postTitle = document.getElementById('post-title');
const postCategory = document.getElementById('post-category');
const postReadtime = document.getElementById('post-readtime');
const postExcerpt = document.getElementById('post-excerpt');
const postContent = document.getElementById('post-content');
const postStatus = document.getElementById('post-status');
const postSubmitBtn = document.getElementById('post-submit-btn');
const postCancelBtn = document.getElementById('post-cancel-btn');
const adminPostList = document.getElementById('admin-post-list');

function showStatus(msg, isError) {
  postStatus.textContent = msg;
  postStatus.style.color = isError ? '#e5484d' : '#2a9d5c';
  postStatus.style.display = 'block';
  setTimeout(() => { postStatus.style.display = 'none'; }, 3000);
}

function resetForm() {
  postForm.reset();
  postIdField.value = '';
  postReadtime.value = '5 MIN';
  postSubmitBtn.textContent = 'Publikovat';
  postCancelBtn.hidden = true;
}

postCancelBtn.addEventListener('click', resetForm);

// ===== Přihlášení =====
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  loginError.style.display = 'none';
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  auth.signInWithEmailAndPassword(email, password).catch(err => {
    loginError.textContent = 'Přihlášení se nezdařilo: ' + (err.message || err.code);
    loginError.style.display = 'block';
  });
});

logoutBtn.addEventListener('click', () => auth.signOut());

auth.onAuthStateChanged(user => {
  if (user) {
    loginSection.hidden = true;
    editorSection.hidden = false;
    loadAdminPosts();
  } else {
    loginSection.hidden = false;
    editorSection.hidden = true;
  }
});

// ===== Publikování / úprava článku =====
postForm.addEventListener('submit', e => {
  e.preventDefault();
  const data = {
    title: postTitle.value.trim(),
    category: postCategory.value,
    readTime: postReadtime.value.trim() || '5 MIN',
    excerpt: postExcerpt.value.trim(),
    content: postContent.value.trim(),
  };
  const editingId = postIdField.value;

  postSubmitBtn.disabled = true;

  if (editingId) {
    db.collection('posts').doc(editingId).update(data)
      .then(() => {
        showStatus('Článek upraven.', false);
        resetForm();
        loadAdminPosts();
      })
      .catch(err => showStatus('Chyba: ' + err.message, true))
      .finally(() => { postSubmitBtn.disabled = false; });
  } else {
    data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    db.collection('posts').add(data)
      .then(() => {
        showStatus('Článek publikován.', false);
        resetForm();
        loadAdminPosts();
      })
      .catch(err => showStatus('Chyba: ' + err.message, true))
      .finally(() => { postSubmitBtn.disabled = false; });
  }
});

function editPost(id, data) {
  postIdField.value = id;
  postTitle.value = data.title || '';
  postCategory.value = data.category || 'WEB';
  postReadtime.value = data.readTime || '5 MIN';
  postExcerpt.value = data.excerpt || '';
  postContent.value = data.content || '';
  postSubmitBtn.textContent = 'Uložit úpravu';
  postCancelBtn.hidden = false;
  postForm.scrollIntoView({ behavior: 'smooth' });
}

function deletePost(id) {
  if (!confirm('Opravdu smazat tento článek?')) return;
  db.collection('posts').doc(id).delete().then(loadAdminPosts);
}

function loadAdminPosts() {
  adminPostList.innerHTML = '<p class="card-text">Načítám…</p>';
  db.collection('posts').orderBy('createdAt', 'desc').get().then(snap => {
    if (snap.empty) {
      adminPostList.innerHTML = '<p class="card-text">Zatím žádné články.</p>';
      return;
    }
    adminPostList.innerHTML = '';
    snap.forEach(doc => {
      const d = doc.data();
      const row = document.createElement('div');
      row.className = 'card card--tight';
      row.style.marginBottom = '1rem';
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.justifyContent = 'space-between';
      row.style.flexWrap = 'wrap';
      row.style.gap = '1rem';
      row.innerHTML = `
        <div>
          <span class="post-meta">${d.category || ''} · ${d.readTime || ''}</span>
          <h3 class="post-title" style="margin-top:.4rem;">${d.title || '(bez názvu)'}</h3>
        </div>
        <div style="display:flex; gap:.5rem;">
          <button type="button" class="btn-pill btn-pill--sm ghost" data-action="edit">Upravit</button>
          <button type="button" class="btn-pill btn-pill--sm ghost" data-action="delete">Smazat</button>
        </div>
      `;
      row.querySelector('[data-action="edit"]').addEventListener('click', () => editPost(doc.id, d));
      row.querySelector('[data-action="delete"]').addEventListener('click', () => deletePost(doc.id));
      adminPostList.appendChild(row);
    });
  });
}
