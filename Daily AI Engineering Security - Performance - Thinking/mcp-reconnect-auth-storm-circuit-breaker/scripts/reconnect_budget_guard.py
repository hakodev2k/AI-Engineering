#!/usr/bin/env python3
import argparse, json, sys, time
from collections import defaultdict
from pathlib import Path
from urllib.parse import urlparse

EXIT_ALLOW=0; EXIT_BLOCK=3; EXIT_ERROR=2

def load(path):
    try: return json.loads(Path(path).read_text(encoding='utf-8'))
    except Exception as exc:
        print(json.dumps({'decision':'error','reason':str(exc)})); raise SystemExit(EXIT_ERROR)

def norm_endpoint(value):
    p=urlparse(str(value).strip())
    if not p.scheme or not p.hostname: raise ValueError('endpoint must be absolute URL')
    port=p.port or (443 if p.scheme=='https' else 80)
    return f'{p.scheme.casefold()}://{p.hostname.rstrip(".").casefold()}:{port}{p.path.rstrip("/") or "/"}'

def key(event):
    return '|'.join([norm_endpoint(event['endpoint']),str(event.get('auth_subject','anonymous')),str(event.get('catalog_id','default'))])

def analyze(events, policy, now=None):
    now=float(now if now is not None else time.time()); window=float(policy.get('window_seconds',300)); recent=[e for e in events if now-float(e.get('ts',0))<=window and float(e.get('ts',0))<=now]
    grouped=defaultdict(lambda: {'connect':0,'oauth_start':0,'tools_list':0,'schema_reinjection_tokens':0,'http_429':0,'timeout':0})
    errors=[]
    for e in recent:
        try: k=key(e)
        except Exception as exc: errors.append(str(exc)); continue
        typ=e.get('event')
        if typ in grouped[k]: grouped[k][typ]+=int(e.get('count',1))
        if typ=='schema_reinjection': grouped[k]['schema_reinjection_tokens']+=int(e.get('tokens',0))
        if typ=='http_429': grouped[k]['http_429']+=int(e.get('count',1))
        if typ=='timeout': grouped[k]['timeout']+=int(e.get('count',1))
    violations=[]
    for k,m in grouped.items():
        if m['connect']>int(policy.get('max_connect_attempts_per_key',4)): violations.append({'key':k,'metric':'connect','value':m['connect']})
        if m['oauth_start']>int(policy.get('max_oauth_starts_per_key',2)): violations.append({'key':k,'metric':'oauth_start','value':m['oauth_start']})
        if m['tools_list']>int(policy.get('max_tool_list_refreshes_per_key',2)): violations.append({'key':k,'metric':'tools_list','value':m['tools_list']})
        if m['schema_reinjection_tokens']>int(policy.get('max_schema_reinjection_tokens',4000)): violations.append({'key':k,'metric':'schema_reinjection_tokens','value':m['schema_reinjection_tokens']})
    return {'decision':'block' if violations or errors else 'allow','violations':violations,'errors':errors,'metrics':dict(grouped),'window_seconds':window}

def main():
    ap=argparse.ArgumentParser(description='Detect MCP reconnect/OAuth/discovery storms from JSON event arrays')
    ap.add_argument('--events',required=True); ap.add_argument('--policy',required=True); ap.add_argument('--now',type=float)
    a=ap.parse_args(); events=load(a.events); policy=load(a.policy)
    if not isinstance(events,list): print(json.dumps({'decision':'error','reason':'events must be a JSON array'})); return EXIT_ERROR
    result=analyze(events,policy,a.now); print(json.dumps(result,indent=2,sort_keys=True)); return EXIT_ALLOW if result['decision']=='allow' else EXIT_BLOCK
if __name__=='__main__': raise SystemExit(main())
