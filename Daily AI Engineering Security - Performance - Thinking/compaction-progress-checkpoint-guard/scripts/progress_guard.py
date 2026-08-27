#!/usr/bin/env python3
import argparse, json, sys
from pathlib import Path

REQUIRED_CP={"task_id","goal","completed_steps","pending_steps","facts","rejected_hypotheses","progress_token","verification_status"}
REQUIRED_EVENT={"seq","action_signature","progress_token","completed_steps_count","evidence_ids"}

def read_json(path): return json.loads(Path(path).read_text(encoding="utf-8"))

def read_events(path):
    rows=[]
    for i,line in enumerate(Path(path).read_text(encoding="utf-8").splitlines(),1):
        if not line.strip(): continue
        try: r=json.loads(line)
        except Exception as e: raise ValueError(f"line {i}: invalid JSON: {e}")
        missing=REQUIRED_EVENT-r.keys()
        if missing: raise ValueError(f"line {i}: missing {','.join(sorted(missing))}")
        rows.append(r)
    return rows

def evaluate(checkpoint,events,window=3,max_no_progress_windows=2):
    missing=REQUIRED_CP-checkpoint.keys()
    if missing: raise ValueError("checkpoint missing "+",".join(sorted(missing)))
    if not events: return {"ok":True,"decision":"continue","reason":"no_post_compaction_events_yet","no_progress_windows":0}
    base_completed=len(checkpoint["completed_steps"]); base_token=checkpoint["progress_token"]; seen_evidence=set(); no_progress=0
    last_repeated=False
    for end in range(window,len(events)+1,window):
        chunk=events[end-window:end]; sigs=[e["action_signature"] for e in chunk]; last_repeated=len(set(sigs))==1
        new_evidence=set().union(*(set(e["evidence_ids"]) for e in chunk))-seen_evidence
        progress=any(e["progress_token"]!=base_token or int(e["completed_steps_count"])>base_completed for e in chunk) or bool(new_evidence)
        for e in chunk: seen_evidence.update(e["evidence_ids"])
        if progress:
            no_progress=0; base_token=chunk[-1]["progress_token"]; base_completed=max(base_completed,max(int(e["completed_steps_count"]) for e in chunk))
        else: no_progress+=1
        if no_progress>=max_no_progress_windows:
            return {"ok":False,"decision":"recover","reason":"bounded_no_progress_stop","no_progress_windows":no_progress,"last_window_repeated_action":last_repeated}
    return {"ok":True,"decision":"continue","no_progress_windows":no_progress,"last_window_repeated_action":last_repeated}

def main():
    ap=argparse.ArgumentParser(description="Bound post-compaction no-progress loops using observable state."); ap.add_argument("--checkpoint",required=True); ap.add_argument("--events",required=True); ap.add_argument("--window",type=int,default=3); ap.add_argument("--max-no-progress-windows",type=int,default=2); a=ap.parse_args()
    if a.window<1 or a.max_no_progress_windows<1: print("window values must be >= 1",file=sys.stderr); return 2
    try: r=evaluate(read_json(a.checkpoint),read_events(a.events),a.window,a.max_no_progress_windows)
    except Exception as e: print(json.dumps({"ok":False,"error":str(e)}),file=sys.stderr); return 2
    print(json.dumps(r,indent=2,sort_keys=True)); return 0 if r["ok"] else 3

if __name__=="__main__": raise SystemExit(main())
