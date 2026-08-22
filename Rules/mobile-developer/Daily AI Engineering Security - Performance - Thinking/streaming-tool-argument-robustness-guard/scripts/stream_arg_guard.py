#!/usr/bin/env python3
"""Validate and benchmark streamed tool-call argument aggregation.

JSONL event format:
{"type":"delta","data":"{\"path\":"}
{"type":"delta","data":"\"a.txt\"}"}
{"type":"final","data":"{\"path\":\"a.txt\"}"}

`type` is one of delta, snapshot, final. Final is authoritative when policy says so.
Exit codes: 0 success, 2 invalid input/config, 3 truncated, 4 budget exceeded, 5 invalid final payload.
"""
from __future__ import annotations
import argparse, hashlib, json, sys, time
from pathlib import Path

INVALID, TRUNCATED, BUDGET, BAD_FINAL = 2, 3, 4, 5


def load_json(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return value


def load_events(path: Path) -> list[dict]:
    events=[]
    try:
        lines=path.read_text(encoding="utf-8").splitlines()
    except OSError as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    for n,line in enumerate(lines,1):
        if not line.strip():
            continue
        try: event=json.loads(line)
        except json.JSONDecodeError as exc: raise ValueError(f"line {n}: {exc}") from exc
        if not isinstance(event,dict) or event.get("type") not in {"delta","snapshot","final"} or not isinstance(event.get("data"),str):
            raise ValueError(f"line {n}: expected object with type delta|snapshot|final and string data")
        events.append(event)
    if not events: raise ValueError("event stream is empty")
    return events


def aggregate(events:list[dict], policy:dict) -> tuple[str,dict]:
    buf=""; final=None; chunks=0; total_input=0; started=time.perf_counter()
    max_bytes=int(policy.get("max_argument_bytes",1048576)); max_chunks=int(policy.get("max_chunks",20000))
    max_seconds=float(policy.get("max_stream_seconds",300))
    for event in events:
        chunks += 1
        data=event["data"]; total_input += len(data.encode("utf-8"))
        if chunks > max_chunks: raise RuntimeError("budget: max_chunks exceeded")
        if time.perf_counter()-started > max_seconds: raise RuntimeError("budget: max_stream_seconds exceeded")
        if event["type"] == "delta": buf += data
        elif event["type"] == "snapshot": buf = data
        else: final=data
        candidate=final if final is not None and policy.get("final_payload_authoritative",True) else buf
        if len(candidate.encode("utf-8")) > max_bytes: raise RuntimeError("budget: max_argument_bytes exceeded")
    if final is None and policy.get("require_final_event_for_execution",True): raise EOFError("missing final event")
    result = final if final is not None and policy.get("final_payload_authoritative",True) else buf
    metrics={"chunks":chunks,"stream_input_bytes":total_input,"final_bytes":len(result.encode('utf-8')),"elapsed_ms":round((time.perf_counter()-started)*1000,3)}
    return result, metrics


def validate(events_path:Path, policy_path:Path) -> int:
    try:
        policy=load_json(policy_path); events=load_events(events_path); text,metrics=aggregate(events,policy)
        parsed=json.loads(text)
        digest=hashlib.sha256(text.encode()).hexdigest()
    except ValueError as exc:
        print(json.dumps({"status":"invalid","error":str(exc)}),file=sys.stderr); return INVALID
    except EOFError as exc:
        print(json.dumps({"status":"truncated","error":str(exc)})); return TRUNCATED
    except RuntimeError as exc:
        print(json.dumps({"status":"budget_exceeded","error":str(exc)})); return BUDGET
    except json.JSONDecodeError as exc:
        print(json.dumps({"status":"invalid_final","error":str(exc)})); return BAD_FINAL
    print(json.dumps({"status":"complete","sha256":digest,"arguments":parsed,"metrics":metrics},indent=2)); return 0


def benchmark(size:int, chunk:int, repeats:int) -> int:
    if size < 2 or chunk < 1 or repeats < 1: raise ValueError("size>=2, chunk>=1, repeats>=1 required")
    payload=json.dumps({"text":"x"*size},separators=(",",":"))
    parts=[payload[i:i+chunk] for i in range(0,len(payload),chunk)]
    naive=[]; guarded=[]
    for _ in range(repeats):
        buf=""; t=time.perf_counter(); attempts=0; reparsed=0
        for p in parts:
            buf+=p; attempts+=1; reparsed+=len(buf)
            try: json.loads(buf)
            except json.JSONDecodeError: pass
        naive.append((time.perf_counter()-t)*1000)
        buf_parts=[]; t=time.perf_counter()
        for p in parts: buf_parts.append(p)
        json.loads("".join(buf_parts)); guarded.append((time.perf_counter()-t)*1000)
    naive.sort(); guarded.sort(); mid=repeats//2
    out={"payload_bytes":len(payload.encode()),"chunks":len(parts),"naive_full_prefix_parse_attempts":len(parts),"naive_estimated_chars_reparsed":reparsed,"guarded_final_parse_attempts":1,"naive_median_ms":round(naive[mid],3),"guarded_median_ms":round(guarded[mid],3)}
    print(json.dumps(out,indent=2)); return 0


def main() -> int:
    p=argparse.ArgumentParser(); sub=p.add_subparsers(dest="cmd",required=True)
    v=sub.add_parser("validate"); v.add_argument("events",type=Path); v.add_argument("--policy",type=Path,required=True)
    b=sub.add_parser("benchmark"); b.add_argument("--size",type=int,default=65536); b.add_argument("--chunk",type=int,default=32); b.add_argument("--repeats",type=int,default=3)
    a=p.parse_args()
    try: return validate(a.events,a.policy) if a.cmd=="validate" else benchmark(a.size,a.chunk,a.repeats)
    except (ValueError,TypeError) as exc:
        print(json.dumps({"status":"invalid","error":str(exc)}),file=sys.stderr); return INVALID

if __name__=="__main__": raise SystemExit(main())
