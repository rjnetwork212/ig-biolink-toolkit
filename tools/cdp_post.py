import json, websocket, urllib.request, time

CDP = 'http://127.0.0.1:9222'
APP_UA = "Instagram 448.0.0.52.84 Android (35/15; 280dpi; 720x1600; google; Pixel 10; frankel; zuma; en_US; 385412061)"
WEB_UA = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36"

def http_json(path, method='GET'):
    req = urllib.request.Request(CDP + path, method=method)
    return json.loads(urllib.request.urlopen(req, timeout=10).read().decode())

tabs = http_json('/json')
tab = next((t for t in tabs if t['type'] == 'page' and 'instagram.com' in t['url']), None)
assert tab, 'instagram tab tidak ada'
ws = websocket.create_connection(tab['webSocketDebuggerUrl'], timeout=60, suppress_origin=True)
mid = 0
def send(method, params=None):
    global mid
    mid += 1
    my = mid
    ws.send(json.dumps({'id': my, 'method': method, 'params': params or {}}))
    while True:
        msg = json.loads(ws.recv())
        if msg.get('id') == my:
            return msg

def post_links(links):
    js = '''(async (linksJson) => {
  const csrf = document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '';
  const body = new URLSearchParams({
    bio_links: linksJson, _csrftoken: csrf, _uid: '30399613213', _uuid: crypto.randomUUID()});
  const r = await fetch('/api/v1/accounts/update_bio_links/', {method: 'POST',
    headers: {'content-type': 'application/x-www-form-urlencoded', 'x-csrftoken': csrf,
              'x-ig-app-id': '567067343352427'},
    body});
  return JSON.stringify({status: r.status, resp: (await r.text()).slice(0, 300)});
})''' + "(" + json.dumps(json.dumps(links)) + ")"
    ev = send('Runtime.evaluate', {'expression': js, 'returnByValue': True, 'awaitPromise': True})
    return json.loads(ev['result']['result']['value'])

EXISTING = [{"link_id": "18144425929577055",
             "url": "https://allison-88131.slebewekeng.eu.cc/XWCCQ6HN",
             "title": "Whatsapp Here", "open_external_link_with": "web",
             "link_type": "external"}]
TEST = [{"link_id": "", "url": "https://allison-88131.slebewekeng.eu.cc/TEST04",
         "title": "Browser API Test", "open_external_link_with": "web",
         "link_type": "external"}]

send('Page.enable')
send('Emulation.setUserAgentOverride', {'userAgent': APP_UA, 'platform': 'Linux armv8l'})
time.sleep(1)

print('=== POST add (existing + TEST04) ===')
r = post_links(EXISTING + TEST)
print(r)

print('=== POST cleanup (existing saja) ===')
r2 = post_links(EXISTING)
print(r2)

# kembalikan UA tab ke default mobile Chrome
send('Emulation.setUserAgentOverride', {'userAgent': WEB_UA, 'platform': 'Linux aarch64'})
print('UA tab dikembalikan ke mobile Chrome')
ws.close()
