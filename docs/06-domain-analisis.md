# 06 — Analisis Domain Kampanye vs Crawler Instagram

Validasi link bio dilakukan server Instagram dengan UA crawler:

```
facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)
```

UA di browser pengguna tidak pernah ikut dalam pemeriksaan itu.

## Hasil tes (27 Sep 2026)

| URL | UA browser mobile / curl | UA `facebookexternalhit` | Arti |
|---|---|---|---|
| `https://allison-88131.slebewekeng.eu.cc/XWCCQ6HN` | 302 → `trk.facebooke.eu.cc/treads?sub_id=HS-Original` | **200** halaman bersih (og tags) | Cloaking: bot dapat preview bersih, manusia di-redirect |
| `https://allison-88131.slebewekeng.eu.cc/TESTxx` (path tak dikenal) | 302 | 302 | Cloaking per-slug: slug asli saja yang memberi 200 ke bot |
| `https://trk.facebooke.eu.cc/treads?...` | 200 | **403** | Tracker menolak crawler IG → URL di domain ini **pasti ditolak** jadi bio-link di semua permukaan |
| `https://web3.bgw.live/invite_login?...` (tujuan akhir) | 200 — halaman "You've been invited to Bitget Wallet" (inviteCode `crcQPW`) | 200 | Landing affiliate |
| `https://short.eskopi.eu.cc/` | 200 | 200 | Domain shortlink aman untuk crawler |

## Rantai lengkap link kampanye

```
IG bio (Whatsapp Here)
  → allison-88131.slebewekeng.eu.cc/XWCCQ6HN   (cloaking: bot=200 bersih, manusia=302)
    → trk.facebooke.eu.cc/treads?sub_id=HS-Original   (tracker klik; 403 ke crawler IG!)
      → web3.bgw.live/invite_login?channel=Copylink&inviteCode=crcQPW&type=card
        → halaman invite Bitget Wallet
```

## Implikasi praktis

1. Sebelum memasang link kampanye ke bio, **selalu tes dengan UA `facebookexternalhit`**: harus 200 di URL final. Kalau 403/302 ke domain yang menolak crawler → link akan bermasalah (validasi/reputasi).
2. Jangan pernah memakai domain `*.facebooke.eu.cc` (typosquat "facebook") sebagai URL bio — nyaris pasti masuk blocklist IG.
3. UTM yang disuntik IG saat crawler mem-fetch: `utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=…` — tracker harus tetap menerima crawler dengan 200 (bukan 403) supaya reputasi domain terjaga.
