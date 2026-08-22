#!/usr/bin/env python3
import argparse, json
from datetime import datetime, timezone

def walk(node, ops, rows):
    typ=(node.get("Node Type") or "").lower()
    if "seq scan" in typ or "bitmap heap scan" in typ: ops["full_scan_count"] += 1
    if "sort" in typ: ops["sort_count"] += 1
    if "hash" in typ: ops["hash_count"] += 1
    if "index scan" in typ: ops["key_lookup_count"] += 1
    if node.get("Sort Space Type") == "Disk" or node.get("Disk Usage",0): ops["spill_count"] += 1
    rows[0]=max(rows[0], float(node.get("Plan Rows",0) or 0)); rows[1]=max(rows[1], float(node.get("Actual Rows",0) or 0))
    for child in node.get("Plans",[]) or []: walk(child,ops,rows)

def main():
    p=argparse.ArgumentParser(description="Normalize PostgreSQL EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) into gate evidence")
    p.add_argument("explain_json"); p.add_argument("--query-id",required=True); p.add_argument("--dataset-profile",required=True)
    p.add_argument("--source-revision",required=True); p.add_argument("--environment",default=""); p.add_argument("--output",required=True)
    a=p.parse_args(); raw=json.load(open(a.explain_json,encoding="utf-8")); top=raw[0] if isinstance(raw,list) else raw
    plan=top.get("Plan",top); ops={"full_scan_count":0,"sort_count":0,"hash_count":0,"key_lookup_count":0,"spill_count":0}; rows=[0.0,0.0]
    walk(plan,ops,rows)
    shared_hits=float(plan.get("Shared Hit Blocks",0) or 0); shared_reads=float(plan.get("Shared Read Blocks",0) or 0)
    out={
      "query_id":a.query_id,"engine":"postgresql","captured_at":datetime.now(timezone.utc).isoformat(),
      "dataset_profile":a.dataset_profile,"source_revision":a.source_revision,"environment":a.environment,
      "metrics":{"duration_ms":float(top.get("Execution Time",0) or 0),"cpu_ms":float(top.get("Execution Time",0) or 0),"logical_reads":shared_hits+shared_reads,"estimated_rows":rows[0],"actual_rows":rows[1]},
      "operators":ops,"notes":["cpu_ms uses execution time as a conservative proxy unless a separate CPU measurement is supplied; verify critical conclusions against original EXPLAIN output."]}
    json.dump(out,open(a.output,"w",encoding="utf-8"),indent=2); print(a.output)
if __name__=="__main__": main()
