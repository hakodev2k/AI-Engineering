#!/usr/bin/env python3
"""Check a profile_context.py JSON report against context budgets."""
import argparse,json,sys
from pathlib import Path

def load(p):
 try:return json.loads(Path(p).read_text(encoding="utf-8"))
 except (OSError,json.JSONDecodeError) as e: print(f"ERROR: {e}",file=sys.stderr);sys.exit(2)

def main():
 p=argparse.ArgumentParser();p.add_argument("--profile",required=True);p.add_argument("--budget",required=True);p.add_argument("--phase",choices=["pre","post"],default="pre");a=p.parse_args();m=load(a.profile);b=load(a.budget);fail=[]
 if m.get("data_url_chars",0)>b["max_data_url_chars"]:fail.append("data-url budget exceeded")
 if m.get("tool_output_chars",0)>b["max_tool_output_chars"]:fail.append("tool-output budget exceeded")
 if m.get("duplicate_chars",0)>b["max_duplicate_chars"]:fail.append("duplicate-payload budget exceeded")
 turns=m.get("turns",0); comps=m.get("compactions",0)
 if turns and comps*10>turns*b["max_compactions_per_10_turns"]:fail.append("compaction frequency exceeded")
 if a.phase=="post":
  if m.get("utilization_ratio",1)>b["post_compaction_target_ratio"]:fail.append("post-compaction utilization above target")
  if m.get("headroom_tokens",0)<b["minimum_headroom_tokens"]:fail.append("post-compaction headroom below minimum")
 result={"decision":"fail" if fail else "pass","phase":a.phase,"findings":fail}
 print(json.dumps(result,indent=2));return 1 if fail else 0
if __name__=="__main__":sys.exit(main())
