// ===== Načtení a vykreslení skutečných článků z Firestore na blog.html =====

const grid = document.getElementById('dynamic-posts-grid');
const loadingMsg = document.getElementById('dynamic-posts-loading');

if (grid) {
  db.collection('posts').orderBy('createdAt', 'desc').get().then(snap => {
    if (loadingMsg) loadingMsg.remove();
    if (snap.empty) {
      grid.remove();
      return;
    }
    snap.forEach((doc, i) => {
      const d = doc.data();
      const a = document.createElement('a');
      a.href = `clanek.html?id=${doc.id}`;
      a.className = 'card reveal';
      if (i > 0) a.style.setProperty('--d', `${i * 100}ms`);
      a.innerHTML = `
        <span class="post-meta">${d.category || ''} · ${d.readTime || ''}</span>
        <h3 class="post-title">${d.title || ''}</h3>
        <p class="card-text">${d.excerpt || ''}</p>
        <span class="post-more">Číst více →</span>
      `;
      grid.appendChild(a);
    });
  }).catch(() => {
    if (loadingMsg) loadingMsg.remove();
    grid.remove();
  });
}
