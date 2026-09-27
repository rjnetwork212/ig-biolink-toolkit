# 03 — Ekstraksi Sesi Instagram dari Perangkat Android

## Sumber 1: AccountManager (paling andal)

Instagram Android mendaftarkan akunnya ke Android AccountManager dengan tipe `www.instagram.com`.

### Langkah (butuh root):

```bash
# 1) daftar akun IG di perangkat
adb shell dumpsys account | grep -E "www.instagram.com"

# 2) tarik database AccountManager
adb shell su -c 'cp /data/system_ce/0/accounts_ce.db /sdcard/acc.db && chmod 644 /sdcard/acc.db'
adb pull /sdcard/acc.db /tmp/acc.db

# 3) baca token dari tabel extras (bukan authtokens — kosong)
python3 -c "
import sqlite3, json, base64
con = sqlite3.connect('/tmp/acc.db')
val = list(con.execute('SELECT value FROM extras WHERE accounts_id=<ID> AND key=\"current_user\"'))[0][0]
tok = json.loads(val)['accessToken']            # 'Bearer IGT:2:eyJ...'
b64 = tok.split('IGT:2:')[1] + '=' * (-len(tok.split('IGT:2:')[1]) % 4)
obj = json.loads(base64.urlsafe_b64decode(b64))
print(obj['ds_user_id'], obj['sessionid'])
"
```

- `IGT:2` token = base64url dari JSON `{ds_user_id, sessionid}` — **sessionid ini valid untuk web** (verifikasi: GET `https://www.instagram.com/accounts/edit/` tanpa redirect login + konten memuat username).
- Catatan: token disimpan di `extras`, bukan tabel `authtokens` (kosong untuk tipe ini).
- Terbukti: injeksi cookie ini ke Chrome (via CDP) langsung login web.

### Yang TIDAK berhasil (jangan buang waktu):
- **App utama**: sesi di `crypto_db_*.db` — terenkripsi via Keystore.
- **Instagram Lite**: tidak menyimpan cookie sama sekali; grep sessionid/csrftoken/ds_user_id/set-cookie nihil di seluruh data dir; WebView Cookies DB kosong & tidak pernah tersentuh; auth-nya token SSO dari FB4A via AccountManager (`consume_sso_from_fb4a_via_account_manager_<uid>`).
- **Ambil authtokens AccountManager langsung**: kolom kosong untuk tipe www.instagram.com.

## Sumber 2: CDP (Chrome di perangkat)

```bash
adb forward tcp:9222 localabstract:chrome_devtools_remote
# websocket client wajib suppress_origin=True (Chrome >=111 menolak Origin http://127.0.0.1:9222 → 403)
# /json/new PUT bisa 500 → pakai tab yang sudah ada
```
- Injeksi cookie: `Network.setCookie` (sessionid + ds_user_id, domain `.instagram.com`, secure, httpOnly, sameSite Lax) → `Page.navigate` → login web aktif.
- Override UA: `Emulation.setUserAgentOverride` (berlaku juga untuk fetch halaman).
- Catatan: `Page.captureScreenshot` bisa timeout untuk tab yang di-background — bawa ke depan dulu (`Page.bringToFront` atau `am start`).

## Resep pakai cookie export web (fleet)

File export berisi header `Cookie:` lengkap. Kunci keberhasilan GET/POST dari luar browser:

1. **Kirim cookie apa adanya** (jangan di-decode; `%3A` bagian dari nilai).
2. **Header konteks browser wajib** di host web: `sec-fetch-site: same-origin`, `sec-fetch-mode: cors`, `sec-fetch-dest: empty`, `x-requested-with: XMLHttpRequest`, `origin`, `referer`, `x-ig-app-id: 936619743392459`.
3. GET pakai UA browser murni; POST pakai UA app-signature.
4. Tanpa header itu: HTML login / `{"message":"We're sorry…"}` / 429 (tergantung reputasi IP).

Referensi implementasi: `tools/cdp_inject.py`, `tools/cdp_matrix.py`, `tools/cdp_post.py`.
