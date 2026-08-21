import json, subprocess, sys, tempfile, threading
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / 'scripts' / 'consistency_gate.py'

class Handler(BaseHTTPRequestHandler):
    count = 0
    def log_message(self, *_): pass
    def do_GET(self):
        Handler.count += 1
        payload = {'status': 'pending' if Handler.count < 3 else 'confirmed', 'version': '42'}
        body = json.dumps(payload).encode()
        self.send_response(200); self.send_header('Content-Type','application/json'); self.end_headers(); self.wfile.write(body)

def test_eventual_success():
    Handler.count = 0
    server = HTTPServer(('127.0.0.1',0), Handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True); thread.start()
    try:
        with tempfile.TemporaryDirectory() as d:
            req = Path(d)/'request.json'; out = Path(d)/'result.json'
            req.write_text(json.dumps({
                'read_url': f'http://127.0.0.1:{server.server_port}/order/1',
                'correlation_id':'test-1','value_path':'status',
                'expect':{'value':'confirmed','version_path':'version','min_version':'42'},
                'acceptable_statuses':[200],'max_attempts':4,'initial_delay_ms':1,'max_delay_ms':2
            }), encoding='utf-8')
            cp = subprocess.run([sys.executable,str(SCRIPT),'--request',str(req),'--output',str(out)], capture_output=True, text=True)
            result=json.loads(out.read_text())
            assert cp.returncode == 0
            assert result['status']=='verified'
            assert result['attempts']==3
            assert result['evidence'][0]['verified'] is False
            assert result['evidence'][-1]['verified'] is True
    finally:
        server.shutdown()

def test_missing_contract_fails():
    with tempfile.TemporaryDirectory() as d:
        req=Path(d)/'bad.json'; req.write_text('{}', encoding='utf-8')
        cp=subprocess.run([sys.executable,str(SCRIPT),'--request',str(req)], capture_output=True, text=True)
        assert cp.returncode == 2

def test_request_cannot_exceed_policy_attempts():
    with tempfile.TemporaryDirectory() as d:
        req = Path(d) / 'bad-attempts.json'
        req.write_text(json.dumps({
            'read_url': 'http://127.0.0.1:1/order/1',
            'correlation_id': 'test-policy-limit',
            'expect': {'value': 'confirmed'},
            'max_attempts': 5
        }), encoding='utf-8')
        cp = subprocess.run([sys.executable, str(SCRIPT), '--request', str(req)], capture_output=True, text=True)
        assert cp.returncode == 2
        assert 'policy maximum' in cp.stderr

if __name__=='__main__':
    test_eventual_success(); test_missing_contract_fails(); test_request_cannot_exceed_policy_attempts(); print('ok')
