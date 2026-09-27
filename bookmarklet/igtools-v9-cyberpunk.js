(async () => {
  const uid = document.cookie.match(/ds_user_id=(\d+)/)?.[1];
  const csrf = document.cookie.match(/csrftoken=([^;]+)/)?.[1];
  const lsd = (document.documentElement.outerHTML.match(/"LSD",\[\],\{"token":"([^"]+)"/) || [])[1] || '';
  const av = decodeURIComponent(document.cookie.match(/rur=([^;]+)/)?.[1] || '').split(',')[1] || '';
  const jz = '2' + String([...csrf].reduce((a, c) => a + c.charCodeAt(0), 0));
  const esc = (t) => (t || '').replace(/</g, '&lt;');

  document.querySelectorAll('#igtools-host').forEach((e) => e.remove());
  const host = document.createElement('div');
  host.id = 'igtools-host';
  const R = host.attachShadow({ mode: 'closed' });
  R.innerHTML = `<style>*{box-sizing:border-box;margin:0;padding:0;font-family:ui-monospace,'JetBrains Mono','Cascadia Mono',monospace}.a{position:fixed;top:12px;right:12px;width:360px;background:#0a0e14;color:#d8feff;border:1px solid rgba(0,240,255,.45);border-radius:4px;box-shadow:0 0 22px rgba(0,240,255,.3),inset 0 0 18px rgba(0,240,255,.05);overflow:hidden;z-index:2147483647;font-size:12px}.a::before{content:"";position:absolute;top:-1px;left:-1px;width:16px;height:16px;border-top:2px solid #00f0ff;border-left:2px solid #00f0ff}.a::after{content:"";position:absolute;bottom:-1px;right:-1px;width:16px;height:16px;border-bottom:2px solid #00f0ff;border-right:2px solid #00f0ff}.b{display:flex;align-items:center;gap:8px;padding:10px 12px;background:#0d1420;border-bottom:1px solid rgba(0,240,255,.4);color:#00f0ff;font-weight:700;letter-spacing:.14em;text-shadow:0 0 8px rgba(0,240,255,.9)}.c{flex:1}.v{font-size:9px;color:#ffe600;border:1px solid rgba(255,230,0,.5);padding:1px 5px;border-radius:3px;letter-spacing:.1em}.d{cursor:pointer;background:rgba(255,0,85,.15);border:1px solid #ff0055;color:#ff4d94;width:20px;height:20px;border-radius:3px}.d:hover{background:rgba(255,0,85,.4);box-shadow:0 0 10px rgba(255,0,85,.6)}.tb{display:flex;background:#0a0e14;border-bottom:1px solid rgba(0,240,255,.3)}.tb button{flex:1;background:#0d1117;border:0;border-bottom:2px solid transparent;color:#5a7a8a;padding:8px 0;font-size:10.5px;cursor:pointer;font-weight:700;letter-spacing:.08em}.tb button.on{color:#00f0ff;border-bottom:2px solid #00f0ff;text-shadow:0 0 8px rgba(0,240,255,.8);background:#0d1420}.e{padding:10px 12px;display:flex;flex-direction:column;gap:8px;max-height:62vh;overflow:auto;background:repeating-linear-gradient(0deg,rgba(0,240,255,.02) 0 1px,transparent 1px 3px)}.pn{display:none;flex-direction:column;gap:8px}.pn.on{display:flex}.f{font-size:10.5px;color:#5a8a9a;min-height:14px;font-family:monospace}.f.x{color:#ff3366}.f.g{color:#00ff88}.h{display:flex;align-items:center;gap:6px;background:#10141c;border:1px solid #1e2a32;border-left:2px solid #ff007f;border-radius:3px;padding:7px 9px}.h div{flex:1;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.h b{display:block;font-size:12px;color:#fff}.h i{font-size:10px;color:#00f0ff;font-style:normal}.k{background:none;border:0;color:#ff3366;cursor:pointer;padding:2px 5px;text-shadow:0 0 6px rgba(255,51,102,.7)}.k:hover{text-shadow:0 0 10px rgba(255,51,102,1)}.i{width:100%;background:#0d1117;border:1px solid #1e2a32;color:#d8feff;border-radius:3px;padding:8px 9px;font-size:11.5px;outline:none;font-family:monospace}.i:focus{border-color:#00f0ff;box-shadow:0 0 8px rgba(0,240,255,.35)}.j{width:100%;background:linear-gradient(90deg,#ff007f,#00f0ff);border:0;color:#05070a;font-weight:800;padding:9px;border-radius:3px;cursor:pointer;font-size:11.5px;letter-spacing:.08em}.j:hover{box-shadow:0 0 14px rgba(255,0,127,.5),0 0 14px rgba(0,240,255,.4)}.j2{background:#0d1117;border:1px solid rgba(0,240,255,.4);color:#00f0ff;font-weight:600;padding:8px;border-radius:3px;cursor:pointer;font-size:11px;font-family:monospace}.j2:hover{box-shadow:0 0 10px rgba(0,240,255,.4)}.row{display:flex;gap:6px}.row .i{flex:1}.row .j2{width:74px;padding:8px 0;text-align:center}button:disabled{opacity:.35;cursor:default}textarea.i{height:84px;resize:vertical}.w{background:#1a0d14;border:1px solid rgba(255,0,85,.5);border-radius:3px;padding:8px;font-size:10.5px;color:#ff4d94;line-height:1.4}.m{color:#3a6a7a;text-align:center;font-size:10px;padding:4px;font-family:monospace}.card{background:#10141c;border:1px solid #1e2a32;border-left:2px solid #00f0ff;border-radius:3px;padding:9px 11px;font-size:11.5px;line-height:1.5;font-family:monospace}.card b{color:#fff}.card .g{color:#5a8a9a}.sec{font-size:9.5px;color:#00f0ff;font-weight:700;text-transform:uppercase;letter-spacing:.18em}</style><div class=a><div class=b><span class=c>▚ IG TOOLS</span><span class=v>v9.0</span><button class=d id=x>✕</button></div><div class=tb><button class=on data-t=bio>🔗 BIO</button><button data-t=follow>👥 FOLLOW_BATCH</button></div><div class=e><div class=f id=s>[SYS] siap.</div><div id=w></div><div class="pn on" id=p-bio><div id=l></div><input class=i id=u placeholder="https://…"><input class=i id=t1 placeholder=Judul><button class=j id=a>＋ TAMBAH_LINK</button></div><div class=pn id=p-follow><textarea class=i id=ta rows=5 placeholder="pk / username — satu per baris"></textarea><div class=row><input class=i id=dl type=number value=40 min=5 placeholder="delay(s)"><button class=j2 id=go>▶ MULAI_BATCH</button><button class=j2 id=sp style="display:none">■ STOP</button></div><div id=lg class=lg style="display:none"></div></div></div></div>`;
  document.documentElement.appendChild(host);
  const q = (i) => R.getElementById(i), S = q('s'), W = q('w'), L = q('l'), I = q('u'), T = q('t1'), A = q('a'), TA = q('ta'), DL = q('dl'), GO = q('go'), SP = q('sp'), LG = q('lg'), PF = q('p-follow');
  q('x').onclick = () => host.remove();
  const st = (m, k) => { S.textContent = m; S.className = 'f' + (k ? ' ' + k : ''); };
  let RUN = false;

  // tab switching
  R.querySelectorAll('.tb button').forEach((b) => b.onclick = () => {
    R.querySelectorAll('.tb button').forEach((t) => t.classList.remove('on'));
    R.querySelectorAll('.pn').forEach((p) => p.classList.remove('on'));
    b.classList.add('on');
    q('p-' + b.dataset.t).classList.add('on');
    if (b.dataset.t === 'bio') loadLinks();
  });

  const H = { 'content-type': 'application/x-www-form-urlencoded', 'x-csrftoken': csrf, 'x-fb-lsd': lsd };
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

  // ================= BIO =================
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

  // ================= FOLLOW BATCH =================
  SP.onclick = () => { RUN = false; st('Stop diminta — selesai setelah target berjalan.', ''); };
  GO.onclick = async () => {
    const lines = TA.value.split('\n').map((x) => x.trim().replace(/^@/, '')).filter(Boolean);
    if (!lines.length) { st('Daftar target kosong.', 'x'); return; }
    const delay = Math.max(parseFloat(DL.value) || 40, 5);
    RUN = true; GO.disabled = 1; SP.style.display = 'inline-block';
    LG.style.display = 'block';
    const put = (m, k) => { const d = document.createElement('div'); d.className = k || ''; d.textContent = m; LG.appendChild(d); LG.scrollTop = LG.scrollHeight; };
    let ok = 0, no = 0, pe = 0;
    for (let i = 0; i < lines.length && RUN; i++) {
      const t = lines[i];
      st(`[${i + 1}/${lines.length}] ${t} …`);
      try {
        let pk = /^\d+$/.test(t) ? t : null;
        if (!pk) {
          const g = await G('/api/v1/users/web_profile_info/?username=' + encodeURIComponent(t));
          if (!g.ok) { put(`✗ ${t}: HTTP ${g.status}`, 'no'); no++; continue; }
          pk = (await g.json())?.data?.user?.id;
          if (!pk) { put(`✗ ${t}: pk tidak ketemu`, 'no'); no++; continue; }
        }
        const r = await GQL(pk);
        const txt = await r.text();
        let fs = null;
        try { fs = JSON.parse(txt.replace(/^for\(;;\);/, ''))?.data?.xdt_create_friendship?.friendship_status ?? null; } catch (e) {}
        if (r.ok && fs && (fs.following || fs.outgoing_request)) {
          ok++; pe += fs.outgoing_request ? 1 : 0;
          put(`✓ ${t} → ${fs.outgoing_request ? 'request terkirim (private)' : 'following'}`, 'ok');
        } else {
          no++;
          let msg = 'HTTP ' + r.status;
          try { msg = JSON.parse(txt).message || msg; } catch (e) {}
          put(`✗ ${t}: ${msg}`, 'no');
        }
      } catch (e) { no++; put(`✗ ${t}: ${e.message}`, 'no'); }
      if (i < lines.length - 1 && RUN) await new Promise((res) => setTimeout(res, delay * 1000));
    }
    st(`Selesai: ${ok} ok, ${no} gagal/terlewat`, ok && !no ? 'g' : 'x');
    GO.disabled = 0; SP.style.display = 'none';
  };

  if (!uid || !csrf) { st('Belum login instagram.com (cookie tidak ada).', 'x'); W.innerHTML = '<div class=w>Login dulu atau inject sessionid, lalu klik ulang bookmarklet.</div>'; A.disabled = 1; GO.disabled = 1; TA.disabled = 1; return; }
  if (!lsd) { st('lsd tidak ketemu — muat ulang halaman lalu klik ulang bookmarklet.', 'x'); return; }
  loadLinks();
})()
