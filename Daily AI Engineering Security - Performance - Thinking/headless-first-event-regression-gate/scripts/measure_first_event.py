#!/usr/bin/env python3
"""Measure process spawn -> first stdout byte and total duration for repeated headless commands."""
from __future__ import annotations
import argparse, json, math, statistics, subprocess, threading, time
from pathlib import Path


def percentile(values, q):
    if not values: return None
    xs=sorted(values); pos=(len(xs)-1)*q; lo=math.floor(pos); hi=math.ceil(pos)
    return xs[lo] if lo==hi else xs[lo]+(xs[hi]-xs[lo])*(pos-lo)


def run_once(command, timeout_s, stdin_bytes):
    start=time.monotonic(); first=[None]
    try:
        p=subprocess.Popen(command, stdin=subprocess.PIPE if stdin_bytes is not None else subprocess.DEVNULL,
                           stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=False)
    except OSError as e:
        return {"ok":False,"error":f"spawn: {e}","first_byte_ms":None,"total_ms":0,"returncode":None,"timed_out":False}
    if stdin_bytes is not None:
        try: p.stdin.write(stdin_bytes); p.stdin.close()
        except BrokenPipeError: pass
    def drain_stdout():
        while True:
            chunk=p.stdout.read(8192)
            if not chunk: break
            if first[0] is None: first[0]=time.monotonic()
    def drain_stderr():
        while p.stderr.read(8192): pass
    out_t=threading.Thread(target=drain_stdout,daemon=True); err_t=threading.Thread(target=drain_stderr,daemon=True)
    out_t.start(); err_t.start(); timed_out=False
    try: p.wait(timeout=timeout_s)
    except subprocess.TimeoutExpired:
        timed_out=True; p.kill(); p.wait()
    out_t.join(timeout=1); err_t.join(timeout=1); end=time.monotonic()
    return {"ok":(not timed_out and p.returncode==0 and first[0] is not None),"timed_out":timed_out,
            "first_byte_ms":None if first[0] is None else round((first[0]-start)*1000,3),
            "total_ms":round((end-start)*1000,3),"returncode":p.returncode}


def summarize(samples):
    good=[x for x in samples if x["ok"]]; first=[x["first_byte_ms"] for x in good]; total=[x["total_ms"] for x in good]
    def s(v): return {"median_ms":round(statistics.median(v),3) if v else None,"p95_ms":round(percentile(v,.95),3) if v else None}
    return {"samples":len(samples),"successful":len(good),"failure_rate":round(1-len(good)/len(samples),4) if samples else 1.0,"first_byte":s(first),"total":s(total)}


def main():
    ap=argparse.ArgumentParser(); ap.add_argument("--repeat",type=int,default=5); ap.add_argument("--warmup",type=int,default=1)
    ap.add_argument("--timeout",type=float,default=120); ap.add_argument("--stdin-file"); ap.add_argument("--output"); ap.add_argument("--baseline")
    ap.add_argument("--max-median-ratio",type=float,default=1.20); ap.add_argument("--max-p95-ratio",type=float,default=1.30); ap.add_argument("command",nargs=argparse.REMAINDER)
    a=ap.parse_args(); cmd=a.command[1:] if a.command and a.command[0]=="--" else a.command
    if not cmd or a.repeat<1 or a.warmup<0 or a.timeout<=0: ap.error("valid command/repeat/warmup/timeout required")
    stdin_bytes=Path(a.stdin_file).read_bytes() if a.stdin_file else None
    for _ in range(a.warmup): run_once(cmd,a.timeout,stdin_bytes)
    samples=[run_once(cmd,a.timeout,stdin_bytes) for _ in range(a.repeat)]
    result={"command":cmd,"summary":summarize(samples),"samples":samples,"verdict":"measured"}; exit_code=0
    if a.baseline:
        b=json.loads(Path(a.baseline).read_text(encoding="utf-8")); bs=b.get("summary",b); cur=result["summary"]; checks=[]
        for metric,limit in (("median_ms",a.max_median_ratio),("p95_ms",a.max_p95_ratio)):
            old=bs.get("first_byte",{}).get(metric); new=cur.get("first_byte",{}).get(metric)
            if old and new: checks.append({"metric":"first_byte."+metric,"baseline":old,"current":new,"ratio":round(new/old,4),"limit":limit,"pass":new/old<=limit})
        result["comparison"]=checks; passed=cur["failure_rate"]==0 and bool(checks) and all(x["pass"] for x in checks)
        result["verdict"]="pass" if passed else "regression"; exit_code=0 if passed else 2
    text=json.dumps(result,indent=2)
    if a.output: Path(a.output).write_text(text+"\n",encoding="utf-8")
    print(text); return exit_code
if __name__=="__main__": raise SystemExit(main())
