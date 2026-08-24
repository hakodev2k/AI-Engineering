#!/usr/bin/env python3
import argparse, json, os, re, subprocess, sys, time
from pathlib import Path


def ps_rows():
    try:
        out = subprocess.check_output(["ps","-axo","pid=,ppid=,rss=,etimes=,command="], text=True, stderr=subprocess.STDOUT)
    except Exception as e:
        raise RuntimeError(f"ps failed: {e}")
    rows=[]
    for line in out.splitlines():
        parts=line.strip().split(None,4)
        if len(parts)<5: continue
        try:
            pid,ppid,rss,age=map(int,parts[:4])
        except ValueError: continue
        rows.append({"pid":pid,"ppid":ppid,"rss_kb":rss,"age_s":age,"command":parts[4]})
    return rows


def select(rows, pattern):
    rx=re.compile(pattern,re.I)
    me=os.getpid()
    return [r for r in rows if r["pid"]!=me and rx.search(r["command"])]


def snapshot(pattern):
    rows=select(ps_rows(),pattern)
    return {"timestamp":time.time(),"pattern":pattern,"count":len(rows),"tree_rss_kb":sum(r["rss_kb"] for r in rows),"processes":rows}


def cmd_snapshot(a):
    data=snapshot(a.match)
    Path(a.out).write_text(json.dumps(data,indent=2),encoding="utf-8")
    print(json.dumps({"count":data["count"],"tree_rss_mb":round(data["tree_rss_kb"]/1024,1),"out":a.out}))
    return 0


def cmd_compare(a):
    p=Path(a.baseline)
    if not p.is_file():
        print(f"baseline not found: {p}",file=sys.stderr); return 1
    try: base=json.loads(p.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"invalid baseline: {e}",file=sys.stderr); return 1
    if a.cooldown_seconds>0: time.sleep(a.cooldown_seconds)
    cur=snapshot(a.match)
    growth_mb=(cur["tree_rss_kb"]-int(base.get("tree_rss_kb",0)))/1024
    stale=[r for r in cur["processes"] if r["age_s"]>=a.stale_age_seconds]
    report={"baseline_rss_mb":round(int(base.get("tree_rss_kb",0))/1024,1),"current_rss_mb":round(cur["tree_rss_kb"]/1024,1),"growth_mb":round(growth_mb,1),"baseline_count":int(base.get("count",0)),"current_count":cur["count"],"stale_count":len(stale),"stale_pids":[r["pid"] for r in stale],"limits":{"max_growth_mb":a.max_growth_mb,"max_stale":a.max_stale,"stale_age_seconds":a.stale_age_seconds}}
    print(json.dumps(report,indent=2))
    return 2 if growth_mb>a.max_growth_mb or len(stale)>a.max_stale else 0


def build():
    p=argparse.ArgumentParser(description="Read-only AI worker process memory guard")
    s=p.add_subparsers(dest="cmd",required=True)
    x=s.add_parser("snapshot"); x.add_argument("--match",required=True); x.add_argument("--out",required=True); x.set_defaults(fn=cmd_snapshot)
    c=s.add_parser("compare"); c.add_argument("--baseline",required=True); c.add_argument("--match",required=True); c.add_argument("--cooldown-seconds",type=int,default=0); c.add_argument("--max-growth-mb",type=float,default=512); c.add_argument("--max-stale",type=int,default=2); c.add_argument("--stale-age-seconds",type=int,default=3600); c.set_defaults(fn=cmd_compare)
    return p

if __name__=="__main__":
    try: sys.exit(build().parse_args().fn(build().parse_args()))
    except KeyboardInterrupt: sys.exit(130)
    except Exception as e: print(f"error: {e}",file=sys.stderr); sys.exit(1)
