#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

def load(path): return json.loads(Path(path).read_text(encoding="utf-8"))
def ratio(new, old):
    if new is None or old is None: return None
    if old == 0: return 0.0 if new == 0 else None
    return (new-old)/old

def main():
    p=argparse.ArgumentParser()
    for x in ("suite","policy","baseline","candidate","output"): p.add_argument(f"--{x}", required=True)
    a=p.parse_args()
    try:
        suite,policy,base,cand=map(load,[a.suite,a.policy,a.baseline,a.candidate])
        if not (base["suite_id"]==cand["suite_id"]==suite["suite_id"] and base["suite_version"]==cand["suite_version"]==suite["version"]):
            raise ValueError("suite identity mismatch")
        bmap={x["id"]:x for x in base["cases"]}; cmap={x["id"]:x for x in cand["cases"]}
        reasons=[]; cases=[]; status="verified"; review=False
        for case in suite["cases"]:
            cid=case["id"]; b=bmap.get(cid); c=cmap.get(cid)
            required=policy["critical_minimum_repetitions"] if case["severity"]=="critical" else policy["minimum_repetitions"]
            if not b or not c or b.get("run_count",0)<required or c.get("run_count",0)<required:
                cases.append({"id":cid,"status":"blocked","reason":"insufficient runs"}); status="blocked"; reasons.append(f"{cid}: insufficient runs"); continue
            qdrop=b["quality_mean"]-c["quality_mean"]; wdrop=b["quality_worst"]-c["quality_worst"]
            cstatus="pass"; creasons=[]
            if case["severity"]=="critical" and policy.get("block_on_critical_assertion_failure",True) and c["assertion_pass_rate"]<1.0:
                cstatus="regressed"; creasons.append("critical deterministic assertion failure")
            if case["severity"]=="critical" and wdrop>policy["maximum_critical_worst_run_drop"]:
                cstatus="regressed"; creasons.append("critical worst-run quality drop exceeded")
            if qdrop>policy["maximum_quality_drop"]:
                cstatus="regressed"; creasons.append("case quality drop exceeded")
            if case.get("high_impact"): review=True
            cases.append({"id":cid,"status":cstatus,"quality_drop":qdrop,"worst_run_drop":wdrop,"candidate_assertion_pass_rate":c["assertion_pass_rate"],"reasons":creasons})
            if cstatus=="regressed": status="regressed"; reasons.extend(f"{cid}: {r}" for r in creasons)
        quality_drop=base["quality"]-cand["quality"]
        if cand["quality"]<policy["minimum_candidate_quality"]:
            status="regressed"; reasons.append("candidate aggregate quality below minimum")
        if quality_drop>policy["maximum_quality_drop"]:
            status="regressed"; reasons.append("aggregate quality drop exceeded")
        cost_inc=ratio(cand.get("cost_mean"),base.get("cost_mean")); lat_inc=ratio(cand.get("latency_mean_ms"),base.get("latency_mean_ms"))
        if cost_inc is None and not policy.get("allow_missing_cost",True): status="blocked"; reasons.append("cost evidence missing/incomparable")
        elif cost_inc is not None and cost_inc>policy["maximum_cost_increase_ratio"]: status="regressed"; reasons.append("cost increase exceeded")
        if lat_inc is None and not policy.get("allow_missing_latency",True): status="blocked"; reasons.append("latency evidence missing/incomparable")
        elif lat_inc is not None and lat_inc>policy["maximum_latency_increase_ratio"]: status="regressed"; reasons.append("latency increase exceeded")
        if status=="verified" and review and policy.get("require_independent_review_for_high_impact",True):
            status="inconclusive"; reasons.append("independent review required for high-impact cases")
        report={"suite_id":suite["suite_id"],"suite_version":suite["version"],"status":status,"summary":{"baseline_quality":base["quality"],"candidate_quality":cand["quality"],"quality_drop":quality_drop,"cost_increase_ratio":cost_inc,"latency_increase_ratio":lat_inc},"cases":cases,"requires_independent_review":review,"reasons":reasons}
        Path(a.output).parent.mkdir(parents=True, exist_ok=True); Path(a.output).write_text(json.dumps(report,indent=2),encoding="utf-8")
        print(json.dumps(report,indent=2)); return 0 if status=="verified" else 10
    except Exception as e:
        print(json.dumps({"status":"blocked","error":str(e)})); return 2
if __name__=="__main__": sys.exit(main())
