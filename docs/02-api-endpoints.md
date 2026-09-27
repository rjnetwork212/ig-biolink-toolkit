# 02 — Dokumentasi Endpoint & Skema API

Sumber kebenaran: decompile APK Instagram Android 448.0.0.52.84 (kelas `C540070LIv.java` di `decomp/`) + pengujian kawat pada 27 Sep 2026. Jalur bio-links adalah **REST, bukan GraphQL**.

## Tier 1 — daftar endpoint

| Host | Method | Path | Auth | Keterangan |
|---|---|---|---|---|
| `i.instagram.com` / `www.instagram.com` | GET | `/api/v1/users/{pk}/info/` | cookie sesi / Bearer IGT:2 | profil + `bio_links` (dengan `link_id`) |
| `i.instagram.com` / `www.instagram.com` | POST | `/api/v1/accounts/update_bio_links/` | cookie/Bearer + csrf | **create/edit/delete/reorder** |
| `i.instagram.com` | POST | `/api/v1/accounts/remove_bio_links/` | cookie/Bearer + csrf | alternatif hapus (tidak dipakai) |
| `www.instagram.com` | GET | `/api/v1/accounts/edit/web_form_data/` | cookie web | data form edit milik sendiri; berisi `form_data.username` & `bio_links_for_web_edit_only` (array URL string, tanpa link_id) |
| `www.instagram.com` | GET | `/api/v1/users/web_profile_info/?username=` | cookie web | profil publik; `data.user.id` + `bio_links` lengkap. **Per-IP ketat (429)** |

Tidak ada endpoint GraphQL khusus bio-links di app (terkonfirmasi dari DEX: hanya 2 endpoint tulis, keduanya REST).

## Tier 2 — `POST accounts/update_bio_links/` (skema asli dari decompile)

Dekode dari `C540070LIv.java`:

### 1. CREATE / EDIT satu link — param `updated_links`
```
POST /api/v1/accounts/update_bio_links/
Content-Type: application/x-www-form-urlencoded
Cookie: <sesi>          (atau Authorization: Bearer IGT:2:...)
X-CSRFToken / x-csrftoken: <csrftoken>

updated_links=[{"link_id":"...","url":"https://...","title":"...","link_type":"external"}]
&_uid=<ds_user_id>&_uuid=<uuid>&_csrftoken=<csrf>
```
- **CREATE**: item **TANPA key `link_id`** (atau `null`) → 200 + link tersimpan.
- `link_id: ""` (string kosong) → **400 fail**.
- **EDIT**: `link_id` terisi dengan id valid.
- Respons 200: echo objek `user` (termasuk `user.bio_links` = state hasil tulis).

### 2. DELETE / REORDER — param `ordered_link_ids`
```
ordered_link_ids=["<link_id1>","<link_id2>"]   ← daftar id urutan baru; id yang dihilangkan = terhapus
```

### 3. Param `bio_links` (full-replace seluruh daftar) — **JANGAN DIPAKAI**
Diterima 200 tapi **no-op total** (echo & state tidak berubah). Sumber kebingungan selama riset.

### Enum `link_type`
`external` · `facebook` · `facebook_group` · `facebook_page` · `whatsapp`

### Error keys
`multiple_links_create_or_edit_bio_link_request_failed`, `multiple_links_delete_bio_link_request_failed`

## Gerbang yang harus lolos

### 1. Gate UA (khusus POST; GET bebas)
- Wajib UA mengandung signature app: pola `Instagram <angka> Android`.
- UA browser murni (mobile/desktop Chrome, ± header x-ig-app-id) → **400 `{"message":"useragent mismatch"}`**.
- UA WebView-style (browser UA + signature ditempel belakang) → lolos.
- Matriks 6 kombinasi diuji: lihat `tools/cdp_matrix.py`.

### 2. Header sniffing (khusus web host `www.instagram.com/api/v1/`)
Wajib header konteks browser lengkap, minimal:
```
sec-fetch-site: same-origin   sec-fetch-mode: cors   sec-fetch-dest: empty
x-requested-with: XMLHttpRequest   origin: https://www.instagram.com
referer: https://www.instagram.com/
```
Tanpa itu → HTML login / `{"message":"We're sorry…"}` / 429. UA GET boleh browser murni.

### 3. CSRF
`x-csrftoken` header harus = cookie `csrftoken` (dibaca via `document.cookie` di mode normal; di-scrape dari `"csrf_token":"…"` di HTML pada mode SessionBox).

## Resep final terverifikasi (create dari cookie export web)

```python
# 1) GET  /api/v1/users/<ds_user_id>/info/      → UA browser + header lengkap → cek hidup + link existing
# 2) POST /api/v1/accounts/update_bio_links/    → UA APP-SIGNATURE + header lengkap
#      updated_links=[{"url":..., "title":..., "link_type":"external"}]   (tanpa link_id = create)
# 3) GET  ulang → verifikasi
```
Terbukti end-to-end: link "Whatsapp Here" live di akun fleet, tidak ada logout, jalan bahkan dari IP datacenter.
