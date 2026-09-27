(async () => {
  const U = 'Instagram 448.0.0.52.84 Android (35/15; 280dpi; 720x1600; google; Pixel 10; frankel; zuma; en_US; 385412061)';
  const uidC = document.cookie.match(/ds_user_id=(\d+)/)?.[1];
  const csrfC = document.cookie.match(/csrftoken=([^;]+)/)?.[1];
  let CS = csrfC, UID = uidC;
  if (!CS) { const m = document.documentElement.outerHTML.match(/"csrf_token":"([^"]+)"/); CS = m && m[1]; }
  document.querySelectorAll('#igbiolinks-host').forEach((e) => e.remove());
  const h = document.createElement('div'), s = h.attachShadow({ mode: 'closed' });
  h.id = 'igbiolinks-host';
  s.innerHTML = `<style>*{box-sizing:border-box;margin:0;padding:0;font-family:system-ui,sans-serif}.a{position:fixed;top:12px;right:12px;width:330px;background:#18191c;color:#eee;border:1px solid #333;border-radius:14px;box-shadow:0 10px 30px #0009;overflow:hidden;z-index:2147483647;font-size:13px}.b{display:flex;align-items:center;gap:8px;padding:10px 12px;background:linear-gradient(45deg,#405de6,#833ab4,#c13584);font-weight:700}.c{flex:1}.d{cursor:pointer;background:#fff3;border:0;color:#fff;width:20px;height:20px;border-radius:50%}.e{padding:10px 12px;display:flex;flex-direction:column;gap:8px;max-height:65vh;overflow:auto}.f{font-size:11px;color:#999;min-height:14px}.f.x{color:#f66}.f.g{color:#7e5}.h{display:flex;align-items:center;gap:6px;background:#222;border:1px solid #333;border-radius:8px;padding:7px 9px}.h div{flex:1;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.h b{display:block;font-size:12px}.h i{font-size:10px;color:#999;font-style:normal}.k{background:none;border:0;color:#f66;cursor:pointer;padding:2px 4px}.i{width:100%;background:#222;border:1px solid #333;color:#eee;border-radius:8px;padding:8px 9px;font-size:12px;outline:none}.j{width:100%;background:linear-gradient(45deg,#405de6,#833ab4);border:0;color:#fff;font-weight:700;padding:9px;border-radius:8px;cursor:pointer;font-size:12px}.r2{display:flex;gap:6px}.r2 .i{flex:1}.r2 .j{width:70px;padding:8px 0}button:disabled{opacity:.4}textarea{width:100%;height:52px;background:#18191c;color:#fbb;border:1px solid #622;border-radius:8px;margin-top:5px;font-size:10px;padding:5px;resize:none}.w{background:#2a1c1c;border:1px solid #622;border-radius:8px;padding:8px;font-size:11px;color:#fb9;line-height:1.35}.m{color:#777;text-align:center;font-size:11px;padding:4px}</style><div class=a><div class=b><span class=c>🔗 IG Bio Links</span><button class=d id=x>✕</button></div><div class=e><div class=f id=s>Memuat…</div><div id=w></div><div id=l></div><input class=i id=u placeholder="https://…"><input class=i id=t placeholder=Judul><button class=j id=a>+ Tambah</button></div></div>`;
  document.documentElement.appendChild(h);
  const q = (i) => s.getElementById(i), S = q('s'), W = q('w'), L = q('l'), I = q('u'), T = q('t'), A = q('a');
  const st = (m, k) => { S.textContent = m; S.className = 'f' + (k ? ' ' + k : ''); };
  const esc = (t) => (t || '').replace(/</g, '&lt;');
  q('x').onclick = () => h.remove();
  const H = () => ({ 'content-type': 'application/x-www-form-urlencoded', 'x-csrftoken': CS });
  const p = (o) => fetch('/api/v1/accounts/update_bio_links/', { method: 'POST', headers: H(), body: new URLSearchParams({ _csrftoken: CS || '', _uid: UID || '', _uuid: crypto.randomUUID(), ...o }) });
  if (!CS) W.innerHTML = `<div class=w><b>csrf tidak ketemu</b> (cookie maupun HTML). Muat ulang halaman lalu klik ulang bookmarklet.</div>`;
  var load = async () => {
    st('Memuat…');
    try {
      let links;
      if (UID) {
        const g = await fetch('/api/v1/users/' + UID + '/info/', { headers: H() });
        if (!g.ok) { st('Gagal: HTTP ' + g.status, 'x'); return []; }
        links = (await g.json())?.user?.bio_links ?? [];
      } else {
        const f = await fetch('/api/v1/accounts/edit/web_form_data/', { headers: H() });
        if (!f.ok) { st('Gagal form data: HTTP ' + f.status, 'x'); return []; }
        const fd = (await f.json())?.form_data ?? {};
        const un = fd.username;
        if (!un) { st('Tidak bisa deteksi username (SessionBox).', 'x'); return []; }
        const g = await fetch('/api/v1/users/web_profile_info/?username=' + encodeURIComponent(un), { headers: H() });
        if (!g.ok) { st('Gagal profil: HTTP ' + g.status, 'x'); return []; }
        const j = await g.json();
        UID = j?.data?.user?.id;
        links = j?.data?.user?.bio_links ?? [];
        if (!UID) { st('ID akun tidak ketemu di profil.', 'x'); return []; }
      }
      L.innerHTML = links.length ? links.map((l) => `<div class=h><div><b>${esc(l.title)}</b><i>${esc(l.url)}</i></div><button class=k data-id="${l.link_id}">✕</button></div>`).join('') : '<div class=m>(belum ada link)</div>';
      st(links.length + ' link terpasang', 'g');
      L.querySelectorAll('.k').forEach((b) => b.onclick = () => del(b.dataset.id));
      return links;
    } catch (e) { st('Error: ' + e.message, 'x'); return []; }
  };
  var del = async (id) => {
    st('Menghapus…');
    const cur = await load(), ids = cur.filter((l) => String(l.link_id) !== String(id)).map((l) => l.link_id);
    const r = await p({ ordered_link_ids: JSON.stringify(ids) });
    r.ok ? (st('Dihapus ✓', 'g'), load()) : st('GAGAL ' + r.status, 'x');
  };
  A.onclick = async () => {
    let v = I.value.trim();
    if (!v) { st('URL kosong.', 'x'); return; }
    if (!/^https?:\/\//.test(v)) v = 'https://' + v;
    if (!UID) { await load(); if (!UID) return; }
    A.disabled = 1; st('Menyimpan…');
    try {
      const r = await p({ updated_links: JSON.stringify([{ url: v, title: T.value.trim(), link_type: 'external' }]) });
      if (r.ok) { I.value = T.value = ''; st('Tersimpan ✓', 'g'); load(); } else st('GAGAL ' + r.status, 'x');
    } catch (e) { st('Error: ' + e.message, 'x'); }
    A.disabled = 0;
  };
  load();
})()
