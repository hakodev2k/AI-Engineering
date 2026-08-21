#!/usr/bin/env python3
import argparse
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

import yaml

RETRYABLE = {404, 409, 412, 425, 429, 500, 502, 503, 504}

def load_json(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))

def load_policy(path):
    data = yaml.safe_load(Path(path).read_text(encoding='utf-8'))
    if not isinstance(data, dict):
        raise ValueError('policy must be an object')
    return data

def request_json(url, headers, timeout):
    req = urllib.request.Request(url, headers=headers, method='GET')
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            body = r.read().decode('utf-8')
            try:
                payload = json.loads(body) if body else None
            except json.JSONDecodeError:
                payload = {'raw': body[:2000]}
            return r.status, payload, dict(r.headers)
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8', errors='replace')
        try: payload = json.loads(body) if body else None
        except json.JSONDecodeError: payload = {'raw': body[:2000]}
        return e.code, payload, dict(e.headers)
    except urllib.error.URLError as exc:
        return 0, {'network_error': str(exc.reason)}, {}

def extract(obj, dotted):
    cur = obj
    for part in dotted.split('.') if dotted else []:
        if not isinstance(cur, dict) or part not in cur: return None
        cur = cur[part]
    return cur

def main():
    ap = argparse.ArgumentParser(description='Bounded read-after-write consistency verifier')
    ap.add_argument('--request', required=True)
    ap.add_argument('--policy', default=str(Path(__file__).resolve().parent.parent / 'config' / 'policy.yaml'))
    ap.add_argument('--output', default='consistency-result.json')
    args = ap.parse_args()
    try:
        cfg = load_json(args.request)
        policy = load_policy(args.policy)
    except (OSError, ValueError, json.JSONDecodeError, yaml.YAMLError) as exc:
        print(f'invalid input or policy: {exc}', file=sys.stderr)
        return 2
    if not isinstance(cfg, dict):
        print('request must be an object', file=sys.stderr)
        return 2
    missing = [k for k in ['read_url','correlation_id','expect'] if not cfg.get(k)]
    if missing:
        print('missing fields: ' + ','.join(missing), file=sys.stderr); return 2
    if not isinstance(cfg['expect'], dict):
        print('expect must be an object', file=sys.stderr)
        return 2
    parsed_url = urllib.parse.urlparse(str(cfg['read_url']))
    if parsed_url.scheme not in {'http', 'https'} or not parsed_url.hostname:
        print('read_url must be an absolute HTTP(S) URL', file=sys.stderr)
        return 2
    try:
        policy_attempts = int(policy.get('max_attempts', 4))
        max_attempts = int(cfg.get('max_attempts', policy_attempts))
        initial_delay_ms = float(cfg.get('initial_delay_ms', policy.get('initial_delay_ms', 150)))
        multiplier = float(cfg.get('backoff_multiplier', policy.get('backoff_multiplier', 2.0)))
        policy_max_delay_ms = float(policy.get('max_delay_ms', 1200))
        requested_max_delay_ms = float(cfg.get('max_delay_ms', policy_max_delay_ms))
        timeout = float(cfg.get('timeout_seconds', 5))
    except (TypeError, ValueError):
        print('attempt, delay, multiplier, and timeout values must be numeric', file=sys.stderr)
        return 2
    if not 1 <= policy_attempts <= 4 or not 1 <= max_attempts <= policy_attempts:
        print('max_attempts must be between 1 and the policy maximum (up to 4)', file=sys.stderr)
        return 2
    if initial_delay_ms < 0 or requested_max_delay_ms < 0 or requested_max_delay_ms > policy_max_delay_ms or multiplier < 1 or timeout <= 0:
        print('delay/timeout values are outside the policy envelope', file=sys.stderr)
        return 2
    policy_statuses = set(policy.get('acceptable_statuses', [200]))
    acceptable_statuses = set(cfg.get('acceptable_statuses', policy_statuses))
    if not acceptable_statuses or not all(isinstance(value, int) for value in acceptable_statuses) or not acceptable_statuses <= policy_statuses:
        print('acceptable_statuses must be a non-empty subset of policy statuses', file=sys.stderr)
        return 2
    delay = initial_delay_ms / 1000.0
    max_delay = requested_max_delay_ms / 1000.0
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
        verified = status in acceptable_statuses and value_ok and version_ok
        last_reason = 'verified' if verified else ('network-error' if status == 0 else ('retryable-http' if status in RETRYABLE else 'stale-or-mismatch'))
        evidence.append({'attempt':attempt,'status':status,'observed':observed,'expected':expected,'observed_version':observed_version,'min_version':min_version,'verified':verified,'reason':last_reason,'retry_after':response_headers.get('Retry-After')})
        if verified: break
        if attempt < max_attempts:
            retry_after = response_headers.get('Retry-After'); sleep_for = delay
            if retry_after:
                try: sleep_for = min(max_delay, float(retry_after))
                except ValueError: pass
            time.sleep(sleep_for); delay = min(max_delay, delay*multiplier)
    result={'status':'verified' if verified else 'unverified','correlation_id':cfg['correlation_id'],'attempts':len(evidence),'reason':last_reason,'evidence':evidence}
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(result, indent=2), encoding='utf-8')
    print(json.dumps(result))
    return 0 if verified else 3

if __name__ == '__main__':
    raise SystemExit(main())
