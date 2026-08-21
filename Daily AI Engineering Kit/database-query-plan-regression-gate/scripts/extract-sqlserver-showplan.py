#!/usr/bin/env python3
import argparse, json, xml.etree.ElementTree as ET
from datetime import datetime, timezone

def lname(tag): return tag.split('}',1)[-1]
def f(v, default=0.0):
    try: return float(v)
    except (TypeError,ValueError): return default

def main():
    p=argparse.ArgumentParser(description="Normalize SQL Server Showplan XML plus measured metrics into gate evidence")
    p.add_argument("plan_xml"); p.add_argument("--query-id",required=True); p.add_argument("--dataset-profile",required=True)
    p.add_argument("--source-revision",required=True); p.add_argument("--environment",default="")
    p.add_argument("--duration-ms",type=float,required=True); p.add_argument("--cpu-ms",type=float,required=True)
    p.add_argument("--logical-reads",type=float,required=True); p.add_argument("--output",required=True)
    a=p.parse_args(); root=ET.parse(a.plan_xml).getroot()
    ops={"full_scan_count":0,"sort_count":0,"hash_count":0,"key_lookup_count":0,"spill_count":0}
    est=act=0.0
    for e in root.iter():
        if lname(e.tag)=="RelOp":
            phy=(e.attrib.get("PhysicalOp") or "").lower(); log=(e.attrib.get("LogicalOp") or "").lower()
            if "scan" in phy: ops["full_scan_count"] += 1
            if "sort" in phy: ops["sort_count"] += 1
            if "hash" in phy: ops["hash_count"] += 1
            if "key lookup" in phy or "key lookup" in log: ops["key_lookup_count"] += 1
            est=max(est, f(e.attrib.get("EstimateRows")))
        if lname(e.tag)=="RunTimeCountersPerThread":
            act=max(act, f(e.attrib.get("ActualRows")))
            spills=int(f(e.attrib.get("SpillLevel")))
            if spills>0: ops["spill_count"] += 1
        if lname(e.tag) in ("SpillToTempDb","SpillOccurred"): ops["spill_count"] += 1
    out={
      "query_id":a.query_id,"engine":"sqlserver","captured_at":datetime.now(timezone.utc).isoformat(),
      "dataset_profile":a.dataset_profile,"source_revision":a.source_revision,"environment":a.environment,
      "metrics":{"duration_ms":a.duration_ms,"cpu_ms":a.cpu_ms,"logical_reads":a.logical_reads,"estimated_rows":est,"actual_rows":act},
      "operators":ops,"notes":["Operator counts are normalized heuristics from SQL Server Showplan XML; verify important findings against the original plan."]}
    with open(a.output,"w",encoding="utf-8") as fh: json.dump(out,fh,indent=2)
    print(a.output)
if __name__=="__main__": main()
