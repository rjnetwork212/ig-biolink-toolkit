import json, websocket, urllib.request, time

CDP = 'http://127.0.0.1:9222'
ds_user, sess = open('/tmp/ig_sess.txt').read().split()

def http_json(path, method='GET'):
    req = urllib.request.Request(CDP + path, method=method)
    return json.loads(urllib.request.urlopen(req, timeout=10).read().decode())

# pakai tab instagram yang sudah ada (fallback: buat tab baru dengan URL ter-encode)
tabs = http_json('/json')
tab = next((t for t in tabs if t['type'] == 'page' and t['url'].startswith('https://www.instagram.com')), None)
if tab is None:
    import urllib.parse
    enc = urllib.parse.quote('https://www.instagram.com/accounts/edit/', safe='')
    tab = http_json('/json/new?' + enc, method='PUT')
ws = websocket.create_connection(tab['webSocketDebuggerUrl'], timeout=30, suppress_origin=True)
mid = 0
def send(method, params=None, wait=True):
    global mid
    mid += 1
    my = mid
    ws.send(json.dumps({'id': my, 'method': method, 'params': params or {}}))
    if not wait:
        return None
    while True:
        msg = json.loads(ws.recv())
        if msg.get('id') == my:
            return msg

# 1) injeksi cookie
r1 = send('Network.setCookie', {
    'name': 'sessionid', 'value': sess,
    'domain': '.instagram.com', 'path': '/',
    'secure': True, 'httpOnly': True, 'sameSite': 'Lax'})
r2 = send('Network.setCookie', {
    'name': 'ds_user_id', 'value': ds_user,
    'domain': '.instagram.com', 'path': '/',
    'secure': True, 'httpOnly': True, 'sameSite': 'Lax'})
print('setCookie sessionid:', r1.get('result'), '| ds_user_id:', r2.get('result'))

send('Page.enable')
send('Page.bringToFront')
send('Page.navigate', {'url': 'https://www.instagram.com/accounts/edit/'})
time.sleep(8)

# 2) verifikasi login + petakan UI edit page
ev = send('Runtime.evaluate', {
    'expression': '''(() => {
  const txt = document.body.innerText;
  const labels = ['Name','Username','Pronouns','Bio','Links','Website','Gender','Banners','Edit profile','Log in','Sign up'];
  const found = {};
  for (const l of labels) found[l] = txt.includes(l);
  return JSON.stringify({
    url: location.href,
    loggedIn: !txt.includes('Sign up to see photos'),
    labels: found,
    snippet: txt.slice(0, 600)
  });
})()''', 'returnByValue': True})
res = json.loads(ev['result']['result']['value'])
print('URL:', res['url'])
print('loggedIn:', res['loggedIn'])
print('labels:', json.dumps(res['labels']))
print('--- snippet ---')
print(res['snippet'][:500])
ws.close()
