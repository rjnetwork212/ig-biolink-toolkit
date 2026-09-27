# IG Bio Link Toolkit

Hasil riset & reverse engineering (27 Sep 2026) untuk menambahkan **bio-link Instagram dari browser** — lengkap dengan akar masalah, skema API asli dari decompile APK, tools otomasi, dan bookmarklet overlay yang terenkripsi.

> Repo **private**. Berisi metodologi riset akun milik sendiri. Jangan dibagikan.

---

## TL;DR

| Pertanyaan | Jawaban |
|---|---|
| Kenapa tidak bisa tambah link dari browser? | Instagram **menghapus editor bio-link dari seluruh web** (mobile & desktop). Field-nya dirender `disabled:true, name:""` di form edit. Kebijakan server, bukan bug. |
| Kenapa UA mobile tidak menolong? | Validasi link dilakukan server IG dengan crawler `facebookexternalhit`, bukan UA browser Anda. |
| Bisa lewati lewat API dari browser? | **Bisa.** Endpoint REST `POST /api/v1/accounts/update_bio_links/` dengan param **`updated_links`** (bukan `bio_links`!), plus UA ber-signature app di request API. |
| Apa yang "mengunci" request? | (1) Gate UA: request API menuntut UA mengandung `Instagram <angka> Android`; (2) web host men-sniff header `sec-fetch-*`/`origin`; (3) anti-abuse: tulis beruntun → `challenge_required`. |

## Struktur repo

```
docs/
  01-temuan-utama.md      → akar masalah + semua temuan kunci
  02-api-endpoints.md     → dokumentasi endpoint & skema payload (dari decompile)
  03-ekstraksi-sesi.md    → AccountManager → token IGT:2 → sessionid; injeksi via CDP
  04-sessionbox-ua.md     → keterbatasan SessionBox, matriks UA, ekstensi IG App UA
  05-insiden-challenge.md → insiden challenge_required & pelajaran disiplin tulis
  06-domain-analisis.md   → analisis cloaking domain kampanye vs crawler IG
bookmarklet/
  igbio-v6-final-encrypted.txt   → FINAL (terenkripsi, 5.086 char, paste langsung)
  igbio-v5-readable-master.js    → master terbaca (untuk revisi)
  igbio-import-obfuscated.html   → alternatif pasang via Import bookmarks
  ig-app-ua-ext/                 → ekstensi Chrome MV3 (UA app hanya utk /api/v1/)
tools/
  cdp_*.py                → skrip otomasi Chrome via CDP (injeksi cookie, matriks tes, POST)
decomp/
  C540070LIv.java         → kelas API bio-links hasil decompile APK (sumber kebenaran skema)
memory/
  instagram-biolink-browser-issue.md → catatan investigasi (copy dari memory assistant)
```

## Cara pakai cepat (desktop)

1. **Pasang ekstensi** `bookmarklet/ig-app-ua-ext/` → `chrome://extensions` → Developer mode → Load unpacked.
2. **Buat bookmark** baru, URL = isi `bookmarklet/igbio-v6-final-encrypted.txt` (pastikan prefix `javascript:` utuh).
3. Buka `instagram.com` (login akun target, atau injeksi `document.cookie="sessionid=…"` untuk akun fleet).
4. Klik bookmark → panel muncul → tambah/hapus link.

## Disiplin anti-challenge (WAJIB)

- **Maks 1–2 operasi tulis per akun per hari.** Jangan batch, jangan eksperimen payload beruntun.
- Satu insiden nyata tercatat: 10+ POST variasi dalam beberapa menit → `challenge_required` + interlock "Confirm you're human" di app. Lihat `docs/05-insiden-challenge.md`.

## Akun yang sudah selesai

- `chipmunk.68590144` (30399613213) — link "Whatsapp Here" aktif.
- `shanialaksita7162` (15863704892) — link "Whatsapp Here" aktif (dipasang via kanal web-cookie, terverifikasi).
