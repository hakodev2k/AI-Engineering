#!/usr/bin/env python3
import argparse, json, sys, time, urllib.error, urllib.request
from pathlib import Path

RETRYABLE = {404, 409, 412, 425, 429, 500, 502, 503, 504}

def load_json(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))

def request_json(url, headers, timeout):
    req = urllib.request.Request(url, headers=headers, method='GET')
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            body = r.read().decode('utf-8')
            return r.status, json.loads(body) if body else None, dict(r.headers)
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8', errors='replace')
        try: payload = json.loads(body) if body else None
        except json.JSONDecodeError: payload = {'raw': body[:2000]}
        return e.code, payload, dict(e.headers)

def extract(obj, dotted):
    cur = obj
    for part in dotted.split('.') if dotted else []:
        if not isinstance(cur, dict) or part not in cur: return None
        cur = cur[part]
    return cur

def main():
    ap = argparse.ArgumentParser(description='Bounded read-after-write consistency verifier')
    ap.add_argument('--request', required=True)
    ap.add_argument('--output', default='consistency-result.json')
    args = ap.parse_args()
    cfg = load_json(args.request)
    missing = [k for k in ['read_url','correlation_id','expect'] if not cfg.get(k)]
    if missing:
        print('missing fields: ' + ','.join(missing), file=sys.stderr); return 2
    max_attempts = int(cfg.get('max_attempts', 4))
    delay = float(cfg.get('initial_delay_ms', 150))/1000.0
    multiplier = float(cfg.get('backoff_multiplier', 2.0))
    max_delay = float(cfg.get('max_delay_ms', 1200))/1000.0
    timeout = float(cfg.get('timeout_seconds', 5))
    headers = dict(cfg.get('headers', {})); headers.setdefault('X-Correlation-Id', cfg['correlation_id'])
    evidence=[]; verified=False; last_reason='not-attempted'
    for attempt in range(1, max_attempts+1):
        status, payload, response_headers = request_json(cfg['read_url'], headers, timeout)
        observed = extract(payload, cfg.get('value_path','')) if payload is not None else None
        expected = cfg['expect'].get('value')
        version_path = cfg['expect'].get('version_path')
        min_version = cfg['expect'].get('min_version')
        observed_version = extract(payload, version_path) if version_path else None
        value_ok = observed == expected
        version_ok = min_version is None or (observed_version is not None and str(observed_version) >= str(min_version))
        verified = status in set(cfg.get('acceptable_statuses',[200])) and value_ok and version_ok
        last_reason = 'verified' if verified else ('retryable-http' if status in RETRYABLE else 'stale-or-mismatch')
        evidence.append({'attempt':attempt,'status':status,'observed':observed,'expected':expected,'observed_version':observed_version,'min_version':min_version,'verified':verified,'reason':last_reason,'retry_after':response_headers.get('Retry-After')})
        if verified: break
        if attempt < max_attempts:
            retry_after = response_headers.get('Retry-After'); sleep_for = delay
            if retry_after:
                try: sleep_for = min(max_delay, float(retry_after))
                except ValueError: pass
            time.sleep(sleep_for); delay = min(max_delay, delay*multiplier)
    result={'status':'verified' if verified else 'unverified','correlation_id':cfg['correlation_id'],'attempts':len(evidence),'reason':last_reason,'evidence':evidence}
    Path(args.output).write_text(json.dumps(result, indent=2), encoding='utf-8')
    print(json.dumps(result))
    return 0 if verified else 3

if __name__ == '__main__':
    raise SystemExit(main())
