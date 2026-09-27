# 04 — SessionBox, Gate UA, dan Ekstensi IG App UA

## Kenapa bookmarklet "tidak mendeteksi cookie" di tab SessionBox

SessionBox me-virtualisasi cookie: jar cookie per-tab disimpan di **storage ekstensinya sendiri** dan disuntikkan ke request di level jaringan. Akibatnya:

- `document.cookie` di dalam tab = kosong (tidak ada csrftoken, ds_user_id, apalagi sessionid).
- Halaman tetap terlihat login karena request dibungkus cookie virtual oleh SessionBox.
- Bookmarklet yang membaca `document.cookie` → "cookie tidak ada" walau tab login. (Plus: `sessionid`/cookie httpOnly memang tak pernah terlihat JS bahkan tanpa SessionBox.)

### Solusi di bookmarklet v5/v6 (mode otomatis)
- csrf fallback: scrape `"csrf_token":"([^"]+)"` dari `document.documentElement.outerHTML`.
- Identitas akun: `GET /api/v1/accounts/edit/web_form_data/` → `form_data.username` ( Respons terverifikasi: username ada; `pk` TIDAK ada; `bio_links_for_web_edit_only` hanya array URL string tanpa link_id) → lanjut `web_profile_info/?username=` untuk `id` + `bio_links` lengkap.
- Jika SessionBox tidak menempelkan cookie ke `fetch()` halaman → endpoint akan gagal terlihat di status bar → fallback: tab normal + injeksi sessionid / Chrome profile.

## Matriks UA vs POST update_bio_links (teruji via CDP)

| UA tab | POST |
|---|---|
| Chrome mobile (± header x-ig-app-id apa pun) | ❌ 400 `useragent mismatch` |
| Chrome desktop (± header) | ❌ 400 |
| UA ber-signature `Instagram 448… Android` (app UA, dengan/tanpa x-ig-app-id) | ✅ 200 |
| UA WebView: browser UA + ` Instagram 448… Android (…)` di belakang | ✅ 200 |

Kesimpulan: gate-nya **substring signature app di UA**. Bagian depan `Mozilla/5.0…` opsional. GET `users/:id/info/` lolos di SEMUA UA.

## Ekstensi "IG App UA" (MV3, declarativeNetRequest)

Masalah yang diselesaikan: UA override DevTools hilang saat DevTools ditutup, dan `navigator.userAgent` halaman tidak berubah walau ekstensi hanya mengubah header request (karena itu panel menampilkan info yang jujur "tidak mendeteksi ekstensi").

Scope aturan: **hanya** `urlFilter: "||instagram.com/api/v1/"` + `resourceTypes: ["xmlhttprequest"]` → halaman web tetap dimuat dengan UA desktop normal, hanya request API yang memakai UA app.

Install: `chrome://extensions` → Developer mode → **Load unpacked** → folder `bookmarklet/ig-app-ua-ext/`.

## Evolution bookmarklet

| Versi | Ukuran | Perubahan |
|---|---|---|
| v2 (4.5KB) | overlay Shadow DOM pertama | alert/prompt dihapus (penyebab "diam": Chrome suppress dialog + prefix terpotong) |
| v3.1 (4.47KB) | desktop workflow | guard UA non-blocking; ekstensi IG App UA |
| v4 (5.11KB) | SessionBox mode | csrf scrape HTML + resolve uid via username |
| v5.1 (4.83KB) | auto-detect penuh | username dari `web_form_data`, tanpa input manual; info line dihapus |
| **v6 (5.09KB, FINAL)** | **terenkripsi** | endpoint/param/header dienkripsi reverse+base64 (array `Zq` + decoder `D`), object key pakai computed property; master terbaca: `igbio-v5-readable-master.js` |

Catatan build v6:
- Object key tidak bisa diganti string literal sembarangan → wajib *computed property* `[D(n)]:`.
- Hat-hati bentrok nama variabel (`A` sudah dipakai untuk tombol Tambah).
- `javascript-obfuscator` penuh menghasilkan 18.9KB (overkill & tidak pasteable) → dipilih enkripsi manual string sensitif saja (endpoint/param/header), CSS/HTML dibiarkan.
