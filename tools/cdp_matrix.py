import json, websocket, urllib.request, time

CDP = 'http://127.0.0.1:9222'

def http_json(path, method='GET'):
    req = urllib.request.Request(CDP + path, method=method)
    return json.loads(urllib.request.urlopen(req, timeout=10).read().decode())

tabs = http_json('/json')
tab = next((t for t in tabs if t['type'] == 'page' and 'instagram.com' in t['url']), None)
assert tab, 'tab instagram tidak ada'
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

send('Page.enable')

PROBE = '''(async (appid) => {
  const csrf = document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '';
  const uid = document.cookie.match(/ds_user_id=(\\d+)/)?.[1] || '';
  const headers = {'content-type': 'application/x-www-form-urlencoded', 'x-csrftoken': csrf};
  if (appid) headers['x-ig-app-id'] = appid;
  // GET info dulu (cek apakah GET /api/v1 jalan dari web context)
  let getInfo = '?';
  try {
    const g = await fetch('/api/v1/users/' + (uid||'30399613213') + '/info/', {headers});
    getInfo = g.status;
  } catch(e) { getInfo = 'ERR:' + e.message; }
  // POST probe idempotent: full-replace dengan isi identik
  const links = [{link_id: '18144425929577055',
    url: 'https://allison-88131.slebewekeng.eu.cc/XWCCQ6HN',
    title: 'Whatsapp Here', open_external_link_with: 'web', link_type: 'external'}];
  const body = new URLSearchParams({bio_links: JSON.stringify(links), _csrftoken: csrf,
    _uid: '30399613213', _uuid: crypto.randomUUID()});
  let post = '?';
  try {
    const r = await fetch('/api/v1/accounts/update_bio_links/', {method: 'POST', headers, body});
    const t = await r.text();
    post = r.status + (r.status != 200 ? ' ' + t.slice(0, 80) : '');
  } catch(e) { post = 'ERR:' + e.message; }
  return JSON.stringify({ua: navigator.userAgent.slice(0, 40), getInfo, post});
})'''

MOBILE_UA = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36"
APP_UA = "Instagram 448.0.0.52.84 Android (35/15; 280dpi; 720x1600; google; Pixel 10; frankel; zuma; en_US; 385412061)"
IGWEBVIEW_UA = "Mozilla/5.0 (Linux; Android 15; Pixel 10 Build/AP4A.250105.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/154.0.0.0 Mobile Safari/537.36 Instagram 448.0.0.52.84 Android (35/15; 280dpi; 720x1600; google; Pixel 10; frankel; zuma; en_US; 385412061)"

cases = [
    ('mobile Chrome + android app-id', MOBILE_UA, '567067343352427'),
    ('mobile Chrome + NO app-id     ', MOBILE_UA, None),
    ('mobile Chrome + web app-id    ', MOBILE_UA, '936619743392459'),
    ('app UA + NO app-id            ', APP_UA, None),
    ('app UA + web app-id           ', APP_UA, '936619743392459'),
    ('IG webview UA + android app-id', IGWEBVIEW_UA, '567067343352427'),
]
for name, ua, appid in cases:
    send('Emulation.setUserAgentOverride', {'userAgent': ua, 'platform': 'Linux aarch64'})
    time.sleep(0.5)
    ev = send('Runtime.evaluate', {'expression': PROBE + '(' + json.dumps(appid) + ')',
                                    'returnByValue': True, 'awaitPromise': True})
    print(name, '->', ev['result']['result'].get('value') or ev['result'].get('exceptionDetails', {}).get('text'))
ws.close()
