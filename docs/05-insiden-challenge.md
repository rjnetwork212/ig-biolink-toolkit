# 05 — Insiden `challenge_required` & Disiplin Tulis

## Kronologi

Saat eksperimen payload `update_bio_links` (banyak POST beruntun dengan variasi schema dalam beberapa menit, ditambah GET verifikasi berulang), server membalas:

```
HTTP 400 {"message":"challenge_required","challenge":{"url":"https://www.instagram.com/accounts/suspended/","api_path":"/challenge/",...}}
```

App di HP langsung menampilkan interlock:

> **"Confirm you're human to use your profile, chipmunk.68590144"** — tombol Continue, "Takes about 30 seconds"

- Itu **interlock sesi/akun**, bukan suspension permanen.
- Penyembuhan: menyelesaikan verifikasi manual di app (memang challenge "manusia" — tidak diotomasi).
- Sesi yang berbeda konteks (replay dari IP datacenter) tetap `challenge_required` setelahnya — reputasi menempel pada konteks, bukan hanya akun.

## Pelajaran (aturan main)

1. **Maks 1–2 operasi tulis per akun per hari.** Bukan karena payload salah — satu tulis dengan schema benar tidak memicu apa pun — tapi karena **pola**: banyak POST + variasi payload dalam menit = anti-abuse.
2. Jangan variasi-variasi payload di akun hidup; eksperimen di akun tampingan/palsu.
3. Sesi replay dari IP datacenter itu rapuh: prioritaskan eksekusi dari browser/IP perangkat sendiri. Kalau harus dari VPS, gunakan kanal yang sudah terbukti (header konteks lengkap) dan tetap hemat.
4. Gejala lain yang tercatat: sesi browser yang diinjeksi cookie app lalu dipakai menulis → muncul challenge SMS di web (nomor fleet) — sisi web perlu verifikasi tersendiri.

## Gejala & artinya (cheatsheet)

| Gejala | Arti |
|---|---|
| `400 useragent mismatch` | UA request tidak mengandung signature app → pasang ekstensi/UA override |
| `400 challenge_required` (+ app minta "Confirm you're human") | anti-abuse terpicu → verifikasi manual, stop semua tulis |
| 200 tapi data tidak berubah | param/schema salah (contoh: `bio_links` = no-op) → verifikasi selalu dengan GET terpisah |
| 429 / HTML pada GET | rate-limit per-IP / header konteks kurang |
| Akun tiba-tiba logout setelah tulis | sesi dinilai dicuri (cookie/fingerprint tidak konsisten, mis. campuran SessionBox) |

## Eskalasi throttle VPS (27 Sep, setelah sesi tes)

Setelah rangkaian tes hari ini, IP VPS mengalami eskalasi: GET → 429, POST → redirect HTML (302/200-HTML) alih-alih diproses. Akibatnya tes fitur follow/like/bio untuk akun baru dari VPS tidak mungkin dieksekusi (nol efek samping — POST tidak diproses server). Kanal yang sama dengan schema sama pagi itu sukses (shanialaksita7162). Kesimpulan: tes fitur berikutnya harus dari IP bersih (browser user). VPS untuk akun fleet: cooldown berjam-jam/berhari-hari atau hindari sama sekali.
