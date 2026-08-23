#!/usr/bin/env python3
import argparse,json,math,statistics,sys
from collections import defaultdict
from pathlib import Path
MIB=1024*1024

def fail(msg): print(json.dumps({'status':'error','error':msg})); return 3

def load(path):
    groups=defaultdict(list)
    for n,line in enumerate(Path(path).read_text().splitlines(),1):
        if not line.strip(): continue
        o=json.loads(line)
        for k in ('ts','pid','ppid','rss_bytes'):
            if k not in o: raise ValueError(f'line {n} missing {k}')
        o['ts']=float(o['ts']); o['pid']=int(o['pid']); o['ppid']=int(o['ppid']); o['rss_bytes']=int(o['rss_bytes'])
        if o['rss_bytes']<0: raise ValueError(f'line {n} negative rss')
        o['label']=str(o.get('label',o['pid']))
        groups[o['ts']].append(o)
    if len(groups)<2: raise ValueError('need at least two timestamps')
    return groups

def descendants(rows,root):
    bypid={r['pid']:r for r in rows}
    if root not in bypid: raise ValueError(f'root pid {root} missing at timestamp')
    owned={root}; changed=True
    while changed:
        changed=False
        for r in rows:
            if r['pid'] not in owned and r['ppid'] in owned:
                owned.add(r['pid']); changed=True
    return [bypid[p] for p in owned]

def slope(xs,ys):
    xm=sum(xs)/len(xs); ym=sum(ys)/len(ys); den=sum((x-xm)**2 for x in xs)
    return 0.0 if den==0 else sum((x-xm)*(y-ym) for x,y in zip(xs,ys))/den

def summarize(groups,root):
    times=sorted(groups); rootv=[]; treev=[]; childv=[]; counts=[]; contrib=defaultdict(int)
    for t in times:
        own=descendants(groups[t],root); rr=next(r['rss_bytes'] for r in own if r['pid']==root); tr=sum(r['rss_bytes'] for r in own)
        rootv.append(rr); treev.append(tr); childv.append(tr-rr); counts.append(len(own)-1)
        for r in own: contrib[r['label']]=max(contrib[r['label']],r['rss_bytes'])
    duration=max(0.0,times[-1]-times[0]); sl=slope(times,[v/MIB for v in treev])*60.0
    top=sorted(({'label':k,'peak_mib':round(v/MIB,3)} for k,v in contrib.items()),key=lambda x:(-x['peak_mib'],x['label']))[:10]
    return {'samples':len(times),'duration_seconds':round(duration,3),'root_start_mib':round(rootv[0]/MIB,3),'root_end_mib':round(rootv[-1]/MIB,3),'child_start_mib':round(childv[0]/MIB,3),'child_end_mib':round(childv[-1]/MIB,3),'tree_start_mib':round(treev[0]/MIB,3),'tree_end_mib':round(treev[-1]/MIB,3),'tree_peak_mib':round(max(treev)/MIB,3),'tree_growth_mib':round((treev[-1]-treev[0])/MIB,3),'tree_slope_mib_per_min':round(sl,3),'max_descendants':max(counts),'top_contributors':top}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--input',required=True); ap.add_argument('--root-pid',required=True,type=int); ap.add_argument('--policy',required=True); ap.add_argument('--baseline'); a=ap.parse_args()
    try:
        p=json.loads(Path(a.policy).read_text()); cur=summarize(load(a.input),a.root_pid); base=summarize(load(a.baseline),a.root_pid) if a.baseline else None
        limits={k:float(v) for k,v in p.items()}
    except Exception as e: return fail(str(e))
    violations=[]
    checks=[('tree_peak_mib','max_peak_tree_mib'),('tree_growth_mib','max_tree_growth_mib'),('tree_slope_mib_per_min','max_tree_slope_mib_per_min')]
    for metric,lim in checks:
        if lim in limits and cur[metric]>limits[lim]: violations.append({'metric':metric,'value':cur[metric],'limit':limits[lim]})
    delta=None
    if base:
        delta={'peak_delta_mib':round(cur['tree_peak_mib']-base['tree_peak_mib'],3),'growth_delta_mib':round(cur['tree_growth_mib']-base['tree_growth_mib'],3)}
        for metric,lim in [('peak_delta_mib','max_baseline_peak_delta_mib'),('growth_delta_mib','max_baseline_growth_delta_mib')]:
            if lim in limits and delta[metric]>limits[lim]: violations.append({'metric':metric,'value':delta[metric],'limit':limits[lim]})
    out={'status':'regression' if violations else 'pass','candidate':cur,'baseline':base,'delta':delta,'violations':violations}; print(json.dumps(out,indent=2,sort_keys=True)); return 2 if violations else 0
if __name__=='__main__': sys.exit(main())
