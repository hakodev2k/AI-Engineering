#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

REQUIRED_TOP = {"tables"}

def fail(msg):
    print(f"schema-drift: {msg}", file=sys.stderr); return 1

def load(path):
    try:
        data=json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as e:
        raise ValueError(f"cannot read {path}: {e}")
    if not isinstance(data,dict) or not REQUIRED_TOP <= data.keys() or not isinstance(data["tables"],list):
        raise ValueError(f"{path}: root must contain tables array")
    names=set()
    for t in data["tables"]:
        if not isinstance(t,dict) or not isinstance(t.get("name"),str) or not isinstance(t.get("columns"),list):
            raise ValueError(f"{path}: each table needs name and columns")
        if t["name"] in names: raise ValueError(f"{path}: duplicate table {t['name']}")
        names.add(t["name"])
        cols=set()
        for c in t["columns"]:
            if not isinstance(c,dict) or not all(k in c for k in ("name","type","nullable")):
                raise ValueError(f"{path}: invalid column in {t['name']}")
            if c["name"] in cols: raise ValueError(f"{path}: duplicate column {t['name']}.{c['name']}")
            cols.add(c["name"])
    return data

def table_map(d): return {t["name"]:t for t in d["tables"]}
def col_map(t): return {c["name"]:c for c in t.get("columns",[])}
def idx_map(t): return {i["name"]:i for i in t.get("indexes",[]) if isinstance(i,dict) and "name" in i}

def finding(kind,obj,before=None,after=None,risk="medium",approval=False):
    return {"kind":kind,"object":obj,"before":before,"after":after,"risk":risk,"approval_required":approval}

def diff(base,cand):
    out=[]; bt=table_map(base); ct=table_map(cand)
    for n in sorted(bt.keys()-ct.keys()): out.append(finding("table_removed",n,bt[n],None,"critical",True))
    for n in sorted(ct.keys()-bt.keys()): out.append(finding("table_added",n,None,ct[n],"low",False))
    for tn in sorted(bt.keys() & ct.keys()):
        bc,cc=col_map(bt[tn]),col_map(ct[tn])
        for n in sorted(bc.keys()-cc.keys()): out.append(finding("column_removed",f"{tn}.{n}",bc[n],None,"critical",True))
        for n in sorted(cc.keys()-bc.keys()): out.append(finding("column_added",f"{tn}.{n}",None,cc[n],"medium",not bool(cc[n].get("nullable",True)) and cc[n].get("default") is None))
        for n in sorted(bc.keys() & cc.keys()):
            b,c=bc[n],cc[n]
            if b.get("type") != c.get("type"): out.append(finding("column_type_changed",f"{tn}.{n}",b.get("type"),c.get("type"),"high",True))
            if bool(b.get("nullable",True)) != bool(c.get("nullable",True)):
                tightening=bool(b.get("nullable",True)) and not bool(c.get("nullable",True))
                out.append(finding("column_nullability_changed",f"{tn}.{n}",b.get("nullable",True),c.get("nullable",True),"high" if tightening else "medium",tightening))
        bi,ci=idx_map(bt[tn]),idx_map(ct[tn])
        for n in sorted(bi.keys()-ci.keys()): out.append(finding("index_removed",f"{tn}.{n}",bi[n],None,"medium",False))
        for n in sorted(ci.keys()-bi.keys()): out.append(finding("index_added",f"{tn}.{n}",None,ci[n],"low",False))
        for n in sorted(bi.keys() & ci.keys()):
            if bi[n] != ci[n]: out.append(finding("index_changed",f"{tn}.{n}",bi[n],ci[n],"medium",False))
    return out

def main():
    p=argparse.ArgumentParser(description="Deterministic logical database schema drift gate")
    p.add_argument("--baseline",required=True); p.add_argument("--candidate",required=True); p.add_argument("--report",required=True)
    a=p.parse_args()
    try: b,c=load(a.baseline),load(a.candidate)
    except ValueError as e: return fail(str(e))
    findings=diff(b,c); blocking=any(x["approval_required"] for x in findings)
    report={"version":1,"status":"blocked" if blocking else "pass","blocking":blocking,"finding_count":len(findings),"findings":findings}
    rp=Path(a.report); rp.parent.mkdir(parents=True,exist_ok=True); rp.write_text(json.dumps(report,indent=2,sort_keys=True)+"\n",encoding="utf-8")
    print(json.dumps({"status":report["status"],"finding_count":len(findings),"report":str(rp)}))
    return 2 if blocking else 0

if __name__=="__main__": sys.exit(main())
