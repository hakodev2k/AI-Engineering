#!/usr/bin/env python3
import argparse, json, sys

ALLOWED_RISK={"low","medium","high","critical"}
ALLOWED_STATE={"planned","ready","blocked","deployed","rolled-back","verified"}
ALLOWED_COMPAT={"compatible","requires-ordering","breaking","unknown"}

def topo(nodes, edges):
    incoming={n:0 for n in nodes}; outgoing={n:[] for n in nodes}
    for a,b in edges:
        outgoing[a].append(b); incoming[b]+=1
    q=sorted([n for n,v in incoming.items() if v==0]); out=[]
    while q:
        n=q.pop(0); out.append(n)
        for m in sorted(outgoing[n]):
            incoming[m]-=1
            if incoming[m]==0: q.append(m); q.sort()
    return out if len(out)==len(nodes) else None

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("plan"); ap.add_argument("--output"); a=ap.parse_args()
    try:
        plan=json.load(open(a.plan,encoding="utf-8"))
    except Exception as e:
        print(f"load error: {e}",file=sys.stderr); return 2
    errors=[]
    if plan.get("risk") not in ALLOWED_RISK: errors.append("invalid risk")
    repos=plan.get("repositories") or []
    names=[r.get("name") for r in repos]
    if len(repos)<2: errors.append("at least two repositories required")
    if None in names or len(names)!=len(set(names)): errors.append("repository names must be unique and non-empty")
    for r in repos:
        if not isinstance(r.get("revision"),str) or len(r.get("revision",""))<7: errors.append(f"invalid revision for {r.get('name')}")
        if r.get("state") not in ALLOWED_STATE: errors.append(f"invalid state for {r.get('name')}")
        if not isinstance(r.get("changes"),list) or not isinstance(r.get("verification"),list): errors.append(f"invalid changes/verification for {r.get('name')}")
    dep=[]
    for e in plan.get("edges") or []:
        f,t=e.get("from"),e.get("to")
        if f not in names or t not in names: errors.append(f"edge references unknown repo: {f}->{t}"); continue
        if f==t: errors.append(f"self dependency: {f}")
        if e.get("compatibility") not in ALLOWED_COMPAT: errors.append(f"invalid compatibility: {f}->{t}")
        dep.append((f,t))
    order=topo(names,dep) if names and len(names)==len(set(names)) else None
    if order is None: errors.append("dependency graph contains cycle")
    rollout=plan.get("rollout") or []; rollback=plan.get("rollback") or []
    if sorted(rollout)!=sorted(names): errors.append("rollout must contain every repository exactly once")
    if len(rollout)!=len(set(rollout)): errors.append("rollout contains duplicates")
    if plan.get("risk") in {"medium","high","critical"} and sorted(rollback)!=sorted(names): errors.append("rollback must contain every repository for medium+ risk")
    for f,t in dep:
        comp=next(e["compatibility"] for e in plan["edges"] if e["from"]==f and e["to"]==t)
        if comp in {"requires-ordering","breaking"} and rollout and rollout.index(f)>rollout.index(t):
            errors.append(f"rollout violates producer-before-consumer ordering: {f}->{t}")
    result={"valid":not errors,"errors":errors,"topological_order":order}
    text=json.dumps(result,indent=2)
    if a.output: open(a.output,"w",encoding="utf-8").write(text+"\n")
    else: print(text)
    return 0 if not errors else 3
if __name__=="__main__": raise SystemExit(main())
