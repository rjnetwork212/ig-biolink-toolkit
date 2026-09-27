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

## FOLLOW via GraphQL (terbukti 27 Sep — 9/9 terkirim dari sesi alligator)

REST `friendships/*` diblokir untuk sesi tertentu, tapi **GraphQL lolos** — asimetri inilah kunci.

```
POST /api/graphql   (same-origin)
Content-Type: application/x-www-form-urlencoded
X-CSRFToken: <csrf>          (= fb_dtsg)
X-FB-LSD: <lsd>              (token page, ada di HTML)
X-FB-Friendly-Name: usePolarisFollowMutation
X-IG-App-ID: 936619743392459

Body (29 param, template dari klien asli):
av=<viewer-id-web>&__d=www&__user=0&__a=1&__req=<seq>&__hs=<hs>&dpr=1&__ccg=GOOD
&__rev=<rev>&__s=<sesi>&__hsi=<hsi>&__dyn=<dyn>&__csr=<csr>&__hsdp=&__hblp=&__sjsp=
&__comet_req=<n>&fb_dtsg=<csrf>&jazoest=<n>&lsd=<lsd>&__spin_r=&__spin_b=trunk
&__spin_t=<ts>&__crn=<n>&fb_api_caller_class=RelayModern
&fb_api_req_friendly_name=usePolarisFollowMutation&server_timestamps=true
&variables={"target_user_id":"<PK>","container_module":"profile","nav_chain":"PolarisProfilePostsTabRoot:profilePage:1:via_cold_start"}
&doc_id=26508036048874888
```

Respons: `{"data":{"xdt_create_friendship":{"username":"…","friendship_status":{"following":true|false,"outgoing_request":…}}}}`
- akun publik → `following: true`
- akun private → `outgoing_request: true` (pending)

### Teknik capture (untuk sesi/apapun di masa depan)
1. Hook XHR + fetch di halaman (mutasi IG web lewat **XHR**, bukan fetch).
2. Klik tombol Follow asli di UI sekali → body penuh tertangkap (2.041 char, 29 param).
3. Ganti `target_user_id` per pk → replay dengan jeda 35–40 detik.
4. Nilai page-scoped (av/lsd/fb_dtsg/__hs) hanya valid untuk page-session itu — ambil ulang tiap sesi.

### Pemetaan mutasi penting lain (dari pola yang sama)
- Unfollow: mutasi sama, `friendships/destroy` — atau klik "Following" di UI dan tangkap.
- Endpoint GraphQL mengikuti pola `usePolaris<X>Mutation` dengan `X-FB-Friendly-Name` di header.
