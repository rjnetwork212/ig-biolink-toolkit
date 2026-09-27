(async () => {
  const uid = document.cookie.match(/ds_user_id=(\d+)/)?.[1];
  const csrf = document.cookie.match(/csrftoken=([^;]+)/)?.[1];
  const lsd = (document.documentElement.outerHTML.match(/"LSD",\[\],\{"token":"([^"]+)"/) || [])[1] || '';
  const av = decodeURIComponent(document.cookie.match(/rur=([^;]+)/)?.[1] || '').split(',')[1] || '';
  const jz = '2' + String([...csrf].reduce((a, c) => a + c.charCodeAt(0), 0));
  const H = { 'content-type': 'application/x-www-form-urlencoded', 'x-csrftoken': csrf, 'x-fb-lsd': lsd };
  const esc = (t) => (t || '').replace(/</g, '&lt;');
  const st = (m, k) => { const e = R.getElementById('s'); e.textContent = m; e.className = 'f' + (k ? ' ' + k : ''); };

  document.querySelectorAll('#igtools-host').forEach((e) => e.remove());
  const host = document.createElement('div');
  host.id = 'igtools-host';
  const R = host.attachShadow({ mode: 'closed' });
  R.innerHTML = `<style>*{box-sizing:border-box;margin:0;padding:0;font-family:system-ui,sans-serif}.a{position:fixed;top:12px;right:12px;width:330px;background:#18191c;color:#eee;border:1px solid #333;border-radius:14px;box-shadow:0 10px 30px #0009;overflow:hidden;z-index:2147483647;font-size:13px}.b{display:flex;align-items:center;gap:8px;padding:10px 12px;background:linear-gradient(45deg,#405de6,#833ab4,#c13584);font-weight:700}.c{flex:1}.d{cursor:pointer;background:#fff3;border:0;color:#fff;width:20px;height:20px;border-radius:50%}.e{padding:10px 12px;display:flex;flex-direction:column;gap:8px;max-height:65vh;overflow:auto}.f{font-size:11px;color:#999;min-height:14px}.f.x{color:#f66}.f.g{color:#7e5}.h{display:flex;align-items:center;gap:6px;background:#222326;border:1px solid #333;border-radius:8px;padding:7px 9px}.h div{flex:1;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.h b{display:block;font-size:12px}.h i{font-size:10px;color:#999;font-style:normal}.k{background:none;border:0;color:#f66;cursor:pointer;padding:2px 5px}.i{width:100%;background:#222326;border:1px solid #333;color:#eee;border-radius:8px;padding:8px 9px;font-size:12px;outline:none}.j{width:100%;background:linear-gradient(45deg,#405de6,#833ab4);border:0;color:#fff;font-weight:700;padding:9px;border-radius:8px;cursor:pointer;font-size:12px}.j2{background:#222326;border:1px solid #444;color:#eee;font-weight:600;padding:8px;border-radius:8px;cursor:pointer;font-size:12px}.sec{font-size:10px;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:.5px;border-top:1px solid #2a2a2e;padding-top:8px}button:disabled{opacity:.4}.w{background:#2a1c1c;border:1px solid #622;border-radius:8px;padding:8px;font-size:11px;color:#fb9;line-height:1.35}.m{color:#777;text-align:center;font-size:11px;padding:4px}</style><div class=a><div class=b><span class=c>🛠️ IG Tools</span><button class=d id=x>✕</button></div><div class=e><div class=f id=s>Memuat…</div><div id=w></div><div class=sec>🔗 LINK BIO</div><div id=l></div><input class=i id=u placeholder="https://…"><input class=i id=t1 placeholder=Judul><button class=j id=a>+ Tambah Link</button><div class=sec>👥 FOLLOW (GraphQL)</div><input class=i id=fu placeholder="pk / username target"><button class=j id=fo>⚡ Cek & Follow/Unfollow</button><div id=fc></div><div class=m>disiplin: maks 10-20 follow/akun/hari</div></div></div>`;
  document.documentElement.appendChild(host);
  const q = (i) => R.getElementById(i), S = q('s'), W = q('w'), L = q('l'), I = q('u'), T = q('t1'), A = q('a'), FU = q('fu'), FO = q('fo'), FC = q('fc');
  q('x').onclick = () => host.remove();

  if (!uid || !csrf) { st('Belum login instagram.com (cookie tidak ada).', 'x'); A.disabled = 1; FO.disabled = 1; FU.disabled = 1; return; }
  if (!lsd) { st('lsd tidak ketemu — muat ulang halaman lalu klik ulang bookmarklet.', 'x'); return; }

  const G = (p) => fetch(p, { headers: H });
  const P = (p, o) => fetch(p, { method: 'POST', headers: H, body: new URLSearchParams({ _csrftoken: csrf, _uid: uid, _uuid: crypto.randomUUID(), ...(o || {}) }) });
  const GQL = (pk) => fetch('/api/graphql', {
    method: 'POST', headers: H,
    body: new URLSearchParams({
      av: av, __user: '0', __a: '1', __d: 'www', __req: '1', __crn: '1',
      fb_dtsg: csrf, jazoest: jz, lsd: lsd,
      fb_api_caller_class: 'RelayModern',
      fb_api_req_friendly_name: 'usePolarisFollowMutation',
      server_timestamps: 'true',
      variables: JSON.stringify({ target_user_id: pk, container_module: 'profile', nav_chain: 'PolarisProfilePostsTabRoot:profilePage:1:via_cold_start' }),
      doc_id: '26508036048874888',
    }),
  });

  var loadLinks = async () => {
    st('Memuat…');
    try {
      const g = await G('/api/v1/users/' + uid + '/info/');
      if (!g.ok) { st('Gagal: HTTP ' + g.status, 'x'); return []; }
      const cur = (await g.json())?.user?.bio_links ?? [];
      L.innerHTML = cur.length ? cur.map((l) => `<div class=h><div><b>${esc(l.title)}</b><i>${esc(l.url)}</i></div><button class=k data-id="${l.link_id}">✕</button></div>`).join('') : '<div class=m>(belum ada link)</div>';
      st(cur.length + ' link terpasang', 'g');
      L.querySelectorAll('.k').forEach((b) => b.onclick = () => delLink(b.dataset.id));
      return cur;
    } catch (e) { st('Error: ' + e.message, 'x'); return []; }
  };
  var delLink = async (id) => {
    st('Menghapus…');
    const cur = await loadLinks(), ids = cur.filter((l) => String(l.link_id) !== String(id)).map((l) => l.link_id);
    const r = await P('/api/v1/accounts/update_bio_links/', { ordered_link_ids: JSON.stringify(ids) });
    r.ok ? (st('Dihapus ✓', 'g'), loadLinks()) : st('GAGAL ' + r.status, 'x');
  };
  A.onclick = async () => {
    let v = I.value.trim();
    if (!v) { st('URL kosong.', 'x'); return; }
    if (!/^https?:\/\//.test(v)) v = 'https://' + v;
    A.disabled = 1; st('Menyimpan…');
    try {
      const r = await P('/api/v1/accounts/update_bio_links/', { updated_links: JSON.stringify([{ url: v, title: T.value.trim(), link_type: 'external' }]) });
      if (r.ok) { I.value = T.value = ''; st('Tersimpan ✓', 'g'); loadLinks(); } else st('GAGAL ' + r.status, 'x');
    } catch (e) { st('Error: ' + e.message, 'x'); }
    A.disabled = 0;
  };

  let followPk = null, followState = null;
  const renderFollowBtn = () => {
    const b = q('fbtn');
    if (!b) return;
    b.textContent = followState === true ? '✓ Following — klik utk Unfollow' : followState === false ? '+ Follow' : 'Follow (state ?)';
    b.onclick = async () => {
      if (!followPk) return;
      b.disabled = 1; st('Memproses via GraphQL…');
      try {
        const r = await GQL(followPk);
        const t = await r.text();
        if (!r.ok) { st('GAGAL ' + r.status, 'x'); b.disabled = 0; return; }
        let fs = null;
        try { fs = JSON.parse(t.replace(/^for\(;;\);/, ''))?.data?.xdt_create_friendship?.friendship_status ?? null; } catch (e) {}
        st('OK: following=' + (fs ? fs.following : '?') + ' outgoing=' + (fs ? fs.outgoing_request : '?'), 'g');
        followState = fs ? (fs.following === true || fs.outgoing_request === true) : null;
        renderFollowBtn();
      } catch (e) { st('Error: ' + e.message, 'x'); b.disabled = 0; }
    };
  };
  FO.onclick = async () => {
    const un = FU.value.trim().replace(/^@/, '');
    if (!un) { st('Isi username / pk target.', 'x'); return; }
    st('Mencari @' + un + '…');
    try {
      if (/^\d+$/.test(un)) {
        followPk = un; followState = null;
        FC.innerHTML = `<div class=card><b>pk: ${esc(un)}</b></div><button class=j id=fbtn>…</button>`;
        const show = await G('/api/v1/friendships/show/' + un + '/');
        followState = show.ok ? (await show.json())?.following : null;
        renderFollowBtn();
        return;
      }
      const g = await G('/api/v1/users/web_profile_info/?username=' + encodeURIComponent(un));
      if (!g.ok) { st('Gagal: HTTP ' + g.status, 'x'); return; }
      const u = (await g.json())?.data?.user;
      if (!u?.id) { st('Username tidak ada.', 'x'); return; }
      followPk = u.id;
      FC.innerHTML = `<div class=card><b>@${esc(u.username)}</b> — ${esc(u.full_name || '')}<br><span class=g>${u.follower_count ?? '?'} followers · ${u.media_count ?? '?'} posts</span></div><button class=j id=fbtn>…</button>`;
      const show = await G('/api/v1/friendships/show/' + u.id + '/');
      followState = show.ok ? (await show.json())?.following : null;
      renderFollowBtn();
    } catch (e) { st('Error: ' + e.message, 'x'); }
  };

  loadLinks();
})()
