#!/usr/bin/env python3
import argparse,json,sys
from pathlib import Path

def load(p):
    try: return json.loads(Path(p).read_text(encoding='utf-8'))
    except Exception as e: raise SystemExit(f'cannot read {p}: {e}')

def index(d): return {x['id']:x for x in d.get('scenarios',[])}

def main():
    ap=argparse.ArgumentParser(description='Compare primary and fallback LLM evaluation results.')
    ap.add_argument('primary'); ap.add_argument('fallback')
    ap.add_argument('--max-score-drop',type=float,default=.05)
    ap.add_argument('--max-cost-multiplier',type=float,default=1.5)
    ap.add_argument('--max-latency-multiplier',type=float,default=1.75)
    ap.add_argument('--out',default='fallback-parity-report.json')
    a=ap.parse_args(); p,f=load(a.primary),load(a.fallback); pi,fi=index(p),index(f)
    missing=sorted(set(pi)-set(fi)); findings=[]; ok=not missing
    for sid in sorted(set(pi)&set(fi)):
        x,y=pi[sid],fi[sid]; reasons=[]
        if x['passed'] and not y['passed']: reasons.append('fallback_failed_required_behavior')
        if x['score']-y['score']>a.max_score_drop: reasons.append('score_drop')
        if x['cost_usd']>0 and y['cost_usd']/x['cost_usd']>a.max_cost_multiplier: reasons.append('cost_regression')
        if x['latency_ms']>0 and y['latency_ms']/x['latency_ms']>a.max_latency_multiplier: reasons.append('latency_regression')
        if reasons: ok=False
        findings.append({'scenario':sid,'status':'pass' if not reasons else 'fail','reasons':reasons,'primary':x,'fallback':y})
    report={'status':'pass' if ok else 'fail','primary_model':p.get('model'),'fallback_model':f.get('model'),'missing_scenarios':missing,'findings':findings}
    Path(a.out).write_text(json.dumps(report,indent=2)+"\n",encoding='utf-8'); print(json.dumps(report,indent=2)); return 0 if ok else 2
if __name__=='__main__': sys.exit(main())
