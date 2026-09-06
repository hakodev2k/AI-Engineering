#!/usr/bin/env python3
import hashlib, json, re, sys

def load_policy(path):
    with open(path, encoding='utf-8') as f: p=json.load(f)
    if not isinstance(p,dict): raise ValueError('policy must be an object')
    out={k:p.get(k,[]) for k in ('task_ids','forbidden_url_regex','forbidden_text_regex','forbidden_hashes')}
    for k,v in out.items():
        if not isinstance(v,list) or not all(isinstance(x,str) for x in v): raise ValueError(f'{k} must be list[str]')
    out['require_external_fields']=bool(p.get('require_external_fields',True))
    out['url_rx']=[re.compile(x,re.I) for x in out['forbidden_url_regex']]
    out['text_rx']=[re.compile(x,re.I) for x in out['forbidden_text_regex']]
    out['hashes']={x.lower() for x in out['forbidden_hashes']}
    return out

def scan(trace_path, policy):
    matches=[]; external=0; incomplete=0
    with open(trace_path,encoding='utf-8') as f:
        for line_no,line in enumerate(f,1):
            if not line.strip(): continue
            row=json.loads(line)
            if not isinstance(row,dict): raise ValueError(f'line {line_no}: object required')
            kind=str(row.get('kind',''))
            is_external=kind in {'search','browser','retrieve','web'} or bool(row.get('external'))
            if not is_external: continue
            external+=1
            url=str(row.get('url',''))
            query=str(row.get('query',''))
            text=str(row.get('text',''))
            digest=str(row.get('content_sha256','')).lower()
            if policy['require_external_fields'] and not any((url,query,text,digest)):
                incomplete+=1; continue
            hay='\n'.join((url,query,text)).lower()
            for task_id in policy['task_ids']:
                if task_id and task_id.lower() in hay: matches.append({'line':line_no,'reason':'task_id','value':task_id})
            if url and any(rx.search(url) for rx in policy['url_rx']): matches.append({'line':line_no,'reason':'url_pattern'})
            if text and any(rx.search(text) for rx in policy['text_rx']): matches.append({'line':line_no,'reason':'text_pattern'})
            if digest and digest in policy['hashes']: matches.append({'line':line_no,'reason':'known_hash'})
            if text and policy['hashes']:
                h=hashlib.sha256(text.encode()).hexdigest()
                if h in policy['hashes']: matches.append({'line':line_no,'reason':'text_hash'})
    if matches: return {'status':'contaminated','external_events':external,'incomplete_events':incomplete,'matches':matches}
    if incomplete: return {'status':'indeterminate','external_events':external,'incomplete_events':incomplete,'matches':[]}
    return {'status':'clean','external_events':external,'incomplete_events':0,'matches':[]}

def main():
    if len(sys.argv)!=3:
        print('usage: scan_trace_contamination.py <trace.jsonl> <policy.json>',file=sys.stderr); return 2
    try:
        p=load_policy(sys.argv[2]); result=scan(sys.argv[1],p)
    except (OSError,ValueError,json.JSONDecodeError,re.error) as e:
        print(json.dumps({'status':'error','error':str(e)})); return 2
    print(json.dumps(result,sort_keys=True))
    return 0 if result['status']=='clean' else 1
if __name__=='__main__': raise SystemExit(main())
