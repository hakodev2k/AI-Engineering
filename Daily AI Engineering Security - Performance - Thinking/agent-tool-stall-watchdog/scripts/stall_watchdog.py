#!/usr/bin/env python3
"""Run a child command with global and no-output silence deadlines.

Exit codes: child exit code on normal completion; 124 global timeout; 125 silence timeout;
126 watchdog/configuration failure. The wrapper does not retry automatically.
"""
from __future__ import annotations
import argparse, json, os, queue, signal, subprocess, sys, threading, time
from pathlib import Path


def reader(stream, name, q):
    try:
        for line in iter(stream.readline, b""):
            q.put((time.monotonic(), name, line))
    finally:
        q.put((time.monotonic(), name, None))


def stop_child(proc, grace):
    mode = "terminate"
    try:
        if os.name != "nt":
            os.killpg(proc.pid, signal.SIGTERM)
        else:
            proc.terminate()
    except ProcessLookupError:
        return "already-exited"
    try:
        proc.wait(timeout=grace)
        return mode
    except subprocess.TimeoutExpired:
        mode = "kill"
        try:
            if os.name != "nt": os.killpg(proc.pid, signal.SIGKILL)
            else: proc.kill()
        except ProcessLookupError:
            pass
        try: proc.wait(timeout=max(1.0, grace))
        except subprocess.TimeoutExpired: mode = "kill-incomplete"
        return mode


def write_record(path, record):
    p = Path(path); p.parent.mkdir(parents=True, exist_ok=True)
    tmp = p.with_suffix(p.suffix + ".tmp")
    tmp.write_text(json.dumps(record, indent=2) + "\n", encoding="utf-8")
    os.replace(tmp, p)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--global-timeout", type=float, required=True)
    ap.add_argument("--silence-timeout", type=float, required=True)
    ap.add_argument("--grace", type=float, default=5.0)
    ap.add_argument("--record", required=True)
    ap.add_argument("--tail-lines", type=int, default=80)
    ap.add_argument("command", nargs=argparse.REMAINDER)
    a = ap.parse_args()
    if a.command and a.command[0] == "--": a.command = a.command[1:]
    if not a.command or not (0 < a.silence_timeout < a.global_timeout) or a.grace <= 0 or a.tail_lines < 1:
        print("invalid watchdog configuration", file=sys.stderr); return 126

    start = last = time.monotonic(); tail = []
    kwargs = dict(stdout=subprocess.PIPE, stderr=subprocess.PIPE, bufsize=0)
    if os.name != "nt": kwargs["start_new_session"] = True
    else: kwargs["creationflags"] = subprocess.CREATE_NEW_PROCESS_GROUP
    try:
        proc = subprocess.Popen(a.command, **kwargs)
    except OSError as e:
        write_record(a.record, {"status":"launch-error","error":str(e),"command":a.command})
        return 126

    q = queue.Queue()
    threads = [threading.Thread(target=reader, args=(proc.stdout,"stdout",q), daemon=True),
               threading.Thread(target=reader, args=(proc.stderr,"stderr",q), daemon=True)]
    for t in threads: t.start()
    reason = None; termination = None

    while True:
        now = time.monotonic()
        if proc.poll() is not None:
            # drain what readers already captured
            try:
                while True:
                    ts, name, data = q.get_nowait()
                    if data is not None:
                        last = ts; tail.append({"stream":name,"text":data.decode("utf-8","replace").rstrip("\n")}); tail = tail[-a.tail_lines:]
            except queue.Empty:
                pass
            break
        if now - start >= a.global_timeout:
            reason = "global-timeout"; termination = stop_child(proc, a.grace); break
        if now - last >= a.silence_timeout:
            reason = "silence-timeout"; termination = stop_child(proc, a.grace); break
        try:
            ts, name, data = q.get(timeout=min(0.25, a.global_timeout - (now-start), a.silence_timeout - (now-last)))
            if data is not None:
                last = ts
                text = data.decode("utf-8", "replace")
                target = sys.stdout if name == "stdout" else sys.stderr
                target.write(text); target.flush()
                tail.append({"stream":name,"text":text.rstrip("\n")}); tail = tail[-a.tail_lines:]
        except queue.Empty:
            pass

    end = time.monotonic()
    record = {
        "status": reason or "completed",
        "elapsed_seconds": round(end-start, 6),
        "last_activity_age_seconds": round(end-last, 6),
        "exit_code": proc.poll(),
        "termination": termination,
        "global_timeout": a.global_timeout,
        "silence_timeout": a.silence_timeout,
        "command": a.command,
        "recent_output": tail,
    }
    try: write_record(a.record, record)
    except OSError as e:
        print(f"failed to write watchdog record: {e}", file=sys.stderr); return 126
    if reason == "global-timeout": return 124
    if reason == "silence-timeout": return 125
    return proc.returncode if proc.returncode is not None else 126


if __name__ == "__main__": raise SystemExit(main())
