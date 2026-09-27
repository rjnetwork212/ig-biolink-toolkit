#!/usr/bin/env python3
"""
fleet_write.py — pasang bio-link Instagram ke akun fleet dari cookie export web.

Terbukti bekerja 27 Sep 2026 (akun test: link "Whatsapp Here" live, tanpa logout).

Cara pakai:
  1. Buat file sessions.jsonl — satu baris per akun, JSON:
     {"cookie": "<header Cookie: lengkap dari export>", "uid": "<ds_user_id>",
      "csrf": "<nilai csrftoken>", "url": "https://link-kampanye", "title": "Whatsapp Here"}
  2. python3 fleet_write.py sessions.jsonl

Aturan: 1 tulis per akun per hari, jeda antar akun (script jeda default 10 detik —
naikkan ke menit untuk akun banyak). Stop jika muncul challenge_required.
"""
import json, sys, time, urllib.request, urllib.parse

UA_WEB = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
          "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")
# UA app-signature — angka versi harus mengikuti app yang membuat sesi
UA_APP = ("Instagram 448.0.0.52.84 Android (35/15; 280dpi; 720x1600; "
          "google; Pixel 10; frankel; zuma; en_US; 385412061)")
IGID_WEB = "936619743392459"     # x-ig-app-id web
IGID_APP = "567067343352427"     # x-ig-app-id Android build 448 (dari DEX)


def base_headers(cookie, csrf):
    """Header konteks browser lengkap — WAJIB, web host men-sniff sec-fetch-*."""
    return {
        "Cookie": cookie,
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "x-requested-with": "XMLHttpRequest",
        "sec-fetch-site": "same-origin",
        "sec-fetch-mode": "cors",
        "sec-fetch-dest": "empty",
        "referer": "https://www.instagram.com/",
        "origin": "https://www.instagram.com",
    }


def get_info(sess):
    h = base_headers(sess["cookie"], sess["csrf"])
    h.update({"User-Agent": UA_WEB, "x-ig-app-id": IGID_WEB, "x-csrftoken": sess["csrf"]})
    r = urllib.request.urlopen(urllib.request.Request(
        f"https://www.instagram.com/api/v1/users/{sess['uid']}/info/", headers=h), timeout=25)
    return json.loads(r.read().decode())["user"]


def post_add(sess, url, title):
    h = base_headers(sess["cookie"], sess["csrf"])
    # POST wajib UA app-signature — gerbang "useragent mismatch"
    h.update({"User-Agent": UA_APP, "x-ig-app-id": IGID_APP,
              "Content-Type": "application/x-www-form-urlencoded"})
    links = [{"url": url, "title": title, "link_type": "external"}]  # create = TANPA link_id
    body = urllib.parse.urlencode({
        "updated_links": json.dumps(links),          # BUKAN "bio_links" (no-op)!
        "_csrftoken": sess["csrf"], "_uid": sess["uid"], "_uuid": "uuid-" + sess["uid"],
    })
    r = urllib.request.urlopen(urllib.request.Request(
        "https://www.instagram.com/api/v1/accounts/update_bio_links/",
        data=body.encode(), headers=h, method="POST"), timeout=25)
    return r.status


def main(path):
    for line in open(path):
        line = line.strip()
        if not line:
            continue
        sess = json.loads(line)
        try:
            u = get_info(sess)
            cur = [(l.get("title"), l.get("url")) for l in u.get("bio_links", [])]
            print(f"[{sess['uid']}] {u.get('username')} | links: {cur}")
            if any(l[1] == sess["url"] for l in u.get("bio_links", [])):
                print(f"[{sess['uid']}] link sudah terpasang — lewati")
                continue
            st = post_add(sess, sess["url"], sess.get("title", ""))
            time.sleep(5)
            u2 = get_info()
            ok = any(l.get("url") == sess["url"] for l in u2.get("bio_links", []))
            print(f"[{sess['uid']}] POST {st} | verifikasi: {'OK' if ok else 'TIDAK TERSIMPAN'}")
        except urllib.error.HTTPError as e:
            print(f"[{sess.get('uid')}] HTTP {e.code}: {e.read().decode('utf-8', 'replace')[:120]}")
        time.sleep(10)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "sessions.jsonl")
