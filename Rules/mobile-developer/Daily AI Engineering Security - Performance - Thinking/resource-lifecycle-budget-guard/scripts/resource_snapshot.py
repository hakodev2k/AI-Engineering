#!/usr/bin/env python3
"""Cross-platform process snapshotter using Python stdlib only.

Outputs JSON records for processes discoverable through OS commands. It never kills
processes. Optional --match filters command/name text for deterministic inspection.
"""
import argparse, json, os, subprocess, sys, time


def run(cmd):
    try:
        return subprocess.run(cmd, capture_output=True, text=True, timeout=10, check=False)
    except Exception as exc:
        print(f"snapshot command failed: {exc}", file=sys.stderr)
        return None


def windows_processes():
    ps = [
        "powershell", "-NoProfile", "-Command",
        "Get-CimInstance Win32_Process | Select-Object ProcessId,ParentProcessId,Name,CommandLine,WorkingSetSize | ConvertTo-Json -Compress"
    ]
    r = run(ps)
    if not r or r.returncode != 0:
        raise RuntimeError(r.stderr.strip() if r else "powershell unavailable")
    value = json.loads(r.stdout or "[]")
    if isinstance(value, dict): value = [value]
    return [{"pid": x.get("ProcessId"), "ppid": x.get("ParentProcessId"), "name": x.get("Name"), "command": x.get("CommandLine"), "rss_bytes": x.get("WorkingSetSize")} for x in value]


def unix_processes():
    r = run(["ps", "-eo", "pid=,ppid=,rss=,comm=,args="])
    if not r or r.returncode != 0:
        raise RuntimeError(r.stderr.strip() if r else "ps unavailable")
    out = []
    for line in r.stdout.splitlines():
        parts = line.strip().split(None, 4)
        if len(parts) < 4: continue
        pid, ppid, rss_kb, name = parts[:4]
        args = parts[4] if len(parts) > 4 else name
        out.append({"pid": int(pid), "ppid": int(ppid), "name": name, "command": args, "rss_bytes": int(rss_kb) * 1024})
    return out


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--match", action="append", default=[], help="case-insensitive substring; may repeat")
    p.add_argument("--owner-pid", type=int, help="mark descendants of this PID")
    args = p.parse_args()
    try:
        procs = windows_processes() if os.name == "nt" else unix_processes()
    except Exception as exc:
        print(str(exc), file=sys.stderr); return 2
    needles = [n.lower() for n in args.match]
    if needles:
        procs = [x for x in procs if any(n in ((x.get("name") or "") + " " + (x.get("command") or "")).lower() for n in needles)]
    children = {}
    for x in procs:
        children.setdefault(x.get("ppid"), []).append(x.get("pid"))
    owned = set()
    if args.owner_pid:
        stack = [args.owner_pid]
        while stack:
            cur = stack.pop()
            for child in children.get(cur, []):
                if child not in owned:
                    owned.add(child); stack.append(child)
    for x in procs: x["descendant_of_owner"] = x.get("pid") in owned
    result = {"captured_at_epoch": time.time(), "count": len(procs), "rss_bytes": sum(int(x.get("rss_bytes") or 0) for x in procs), "processes": procs}
    print(json.dumps(result, indent=2))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
