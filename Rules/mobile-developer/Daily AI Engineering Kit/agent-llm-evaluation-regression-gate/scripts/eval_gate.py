#!/usr/bin/env python3
import argparse,json,statistics,sys
from pathlib import Path

def load(p):
    rows=[]
    with open(p,encoding='utf-8') as f:
        for n,line in enumerate(f,1):
            if line.strip():
                try: rows.append(json.loads(line))
                except Exception as e: raise ValueError(f'{p}:{n}: {e}')
    if not rows: raise ValueError(f'{p}: no evaluation rows')
    return rows

def pct(xs,p):
    if not xs:return 0.0
    xs=sorted(xs); return xs[min(len(xs)-1,max(0,int((len(xs)-1)*p)))]

def metrics(rows,weights):
    passed=sum(r.get('status')=='pass' for r in rows)/len(rows)
    scores=[]
    for r in rows:
        d=r.get('dimensions',{}); denom=sum(weights.get(k,0) for k in d)
        if denom: scores.append(sum(d[k]*weights.get(k,0) for k in d)/denom)
    return {'count':len(rows),'pass_rate':passed,'mean_score':statistics.fmean(scores) if scores else 0,
      'p95_latency_ms':pct([r.get('latency_ms',0) for r in rows],.95),
      'mean_cost_usd':statistics.fmean([r.get('cost_usd',0) for r in rows]),
      'critical_failures':sum(r.get('critical',False) and r.get('status')!='pass' for r in rows)}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--baseline',required=True); ap.add_argument('--candidate',required=True); ap.add_argument('--config',required=True); ap.add_argument('--out',default='eval-gate-report.json'); a=ap.parse_args()
    try:
        import yaml
        cfg=yaml.safe_load(Path(a.config).read_text(encoding='utf-8'))
        b,c=load(a.baseline),load(a.candidate); ids={r['case_id'] for r in b}; cids={r['case_id'] for r in c}
        if ids!=cids: raise ValueError(f'case set mismatch: missing={sorted(ids-cids)} extra={sorted(cids-ids)}')
        req=cfg.get('required_dimensions',[])
        for r in c:
            missing=[x for x in req if x not in r.get('dimensions',{})]
            if missing: raise ValueError(f"{r['case_id']}: missing dimensions {missing}")
        bm,cm=metrics(b,cfg['weights']); t=cfg['thresholds']; failures=[]
        if cm['pass_rate']<t['min_pass_rate']: failures.append('candidate pass rate below minimum')
        if bm['pass_rate']-cm['pass_rate']>t['max_pass_rate_drop']: failures.append('pass rate regression')
        if bm['mean_score']-cm['mean_score']>t['max_mean_score_drop']: failures.append('mean score regression')
        if cm['critical_failures']>t['max_critical_regressions']: failures.append('critical regression')
        if bm['p95_latency_ms']>0 and (cm['p95_latency_ms']/bm['p95_latency_ms']-1)*100>t['max_p95_latency_increase_pct']: failures.append('p95 latency regression')
        if bm['mean_cost_usd']>0 and (cm['mean_cost_usd']/bm['mean_cost_usd']-1)*100>t['max_mean_cost_increase_pct']: failures.append('mean cost regression')
        report={'status':'pass' if not failures else 'fail','baseline':bm,'candidate':cm,'failures':failures}
        Path(a.out).write_text(json.dumps(report,indent=2),encoding='utf-8'); print(json.dumps(report,indent=2)); return 0 if not failures else 2
    except Exception as e: print(f'eval gate error: {e}',file=sys.stderr); return 3
if __name__=='__main__': sys.exit(main())
