#!/usr/bin/env python3
"""Build and verify machine-checkable worker handoffs.
Exit codes: 0 success, 2 invalid input, 3 verification failure, 4 git/filesystem error.
"""
from __future__ import annotations
import argparse, json, subprocess, sys
from pathlib import Path
from typing import Any


def read(path: str) -> dict[str, Any]:
    try: data = json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as e: raise ValueError(f"cannot read {path}: {e}") from e
    if not isinstance(data, dict): raise ValueError("JSON root must be object")
    return data


def write(path: str, data: dict[str, Any]) -> None:
    p = Path(path); p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def git(cwd: str, *args: str) -> str:
    p = subprocess.run(["git", *args], cwd=cwd, text=True, capture_output=True)
    if p.returncode != 0: raise OSError((p.stderr or p.stdout).strip())
    return p.stdout.strip()


def changed_paths(wt: str, base: str, head: str) -> list[str]:
    out = git(wt, "diff", "--name-only", f"{base}...{head}")
    return sorted(x for x in out.splitlines() if x.strip())


def is_owned(path: str, prefixes: list[str]) -> bool:
    p = path.replace("\\", "/").lstrip("./")
    for prefix in prefixes:
        q = str(prefix).replace("\\", "/").strip("/")
        if p == q or p.startswith(q + "/"): return True
    return False


def build(a: argparse.Namespace) -> int:
    try:
        m = read(a.manifest); tests = read(a.test_results) if a.test_results else {"results": []}
        wt = str(m["worktree"]); base = str(m["base_sha"]); head = git(wt, "rev-parse", "HEAD")
        branch = git(wt, "branch", "--show-current"); paths = changed_paths(wt, base, head)
    except (ValueError, KeyError) as e:
        print(json.dumps({"ok": False, "error": str(e)}), file=sys.stderr); return 2
    except OSError as e:
        print(json.dumps({"ok": False, "error": str(e)}), file=sys.stderr); return 4
    owned = all(is_owned(p, m.get("owned_paths", [])) for p in paths)
    handoff = {
        "task_id": m.get("task_id"), "agent_id": m.get("agent_id"), "repo_root": m.get("repo_root"),
        "worktree": wt, "branch": branch, "base_sha": base, "head_sha": head,
        "changed_paths": paths, "tests": tests.get("results", []),
        "ownership_status": "pass" if owned else "fail", "verification_status": "unverified"
    }
    write(a.output, handoff)
    print(json.dumps({"ok": True, "output": a.output, "ownership_status": handoff["ownership_status"]}))
    return 0 if owned else 3


def verify(a: argparse.Namespace) -> int:
    try:
        m = read(a.manifest); h = read(a.handoff); wt = str(m["worktree"])
        actual_head = git(wt, "rev-parse", "HEAD"); actual_branch = git(wt, "branch", "--show-current")
        actual_paths = changed_paths(wt, str(m["base_sha"]), actual_head)
    except (ValueError, KeyError) as e:
        print(json.dumps({"verified": False, "errors": [str(e)]}), file=sys.stderr); return 2
    except OSError as e:
        print(json.dumps({"verified": False, "errors": [str(e)]}), file=sys.stderr); return 4
    errors: list[str] = []
    for k in ["task_id","agent_id","repo_root","worktree","branch","base_sha","head_sha","changed_paths","tests","ownership_status","verification_status"]:
        if k not in h: errors.append(f"missing handoff field: {k}")
    if a.verifier == str(h.get("agent_id")): errors.append("verifier must differ from implementation agent")
    if h.get("task_id") != m.get("task_id"): errors.append("task_id mismatch")
    if h.get("agent_id") != m.get("agent_id"): errors.append("agent_id mismatch")
    if h.get("branch") != m.get("branch") or actual_branch != m.get("branch"): errors.append("branch mismatch")
    if h.get("base_sha") != m.get("base_sha"): errors.append("base_sha mismatch")
    if h.get("head_sha") != actual_head: errors.append("stale head_sha")
    if sorted(h.get("changed_paths", [])) != actual_paths: errors.append("declared changed_paths differ from git diff")
    unowned = [p for p in actual_paths if not is_owned(p, m.get("owned_paths", []))]
    if unowned: errors.append("unowned changed paths: " + ", ".join(unowned))
    p = subprocess.run(["git","merge-base","--is-ancestor",str(m.get("base_sha")),actual_head], cwd=wt)
    if p.returncode != 0: errors.append("base is not ancestor of head")
    tests = h.get("tests")
    if not isinstance(tests, list): errors.append("tests must be array")
    elif m.get("required_tests") and not tests: errors.append("required test evidence missing")
    if h.get("ownership_status") != "pass": errors.append("worker ownership_status is not pass")
    result = {"verified": not errors, "verifier": a.verifier, "errors": errors, "actual_head": actual_head, "changed_paths": actual_paths}
    print(json.dumps(result, indent=2))
    return 0 if not errors else 3


def main() -> int:
    p = argparse.ArgumentParser(); sub = p.add_subparsers(dest="cmd", required=True)
    x = sub.add_parser("build"); x.add_argument("--manifest", required=True); x.add_argument("--output", required=True); x.add_argument("--test-results"); x.set_defaults(fn=build)
    x = sub.add_parser("verify"); x.add_argument("--manifest", required=True); x.add_argument("--handoff", required=True); x.add_argument("--verifier", required=True); x.set_defaults(fn=verify)
    args = p.parse_args(); return int(args.fn(args))

if __name__ == "__main__":
    raise SystemExit(main())
