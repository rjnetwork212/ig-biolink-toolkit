# 01 — Temuan Utama (akar masalah & fakta teruji)

Investigasi 27 Sep 2026 — akun `chipmunk.68590144` (ds_user_id 30399613213) di Samsung A21s LineageOS (RR8NC00QFMF), diperluas ke akun fleet.

## Akar masalah "tidak bisa tambah link di browser"

1. **Editor bio-link dihapus dari web Instagram** — untuk akun terkait, halaman `accounts/edit/` (mobile maupun desktop web) merender field Links sebagai read-only:
   - Bundle `80d19253.js`: `PolarisSettingsTextInput` untuk Links dengan `disabled: true` dan `name: ""` (tidak ikut disubmit), plus pesan resmi *"Mengedit tautan Anda hanya tersedia di perangkat seluler. Buka aplikasi Instagram…"*.
   - Pesan itu muncul terlepas dari UA (desktop override pun sama) → kebijakan server per-akun/fitur, bukan soal UA.
2. **Validasi link dilakukan server-side** dengan UA crawler `facebookexternalhit`. UA browser user tidak pernah ikut dicek.
3. Endpoint web `POST /api/v1/accounts/update_bio_links/` tetap hidup — UI yang dipangkas, bukan kemampuan server. Asal UA request ber-signature app, tulis sukses.

## Fakta teruji (ringkas)

- Add link via **app penuh** dan **Instagram Lite**: sama-sama sukses (domain sama) → bukan soal domain utama.
- **Cloaking domain kampanye**: `allison-88131.slebewekeng.eu.cc/XWCCQ6HN` → browser/curl: 302 → `trk.facebooke.eu.cc/treads` → Bitget Wallet invite (`web3.bgw.live`); crawler IG (`facebookexternalhit`): 200 halaman bersih. Makanya lolos validasi.
- `trk.facebooke.eu.cc` → **403 ke facebookexternalhit** → URL di domain ini pasti ditolak IG di semua permukaan. Path palsu (TESTxx) → 302.
- `short.eskopi.eu.cc` → 200 ke crawler IG → aman.
- **Mobile web instagram.com tidak punya editor multi-link**; desktop web pun dinonaktifkan untuk akun ini.
- **SessionBox** me-virtualisasi cookie per-tab di storage ekstensi → `document.cookie` kosong → bookmarklet yang membaca cookie melihat "belum login" walau tab login. (lihat `04-sessionbox-ua.md`)
- **Lite tidak menyimpan cookie sama sekali**: WebView Cookies DB mtime lama & 0 baris; grep csrftoken/ds_user_id/set-cookie nihil; auth-nya token SSO dari FB4A (`consume_sso_from_fb4a_via_account_manager_<uid>`).
- **Sumber sesi yang benar di Android: AccountManager** — `/data/system_ce/0/accounts_ce.db` tabel `extras`, key `current_user` (dan `multiple_logged_in_user`) per akun tipe `www.instagram.com` → JSON berisi `accessToken: "Bearer IGT:2:..."` → base64url decode = `{ds_user_id, sessionid}`. Sessionid valid untuk web. (lihat `03-ekstraksi-sesi.md`)
- Chrome HP bisa diotomasi via CDP: `adb forward tcp:9222 localabstract:chrome_devtools_remote` (butuh `suppress_origin=True` di websocket-client, kalau tidak 403 Origin).
- Halaman challenge IG (`/accounts/suspended/`) mengaktifkan **Trusted Types** → `innerHTML` throw khusus di page itu (halaman normal aman).

## Kelemahan-kelemahan yang ditemukan di sisi IG (untuk pemahaman, bukan ajakan)

- Endpoint web `/api/v1/accounts/update_bio_links/` tetap merespon request browser asal UA + header konteks benar.
- `GET users/:id/info/` jalan di semua UA dari web context (tidak menuntut app-UA).
- Param `bio_links` diterima diam-diam tanpa efek (no-op) — server menerima request "sukses" tanpa melakukan apa pun; selalu verifikasi dengan GET terpisah.
