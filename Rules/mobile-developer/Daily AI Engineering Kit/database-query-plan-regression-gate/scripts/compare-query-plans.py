#!/usr/bin/env python3
import argparse, json, hashlib, sys
from datetime import datetime, timezone

def canonical(obj): return json.dumps(obj,sort_keys=True,separators=(",",":"),ensure_ascii=False)
def pct(old,new):
    if old == 0: return 0.0 if new == 0 else 999999.0
    return ((new-old)/old)*100.0

def est_ratio(m):
    est=float(m.get("estimated_rows",0)); act=float(m.get("actual_rows",0))
    if est<=0 and act<=0: return 1.0
    if est<=0 or act<=0: return 999999.0
    return max(est/act,act/est)

def parse_time(value):
    dt=datetime.fromisoformat(value.replace("Z","+00:00"))
    if dt.tzinfo is None: raise ValueError("timestamp must include timezone")
    return dt.astimezone(timezone.utc)

def main():
    p=argparse.ArgumentParser(); p.add_argument("baseline"); p.add_argument("candidate"); p.add_argument("--policy",required=True); p.add_argument("--output",required=True); a=p.parse_args()
    b=json.load(open(a.baseline,encoding="utf-8")); c=json.load(open(a.candidate,encoding="utf-8")); pol=json.load(open(a.policy,encoding="utf-8"))
    blockers=[]; warnings=[]
    if pol["comparison"].get("require_same_engine") and b["engine"]!=c["engine"]: blockers.append("engine-mismatch")
    if pol["comparison"].get("require_same_query_id") and b["query_id"]!=c["query_id"]: blockers.append("query-id-mismatch")
    if pol["comparison"].get("require_same_dataset_profile") and b["dataset_profile"]!=c["dataset_profile"]: blockers.append("dataset-profile-mismatch")

    max_age=pol.get("comparison",{}).get("max_evidence_age_minutes")
    if max_age is not None:
        now=datetime.now(timezone.utc)
        for label,evidence in (("baseline",b),("candidate",c)):
            try:
                captured=parse_time(evidence["captured_at"])
                age_minutes=(now-captured).total_seconds()/60.0
                if age_minutes < -5:
                    blockers.append(f"{label}-evidence-from-future")
                elif age_minutes > float(max_age):
                    blockers.append(f"{label}-evidence-stale")
            except (KeyError,ValueError,TypeError):
                blockers.append(f"{label}-evidence-time-invalid")

    th=pol["thresholds"]
    deltas={
      "duration_pct":pct(b["metrics"]["duration_ms"],c["metrics"]["duration_ms"]),
      "cpu_pct":pct(b["metrics"]["cpu_ms"],c["metrics"]["cpu_ms"]),
      "logical_reads_pct":pct(b["metrics"]["logical_reads"],c["metrics"]["logical_reads"]),
      "estimate_ratio_baseline":est_ratio(b["metrics"]),
      "estimate_ratio_candidate":est_ratio(c["metrics"]),
      "operator_delta":{k:c["operators"][k]-b["operators"][k] for k in b["operators"]}
    }
    checks=[("duration_pct","duration_pct_warn","duration_pct_block"),("cpu_pct","cpu_pct_warn","cpu_pct_block"),("logical_reads_pct","logical_reads_pct_warn","logical_reads_pct_block")]
    for metric,warn,block in checks:
        v=deltas[metric]
        if v>=th[block]: blockers.append(f"{metric}-regression")
        elif v>=th[warn]: warnings.append(f"{metric}-warning")
    if deltas["estimate_ratio_candidate"]>=th["estimate_ratio_block"]: blockers.append("cardinality-estimate-regression")
    elif deltas["estimate_ratio_candidate"]>=th["estimate_ratio_warn"]: warnings.append("cardinality-estimate-warning")
    if th.get("new_full_scan_blocks") and deltas["operator_delta"]["full_scan_count"]>0: blockers.append("new-full-scan")
    if th.get("new_spill_blocks") and deltas["operator_delta"]["spill_count"]>0: blockers.append("new-spill")
    blockers=sorted(set(blockers)); warnings=sorted(set(warnings))
    risk="critical" if blockers and ("new-spill" in blockers or "new-full-scan" in blockers) else "high" if blockers else "medium" if warnings else "low"
    status="blocked" if blockers else "review-required" if warnings else "pass"
    fp=hashlib.sha256(canonical({"baseline":b,"candidate":c,"policy":pol}).encode()).hexdigest()
    out={"comparison_fingerprint":fp,"policy_version":pol["version"],"query_id":c["query_id"],"status":status,"risk":risk,"blockers":blockers,"warnings":warnings,"deltas":deltas,"baseline_revision":b["source_revision"],"candidate_revision":c["source_revision"],"generated_at":datetime.now(timezone.utc).isoformat()}
    json.dump(out,open(a.output,"w",encoding="utf-8"),indent=2); print(status)
    sys.exit(2 if status=="blocked" else 0)
if __name__=="__main__": main()
