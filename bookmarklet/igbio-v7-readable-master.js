(async () => {
  const UA = 'Instagram 448.0.0.52.84 Android (35/15; 280dpi; 720x1600; google; Pixel 10; frankel; zuma; en_US; 385412061)';
  const uidC = document.cookie.match(/ds_user_id=(\d+)/)?.[1];
  const csrfC = document.cookie.match(/csrftoken=([^;]+)/)?.[1];
  let CS = csrfC, UID = uidC, ME = null, FD = null;
  if (!CS) { const m = document.documentElement.outerHTML.match(/"csrf_token":"([^"]+)"/); CS = m && m[1]; }
  document.querySelectorAll('#igtools-host').forEach((e) => e.remove());
  const host = document.createElement('div'), R = host.attachShadow({ mode: 'closed' });
  host.id = 'igtools-host';
  R.innerHTML = `<style>*{box-sizing:border-box;margin:0;padding:0;font-family:system-ui,sans-serif}.a{position:fixed;top:12px;right:12px;width:336px;background:#18191c;color:#eee;border:1px solid #333;border-radius:14px;box-shadow:0 10px 30px #0009;overflow:hidden;z-index:2147483647;font-size:13px}.b{display:flex;align-items:center;gap:8px;padding:10px 12px;background:linear-gradient(45deg,#405de6,#833ab4,#c13584,#fd1d1d);font-weight:700}.c{flex:1}.d{cursor:pointer;background:#fff3;border:0;color:#fff;width:20px;height:20px;border-radius:50%}.tb{display:flex;background:#18191c;border-bottom:1px solid #2e3033}.tb button{flex:1;background:none;border:0;border-bottom:2px solid transparent;color:#999;padding:8px 0;font-size:10.5px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px}.tb button.on{color:#fff;border-image:linear-gradient(90deg,#833ab4,#fd1d1d) 1}.e{padding:10px 12px;display:flex;flex-direction:column;gap:8px;max-height:58vh;overflow:auto}.pn{display:none;flex-direction:column;gap:8px}.pn.on{display:flex}.f{font-size:11px;color:#999;min-height:14px}.f.x{color:#f66}.f.g{color:#7e5}.h{display:flex;align-items:center;gap:6px;background:#222326;border:1px solid #333;border-radius:8px;padding:7px 9px}.h div{flex:1;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.h b{display:block;font-size:12px}.h i{font-size:10px;color:#999;font-style:normal}.k{background:none;border:0;color:#f66;cursor:pointer;padding:2px 5px}.i{width:100%;background:#222326;border:1px solid #333;color:#eee;border-radius:8px;padding:8px 9px;font-size:12px;outline:none}.i:focus{border-color:#833ab4}.j{width:100%;background:linear-gradient(45deg,#405de6,#833ab4);border:0;color:#fff;font-weight:700;padding:9px;border-radius:8px;cursor:pointer;font-size:12px}.j2{background:#222326;border:1px solid #444;color:#eee;font-weight:600;padding:8px;border-radius:8px;cursor:pointer;font-size:12px}.j2.red{color:#f66;border-color:#522}.j2.grn{color:#7e5;border-color:#365}button:disabled{opacity:.4;cursor:default}textarea.i{height:70px;resize:vertical}.w{background:#2a1c1c;border:1px solid #622;border-radius:8px;padding:8px;font-size:11px;color:#fb9;line-height:1.35}.m{color:#777;text-align:center;font-size:11px;padding:4px}.card{background:#222326;border:1px solid #333;border-radius:10px;padding:9px 11px;font-size:12px;line-height:1.5}.card b{color:#fff}.card .g{color:#a8a8a8}.ft{display:flex;align-items:center;gap:6px;font-size:10.5px;color:#777;padding:2px 0}.dot{width:6px;height:6px;border-radius:50%;background:#7e5;animation:p 1.2s infinite}@keyframes p{50%{opacity:.3}}</style><div class=a><div class=b><span class=c>🛠️ IG Tools</span><button class=d id=x>✕</button></div><div class=tb id=tabs><button data-t=links class=on>🔗<span>Links</span></button><button data-t=follow>➕<span>Follow</span></button><button data-t=like>❤️<span>Like</span></button><button data-t=bio>✏️<span>Bio</span></button><button data-t=info>ℹ️<span>Info</span></button></div><div class=e><div class=f id=s>Memuat…</div><div id=w></div><div class=pn on id=p-links><div id=l></div><input class=i id=u placeholder="https://…"><input class=i id=t1 placeholder=Judul><button class=j id=a>+ Tambah Link</button></div><div class=pn id=p-follow><input class=i id=fu placeholder="username / pk target"><button class=j2 id=fo>Cek & Muat</button><div id=fc></div></div><div class=pn id=p-like><input class=i id=lu placeholder="URL post (instagram.com/p/…)"><button class=j2 id=lo>Cek Post</button><div id=lc></div></div><div class=pn id=p-bio><textarea class=i id=bio rows=4 placeholder="Bio…"></textarea><button class=j id=bs>💾 Simpan Bio</button><div class=m>Bio + link existing dikirim utuh (update_bio hanya menyentuh tautan). Hati-hati: 1x simpan per hari.</div></div><div class=pn id=p-info><input class=i id=iu placeholder="username (kosong = akun ini)"><button class=j2 id=io>ℹ️ Lihat Profil</button><div id=ic></div></div><div class=ft><span class=dot></span><span id=me>…</span><span style="margin-left:auto">v7</span></div></div></div>`;
  document.documentElement.appendChild(host);
  const q = (i) => R.getElementById(i), S = q('s');
  const st = (m, k) => { S.textContent = m; S.className = 'f' + (k ? ' ' + k : ''); };
  const esc = (t) => (t || '').replace(/</g, '&lt;');
  q('x').onclick = () => host.remove();
  const H = () => ({ 'content-type': 'application/x-www-form-urlencoded', 'x-csrftoken': CS });
  const G = (p) => fetch(p, { headers: H() });
  const P = (p, o) => fetch(p, { method: 'POST', headers: H(), body: new URLSearchParams({ _csrftoken: CS || '', _uid: UID || '', _uuid: crypto.randomUUID(), ...(o || {}) }) });
  const AB = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const sc2id = (sc) => { let id = 0n; for (const c of sc) { const i = AB.indexOf(c); if (i < 0) return null; id = id * 64n + BigInt(i); } return id.toString(); };

  // --- tab switching ---
  const tabs = R.querySelectorAll('.tb button');
  tabs.forEach((b) => b.onclick = () => {
    tabs.forEach((t) => t.classList.remove('on'));
    R.querySelectorAll('.pn').forEach((p) => p.classList.remove('on'));
    b.classList.add('on');
    q('p-' + b.dataset.t).classList.add('on');
    if (b.dataset.t === 'links') loadLinks();
    if (b.dataset.t === 'bio') loadBio();
  });

  // --- identitas: web_form_data (jalan di cookie & SessionBox mode) ---
  async function myIdentity() {
    if (ME) return FD;
    const f = await G('/api/v1/accounts/edit/web_form_data/');
    if (!f.ok) { st('Gagal form data: HTTP ' + f.status, 'x'); return null; }
    FD = (await f.json())?.form_data ?? {};
    ME = FD.username || null;
    q('me').textContent = 'login: ' + (ME || '?') + (uidC ? '' : ' (SessionBox)');
    return FD;
  }

  // ================= LINKS =================
  var loadLinks = async () => {
    st('Memuat…');
    try {
      const fd = await myIdentity();
      if (!fd) return [];
      let links;
      if (UID) {
        const g = await G('/api/v1/users/' + UID + '/info/');
        if (!g.ok) { st('Gagal: HTTP ' + g.status, 'x'); return []; }
        links = (await g.json())?.user?.bio_links ?? [];
      } else {
        const g = await G('/api/v1/users/web_profile_info/?username=' + encodeURIComponent(ME));
        if (!g.ok) { st('Gagal profil: HTTP ' + g.status, 'x'); return []; }
        const j = await g.json();
        UID = j?.data?.user?.id;
        links = j?.data?.user?.bio_links ?? [];
        if (!UID) { st('ID akun tidak ketemu.', 'x'); return []; }
      }
      q('l').innerHTML = links.length ? links.map((l) => `<div class=h><div><b>${esc(l.title)}</b><i>${esc(l.url)}</i></div><button class=k data-id="${l.link_id}">✕</button></div>`).join('') : '<div class=m>(belum ada link)</div>';
      st(links.length + ' link terpasang', 'g');
      q('l').querySelectorAll('.k').forEach((b) => b.onclick = () => delLink(b.dataset.id));
      return links;
    } catch (e) { st('Error: ' + e.message, 'x'); return []; }
  };
  var delLink = async (id) => {
    st('Menghapus…');
    const cur = await loadLinks(), ids = cur.filter((l) => String(l.link_id) !== String(id)).map((l) => l.link_id);
    const r = await P('/api/v1/accounts/update_bio_links/', { ordered_link_ids: JSON.stringify(ids) });
    r.ok ? (st('Dihapus ✓', 'g'), loadLinks()) : st('GAGAL ' + r.status, 'x');
  };
  q('a').onclick = async () => {
    let v = q('u').value.trim();
    if (!v) { st('URL kosong.', 'x'); return; }
    if (!/^https?:\/\//.test(v)) v = 'https://' + v;
    if (!UID) { await loadLinks(); if (!UID) return; }
    q('a').disabled = 1; st('Menyimpan…');
    try {
      const r = await P('/api/v1/accounts/update_bio_links/', { updated_links: JSON.stringify([{ url: v, title: q('t1').value.trim(), link_type: 'external' }]) });
      if (r.ok) { q('u').value = q('t1').value = ''; st('Tersimpan ✓', 'g'); loadLinks(); } else st('GAGAL ' + r.status, 'x');
    } catch (e) { st('Error: ' + e.message, 'x'); }
    q('a').disabled = 0;
  };

  // ================= FOLLOW =================
  let followPk = null, followState = null;
  q('fo').onclick = async () => {
    const un = q('fu').value.trim().replace(/^@/, '');
    if (!un) { st('Isi username / pk target.', 'x'); return; }
    if (/^\d+$/.test(un)) {
      followPk = un;
      q('fc').innerHTML = `<div class=card><b>pk: ${esc(un)}</b></div><button class=j id=fbtn>…</button>`;
      const show = await G('/api/v1/friendships/show/' + un + '/');
      followState = show.ok ? (await show.json())?.following : null;
      renderFollowBtn();
      return;
    }
    st('Mencari @' + un + '…');
    try {
      const g = await G('/api/v1/users/web_profile_info/?username=' + encodeURIComponent(un));
      if (!g.ok) { st('Gagal: HTTP ' + g.status, 'x'); return; }
      const u = (await g.json())?.data?.user;
      if (!u?.id) { st('Username tidak ada.', 'x'); return; }
      followPk = u.id;
      q('fc').innerHTML = `<div class=card><b>@${esc(u.username)}</b> — ${esc(u.full_name || '')}<br><span class=g>${u.follower_count ?? '?'} followers · ${u.media_count ?? '?'} posts</span></div><button class=j id=fbtn>…</button>`;
      const show = await G('/api/v1/friendships/show/' + u.id + '/');
      followState = show.ok ? (await show.json())?.following : null;
      renderFollowBtn();
    } catch (e) { st('Error: ' + e.message, 'x'); }
  };
  function renderFollowBtn() {
    const b = q('fbtn');
    if (!b) return;
    b.textContent = followState === true ? '✓ Following — klik utk Unfollow' : followState === false ? '+ Follow' : 'Follow (state ?)';
    b.className = 'j' + (followState === true ? ' j2 red' : '');
    b.onclick = async () => {
      if (!followPk) return;
      b.disabled = 1; st('Memproses…');
      const act = followState === true ? 'destroy' : 'create';
      const r = await P('/api/v1/friendships/' + act + '/' + followPk + '/');
      st(r.ok ? (act === 'create' ? 'Follow ✓' : 'Unfollow ✓') : 'GAGAL ' + r.status, r.ok ? 'g' : 'x');
      if (r.ok) { followState = act === 'create'; renderFollowBtn(); }
      b.disabled = 0;
    };
  }

  // ================= LIKE =================
  let likeId = null, likeState = null;
  q('lo').onclick = async () => {
    let v = q('lu').value.trim();
    const m = v.match(/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/);
    const sc = m ? m[1] : v.trim();
    if (!sc) { st('Masukkan URL post.', 'x'); return; }
    const id = sc2id(sc);
    if (!id) { st('Shortcode tidak valid.', 'x'); return; }
    st('Cek post…');
    try {
      const g = await G('/api/v1/media/' + id + '/info/');
      if (!g.ok) { st('Gagal: HTTP ' + g.status, 'x'); return; }
      const it = (await g.json())?.items?.[0];
      if (!it) { st('Post tidak ditemukan.', 'x'); return; }
      likeId = it.id; likeState = it.has_liked;
      q('lc').innerHTML = `<div class=card><b>@${esc(it.user?.username || '?')}</b> — ${esc((it.caption?.text || '').slice(0, 60))}<br><span class=g>❤️ ${it.like_count ?? '?'} likes · ${it.comment_count ?? '?'} comments</span></div><button class=j id=lbtn>…</button>`;
      renderLikeBtn();
    } catch (e) { st('Error: ' + e.message, 'x'); }
  };
  function renderLikeBtn() {
    const b = q('lbtn');
    if (!b) return;
    b.textContent = likeState ? '❤️ Liked — klik utk Unlike' : '❤️ Like';
    b.onclick = async () => {
      if (!likeId) return;
      b.disabled = 1; st('Memproses…');
      const act = likeState ? 'unlike' : 'like';
      const r = await P('/api/v1/media/' + likeId + '/' + act + '/');
      st(r.ok ? (act === 'like' ? 'Liked ✓' : 'Unliked ✓') : 'GAGAL ' + r.status, r.ok ? 'g' : 'x');
      if (r.ok) { likeState = act === 'like'; renderLikeBtn(); }
      b.disabled = 0;
    };
  }

  // ================= BIO =================
  async function loadBio() {
    const fd = await myIdentity();
    if (!fd) return;
    q('bio').value = fd.biography || '';
    st('Bio dimuat. Simpan = kirim form edit lengkap (aman utk field lain).');
  }
  q('bs').onclick = async () => {
    const fd = await myIdentity();
    if (!fd) return;
    q('bs').disabled = 1; st('Menyimpan bio…');
    try {
      const body = new URLSearchParams({
        biography: q('bio').value,
        chaining_enabled: fd.chaining_enabled === true ? 'on' : '',
        external_url: fd.external_url || '',
        first_name: fd.first_name || '',
        username: fd.username || '',
        gender: fd.gender || '',
      });
      const r = await fetch('/api/v1/web/accounts/edit/', { method: 'POST', headers: H(), body });
      st(r.ok ? 'Bio tersimpan ✓' : 'GAGAL ' + r.status, r.ok ? 'g' : 'x');
    } catch (e) { st('Error: ' + e.message, 'x'); }
    q('bs').disabled = 0;
  };

  // ================= INFO =================
  q('io').onclick = async () => {
    let un = q('iu').value.trim().replace(/^@/, '');
    st('Mencari…');
    try {
      if (!un) { const fd = await myIdentity(); un = ME; if (!un) { st('Isi username.', 'x'); return; } }
      const g = await G('/api/v1/users/web_profile_info/?username=' + encodeURIComponent(un));
      if (!g.ok) { st('Gagal: HTTP ' + g.status, 'x'); return; }
      const u = (await g.json())?.data?.user;
      if (!u) { st('Tidak ditemukan.', 'x'); return; }
      const links = (u.bio_links ?? []).map((l) => '• ' + (l.title || '') + ' ' + l.url).join('<br>') || '—';
      q('ic').innerHTML = `<div class=card><b>@${esc(u.username)}</b> (${u.id})<br>${esc(u.full_name || '')}<br><span class=g>👥 ${u.follower_count ?? '?'} · mengikuti ${u.following_count ?? '?'} · 🖼 ${u.media_count ?? '?'}</span><br>${esc(u.biography || '')}<br><span class=g>${links}</span></div>`;
      st('OK', 'g');
    } catch (e) { st('Error: ' + e.message, 'x'); }
  };

  // --- csrf warning + boot ---
  if (!CS) W0();
  function W0() { q('w').innerHTML = `<div class=w><b>csrf tidak ketemu</b> — muat ulang halaman lalu klik ulang bookmarklet.</div>`; }
  loadLinks();
})()
