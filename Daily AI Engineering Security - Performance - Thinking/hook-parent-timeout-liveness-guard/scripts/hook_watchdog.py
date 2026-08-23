#!/usr/bin/env python3
"""Run one hook command with a parent-enforced deadline and structured result."""
from __future__ import annotations
import argparse, json, os, signal, subprocess, time
from pathlib import Path

MAX_CAPTURE = 65536

def terminate_tree(proc: subprocess.Popen[str]) -> None:
    if proc.poll() is not None:
        return
    try:
        if os.name == "nt":
            subprocess.run(["taskkill", "/PID", str(proc.pid), "/T", "/F"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=False)
        else:
            os.killpg(proc.pid, signal.SIGKILL)
    except Exception:
        try:
            proc.kill()
        except Exception:
            pass

def bounded(s: str | None) -> str:
    s = s or ""
    return s[-MAX_CAPTURE:]

def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--timeout", type=float, required=True)
    p.add_argument("--cwd", default=".")
    p.add_argument("--hook-id", default="hook")
    p.add_argument("command", nargs=argparse.REMAINDER)
    a = p.parse_args()
    if a.timeout <= 0 or a.timeout > 3600:
        print(json.dumps({"status":"invalid_input","error":"timeout must be >0 and <=3600"}))
        return 64
    command = list(a.command)
    if command and command[0] == "--":
        command = command[1:]
    if not command:
        print(json.dumps({"status":"invalid_input","error":"command required"}))
        return 64
    cwd = Path(a.cwd).resolve()
    if not cwd.is_dir():
        print(json.dumps({"status":"invalid_input","error":"cwd is not a directory"}))
        return 64
    start = time.monotonic()
    kwargs = {"cwd": str(cwd), "stdout": subprocess.PIPE, "stderr": subprocess.PIPE, "text": True}
    if os.name == "nt":
        kwargs["creationflags"] = subprocess.CREATE_NEW_PROCESS_GROUP
    else:
        kwargs["start_new_session"] = True
    try:
        proc = subprocess.Popen(command, **kwargs)
    except OSError as e:
        print(json.dumps({"hook_id":a.hook_id,"status":"spawn_error","error":str(e)}))
        return 70
    try:
        out, err = proc.communicate(timeout=a.timeout)
        elapsed = time.monotonic() - start
        status = "success" if proc.returncode == 0 else "failure"
        print(json.dumps({"hook_id":a.hook_id,"status":status,"exit_code":proc.returncode,"elapsed_s":round(elapsed,3),"stdout":bounded(out),"stderr":bounded(err)}))
        return 0 if proc.returncode == 0 else 1
    except subprocess.TimeoutExpired:
        terminate_tree(proc)
        try:
            out, err = proc.communicate(timeout=2)
        except Exception:
            out, err = "", ""
        elapsed = time.monotonic() - start
        print(json.dumps({"hook_id":a.hook_id,"status":"timeout","exit_code":None,"elapsed_s":round(elapsed,3),"stdout":bounded(out),"stderr":bounded(err)}))
        return 124

if __name__ == "__main__":
    raise SystemExit(main())