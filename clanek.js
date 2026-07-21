// ===== Zobrazení jednotlivého článku podle ?id= v URL =====

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderContent(text) {
  return text
    .split(/\n\s*\n/)
    .map(p => `<p style="margin-bottom:1.25rem;">${escapeHtml(p.trim()).replace(/\n/g, '<br>')}</p>`)
    .join('');
}

const params = new URLSearchParams(location.search);
const postId = params.get('id');

const loadingEl = document.getElementById('article-loading');
const contentEl = document.getElementById('article-content');
const notfoundEl = document.getElementById('article-notfound');

function showNotFound() {
  loadingEl.hidden = true;
  contentEl.hidden = true;
  notfoundEl.hidden = false;
}

if (!postId) {
  showNotFound();
} else {
  db.collection('posts').doc(postId).get().then(doc => {
    if (!doc.exists) { showNotFound(); return; }
    const d = doc.data();
    document.getElementById('page-title').textContent = (d.title || 'Článek') + ' — Ilona Musatova';
    document.getElementById('article-meta').textContent = `${d.category || ''} · ${d.readTime || ''}`;
    document.getElementById('article-title').textContent = d.title || '';
    document.getElementById('article-body').innerHTML = renderContent(d.content || '');
    loadingEl.hidden = true;
    contentEl.hidden = false;
  }).catch(() => showNotFound());
}
