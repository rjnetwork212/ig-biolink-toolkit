import json, websocket, urllib.request, time

CDP = 'http://127.0.0.1:9222'

def http_json(path, method='GET'):
    req = urllib.request.Request(CDP + path, method=method)
    return json.loads(urllib.request.urlopen(req, timeout=10).read().decode())

tabs = http_json('/json')
tab = next((t for t in tabs if t['type'] == 'page' and 'instagram.com' in t['url']), None)
ws = websocket.create_connection(tab['webSocketDebuggerUrl'], timeout=90, suppress_origin=True)
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
IGWEBVIEW_UA = "Mozilla/5.0 (Linux; Android 15; Pixel 10 Build/AP4A.250105.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/154.0.0.0 Mobile Safari/537.36 Instagram 448.0.0.52.84 Android (35/15; 280dpi; 720x1600; google; Pixel 10; frankel; zuma; en_US; 385412061)"
send('Emulation.setUserAgentOverride', {'userAgent': IGWEBVIEW_UA, 'platform': 'Linux aarch64'})
time.sleep(0.5)

def try_variant(name, new_item):
    js = '''(async (newItemJson) => {
  const uid = document.cookie.match(/ds_user_id=(\\d+)/)?.[1];
  const csrf = document.cookie.match(/csrftoken=([^;]+)/)?.[1];
  const H = {'content-type':'application/x-www-form-urlencoded','x-csrftoken':csrf};
  const g = await fetch('/api/v1/users/' + uid + '/info/', {headers: H});
  const cur = (await g.json())?.user?.bio_links ?? [];
  const items = cur.map(l => ({link_id: String(l.link_id), url: l.url, title: l.title || '',
    open_external_link_with: 'web', link_type: 'external'}));
  items.push(JSON.parse(newItemJson));
  const r = await fetch('/api/v1/accounts/update_bio_links/', {method:'POST', headers: H,
    body: new URLSearchParams({bio_links: JSON.stringify(items), _csrftoken: csrf,
      _uid: uid, _uuid: crypto.randomUUID()})});
  const j = await r.json().catch(() => null);
  const echoed = j?.user?.bio_links ?? null;
  return JSON.stringify({status: r.status,
    echo: echoed ? echoed.map(l => l.title + '|' + (l.url||'').slice(0,40)) : String(j).slice(0,120)});
})''' + '(' + json.dumps(json.dumps(new_item)) + ')'
    ev = send('Runtime.evaluate', {'expression': js, 'returnByValue': True, 'awaitPromise': True})
    print(name, '->', ev['result']['result'].get('value') or str(ev['result'].get('exceptionDetails'))[:200])

try_variant('V1 link_id:"" + open_external_link_with ',
    {"link_id": "", "url": "https://allison-88131.slebewekeng.eu.cc/TEST06", "title": "T6",
     "open_external_link_with": "web", "link_type": "external"})

try_variant('V2 tanpa key link_id              ',
    {"url": "https://allison-88131.slebewekeng.eu.cc/TEST07", "title": "T7",
     "open_external_link_with": "web", "link_type": "external"})

try_variant('V3 link_id:null                  ',
    {"link_id": None, "url": "https://allison-88131.slebewekeng.eu.cc/TEST08", "title": "T8",
     "open_external_link_with": "web", "link_type": "external"})

try_variant('V4 open_external_url_with_in_app_browser',
    {"link_id": "", "url": "https://allison-88131.slebewekeng.eu.cc/TEST09", "title": "T9",
     "open_external_url_with_in_app_browser": True})

ws.close()
