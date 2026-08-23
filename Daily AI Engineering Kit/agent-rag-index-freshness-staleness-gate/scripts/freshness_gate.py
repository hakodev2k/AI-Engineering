#!/usr/bin/env python3
import argparse, json, sys
from datetime import datetime, timezone
from pathlib import Path

try:
    import yaml
except ImportError:
    print('PyYAML is required: pip install pyyaml', file=sys.stderr)
    sys.exit(2)

def dt(v):
    if v.endswith('Z'): v = v[:-1] + '+00:00'
    return datetime.fromisoformat(v).astimezone(timezone.utc)

def load(path):
    p=Path(path)
    if not p.exists(): raise FileNotFoundError(path)
    with p.open('r', encoding='utf-8') as f:
        return yaml.safe_load(f) if p.suffix in ('.yaml','.yml') else json.load(f)

def main():
    ap=argparse.ArgumentParser(description='Block RAG retrieval when indexed metadata is stale versus source metadata.')
    ap.add_argument('--policy', required=True)
    ap.add_argument('--input', required=True, help='JSON array of source/index metadata records')
    ap.add_argument('--output', required=True)
    args=ap.parse_args()
    try:
        policy=load(args.policy); rows=load(args.input)
        if not isinstance(rows,list): raise ValueError('input must be a JSON array')
        now=datetime.now(timezone.utc); out=[]
        for r in rows:
            missing=[k for k in ('id','source_version','indexed_version','source_updated_at','indexed_at','content_hash') if k not in r]
            if missing:
                out.append({'id':str(r.get('id','unknown')),'source_version':r.get('source_version','unknown'),'indexed_version':r.get('indexed_version','unknown'),'source_updated_at':r.get('source_updated_at',now.isoformat()),'indexed_at':r.get('indexed_at',now.isoformat()),'content_hash':r.get('content_hash',''),'fresh':False,'reason':'missing:'+','.join(missing)})
                continue
            source_updated=dt(r['source_updated_at']); indexed=dt(r['indexed_at'])
            age_h=(now-source_updated).total_seconds()/3600
            lag_m=(indexed-source_updated).total_seconds()/60
            reasons=[]
            if str(r['source_version']) != str(r['indexed_version']): reasons.append('version-mismatch')
            if lag_m < 0 or lag_m > float(policy['max_index_lag_minutes']): reasons.append('index-lag')
            if age_h > float(policy['max_document_age_hours']): reasons.append('source-too-old')
            if r.get('indexed_content_hash') and r['indexed_content_hash'] != r['content_hash']: reasons.append('hash-mismatch')
            out.append({'id':str(r['id']),'source_version':r['source_version'],'indexed_version':r['indexed_version'],'source_updated_at':r['source_updated_at'],'indexed_at':r['indexed_at'],'content_hash':r['content_hash'],'fresh':not reasons,'reason':','.join(reasons) if reasons else 'fresh'})
        total=len(out); fresh=sum(1 for x in out if x['fresh']); stale=total-fresh; ratio=(fresh/total if total else 0.0)
        status='pass' if total and ratio >= float(policy['minimum_fresh_ratio']) and stale == 0 else 'block'
        result={'status':status,'checked_at':now.isoformat(),'documents':out,'summary':{'total':total,'fresh':fresh,'stale':stale,'fresh_ratio':ratio}}
        Path(args.output).parent.mkdir(parents=True, exist_ok=True)
        Path(args.output).write_text(json.dumps(result, indent=2), encoding='utf-8')
        print(json.dumps(result['summary']))
        return 0 if status=='pass' else 1
    except Exception as e:
        print(f'freshness gate error: {e}', file=sys.stderr); return 2

if __name__=='__main__': sys.exit(main())
