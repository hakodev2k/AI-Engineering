#!/usr/bin/env python3
import argparse, json, sys, time, hashlib
from urllib.parse import urljoin
import requests, yaml


def load_policy(path):
    with open(path, 'r', encoding='utf-8') as f: return yaml.safe_load(f)

def fingerprint(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(',', ':')).encode()).hexdigest()

def extract_items(body, field):
    if field:
        value = body
        for part in field.split('.'):
            value = value[part]
        if not isinstance(value, list): raise ValueError('items field is not a list')
        return value
    if isinstance(body, list): return body
    raise ValueError('response is not a list; configure --items-field')

def next_target(resp, body, mode, args):
    if mode == 'link':
        return resp.links.get('next', {}).get('url')
    if mode == 'cursor':
        cursor = body
        for part in args.cursor_field.split('.'):
            cursor = cursor.get(part) if isinstance(cursor, dict) else None
        if not cursor: return None
        return ('cursor', str(cursor))
    if mode == 'page-number':
        return ('page', args.page + 1)
    if mode == 'offset':
        return ('offset', args.offset + args.limit)
    raise ValueError('unsupported mode')

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--url', required=True); p.add_argument('--mode', required=True, choices=['link','cursor','page-number','offset'])
    p.add_argument('--policy', default='config/pagination-policy.yaml'); p.add_argument('--items-field'); p.add_argument('--id-field', default='id')
    p.add_argument('--cursor-field', default='next_cursor'); p.add_argument('--cursor-param', default='cursor')
    p.add_argument('--page-param', default='page'); p.add_argument('--offset-param', default='offset'); p.add_argument('--limit-param', default='limit')
    p.add_argument('--page', type=int, default=1); p.add_argument('--offset', type=int, default=0); p.add_argument('--limit', type=int, default=100)
    p.add_argument('--output', default='pagination-result.json'); p.add_argument('--header', action='append', default=[])
    a = p.parse_args(); policy = load_policy(a.policy)
    headers = {}
    for h in a.header:
        k, sep, v = h.partition(':')
        if not sep: raise SystemExit('invalid --header; use Name:Value')
        headers[k.strip()] = v.strip()
    seen_targets, seen_ids = set(), set(); duplicates = loops = pages = total = 0; errors = []; terminal = None; target = a.url
    session = requests.Session()
    while target and pages < policy['max_pages'] and total < policy['max_items']:
        if isinstance(target, tuple):
            kind, value = target; params = {}
            if kind == 'cursor': params[a.cursor_param] = value
            elif kind == 'page': a.page = int(value); params[a.page_param] = a.page
            elif kind == 'offset': a.offset = int(value); params[a.offset_param] = a.offset; params[a.limit_param] = a.limit
            url = a.url
        else: url, params = target, None
        key = fingerprint([url, params])
        if key in seen_targets: loops += 1; errors.append('pagination target repeated'); break
        seen_targets.add(key)
        resp = None
        for attempt in range(policy['max_retries_per_page'] + 1):
            try:
                resp = session.get(url, params=params, headers=headers, timeout=policy['request_timeout_seconds'])
                if resp.status_code in (429,500,502,503,504) and attempt < policy['max_retries_per_page']:
                    time.sleep(min(2 ** attempt, 4)); continue
                resp.raise_for_status(); break
            except requests.RequestException as ex:
                if attempt == policy['max_retries_per_page']: errors.append(str(ex)); resp = None
                else: time.sleep(min(2 ** attempt, 4))
        if resp is None: break
        try: body = resp.json(); items = extract_items(body, a.items_field)
        except Exception as ex: errors.append(f'invalid response: {ex}'); break
        pages += 1; total += len(items)
        for item in items:
            identifier = item.get(a.id_field) if isinstance(item, dict) else fingerprint(item)
            marker = str(identifier)
            if marker in seen_ids: duplicates += 1
            else: seen_ids.add(marker)
        nxt = next_target(resp, body, a.mode, a)
        if a.mode in ('page-number','offset') and len(items) < a.limit:
            nxt = None; terminal = f'page returned {len(items)} items, below limit {a.limit}'
        elif nxt is None:
            terminal = 'pagination provider exposed no next target'
        target = nxt
    status = 'verified-complete' if terminal and not errors and loops == 0 else ('blocked' if pages == 0 else 'partial')
    result = {'status':status,'mode':a.mode,'pagesFetched':pages,'itemsSeen':total,'uniqueItems':len(seen_ids),'duplicates':duplicates,'loopsDetected':loops,'terminalEvidence':terminal,'errors':errors}
    with open(a.output,'w',encoding='utf-8') as f: json.dump(result,f,indent=2)
    print(json.dumps(result,indent=2)); return 0 if status == 'verified-complete' else 2

if __name__ == '__main__': sys.exit(main())
