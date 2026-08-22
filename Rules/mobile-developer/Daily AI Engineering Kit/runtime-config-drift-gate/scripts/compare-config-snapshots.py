#!/usr/bin/env python3
import argparse, json, sys
from datetime import datetime, timezone

def load(path):
    with open(path,"r",encoding="utf-8") as f: return json.load(f)

def normalize(value, policy):
    n=policy.get("normalization",{})
    if isinstance(value,str):
        if n.get("trim_strings",True): value=value.strip()
        low=value.lower()
        if n.get("lowercase_boolean_strings",True) and low in ("true","false"): return low=="true"
        if low in [x.lower() for x in n.get("null_strings",[])]: return None
        if n.get("numeric_string_equivalence",True):
            try:
                if "." in value: return float(value)
                return int(value)
            except Exception: pass
    if isinstance(value,list): return [normalize(x,policy) for x in value]
    if isinstance(value,dict): return {k:normalize(v,policy) for k,v in sorted(value.items())}
    return value

def severity(kind,key,expected,policy):
    sev=policy.get("severity",{}).get(kind,"medium")
    if expected and expected.get("required") and kind=="missing-runtime": sev=policy.get("required_key_missing_severity","critical")
    if expected and expected.get("classification")=="secret" and kind in {"fingerprint-mismatch","presence-mismatch","missing-runtime"}:
        sev=policy.get("secret_mismatch_severity","critical")
    keylow=key.lower()
    if any(p.lower() in keylow for p in policy.get("critical_key_patterns",[])) and sev in {"low","medium"}: sev="high"
    return sev

def main():
    p=argparse.ArgumentParser(); p.add_argument("--expected",required=True); p.add_argument("--runtime",required=True); p.add_argument("--policy",required=True); p.add_argument("--output",required=True); a=p.parse_args()
    try: exp,run,policy=load(a.expected),load(a.runtime),load(a.policy)
    except Exception as e: print(f"ERROR: {e}",file=sys.stderr); return 2
    if exp.get("application")!=run.get("application") or exp.get("environment")!=run.get("environment"):
        print("ERROR: application/environment scope mismatch",file=sys.stderr); return 2
    em={x["key"]:x for x in exp.get("entries",[])}; rm={x["key"]:x for x in run.get("entries",[])}
    findings=[]
    for key in sorted(set(em)|set(rm)):
        e,r=em.get(key),rm.get(key)
        kinds=[]
        if e and not r: kinds=["missing-runtime"]
        elif r and not e: kinds=["unexpected-runtime"]
        else:
            if e.get("present")!=r.get("present"): kinds.append("presence-mismatch")
            if e.get("value_type")!=r.get("value_type") and e.get("present") and r.get("present"): kinds.append("type-mismatch")
            if e.get("source") and r.get("source") and e.get("source")!=r.get("source"): kinds.append("source-mismatch")
            if e.get("present") and r.get("present"):
                if e.get("classification")=="secret":
                    ef,rf=e.get("fingerprint"),r.get("fingerprint")
                    if ef is not None and rf is not None and ef!=rf: kinds.append("fingerprint-mismatch")
                elif "value" in e and "value" in r and normalize(e.get("value"),policy)!=normalize(r.get("value"),policy): kinds.append("value-mismatch")
        for kind in kinds:
            findings.append({"key":key,"kind":kind,"severity":severity(kind,key,e,policy),"classification":(e or r).get("classification"),"required":bool(e and e.get("required")),"expected_source":e.get("source") if e else None,"runtime_source":r.get("source") if r else None})
    report={"application":exp.get("application"),"environment":exp.get("environment"),"expected_producer":exp.get("producer"),"runtime_producer":run.get("producer"),"generated_at":datetime.now(timezone.utc).isoformat(),"findings":findings,"status":"drift" if findings else "clean"}
    with open(a.output,"w",encoding="utf-8") as f: json.dump(report,f,indent=2,sort_keys=True)
    print(json.dumps({"status":report["status"],"finding_count":len(findings)},indent=2)); return 0
if __name__=="__main__": raise SystemExit(main())
