import json, websocket, urllib.request, time

CDP = 'http://127.0.0.1:9222'

def http_json(path, method='GET'):
    req = urllib.request.Request(CDP + path, method=method)
    return json.loads(urllib.request.urlopen(req, timeout=10).read().decode())

tabs = http_json('/json')
tab = next((t for t in tabs if t['type'] == 'page' and 'instagram.com' in t['url']), None)
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

JS = '''(async () => {
  const csrf = document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '';
  const IGID = '936619743392459';
  const H = {'content-type': 'application/x-www-form-urlencoded', 'x-csrftoken': csrf,
             'x-ig-app-id': IGID, 'x-requested-with': 'XMLHttpRequest'};
  // 1) link existing
  const r0 = await fetch('/api/v1/users/web_profile_info/?username=chipmunk.68590144', {headers: H});
  const j0 = await r0.json().catch(() => ({}));
  const existing = (j0?.data?.user?.bio_links ?? []).map(l => ({
    link_id: l.link_id || '', url: l.url, title: l.title || '', open_external_link_with: 'web'}));
  const links = [...existing, {link_id: '', url: 'https://allison-88131.slebewekeng.eu.cc/TEST03',
    title: 'Browser API Test', open_external_link_with: 'web'}];
  // 2) POST update_bio_links (path dari APK, host web same-origin)
  const body = new URLSearchParams({
    bio_links: JSON.stringify(links), _csrftoken: csrf, _uid: '30399613213',
    _uuid: crypto.randomUUID()});
  const r = await fetch('/api/v1/accounts/update_bio_links/', {method: 'POST', headers: H, body});
  const txt = await r.text();
  return JSON.stringify({csrfFound: !!csrf, existingCount: existing.length,
    getStatus: r0.status, postStatus: r.status, postResp: txt.slice(0, 300)});
})()'''

ev = send('Runtime.evaluate', {'expression': JS, 'returnByValue': True, 'awaitPromise': True})
rr = ev['result']['result']
print('error?' , 'error' in ev['result'])
print(json.loads(rr['value']) if rr.get('type') == 'string' else rr)
ws.close()
