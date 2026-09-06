#!/usr/bin/env python3
"""Deterministic feature-flag cleanup scanner/verifier. Stdlib only.

Exit codes: 0 pass, 2 policy/verification failure, 3 input/tool error.
"""
from __future__ import annotations
import argparse, fnmatch, json, os, sys
from pathlib import Path


def load_json(path: str) -> dict:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def write_json(path: str, data: dict) -> None:
    p = Path(path); p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def iter_files(root: Path, policy: dict):
    exts = set(policy.get("scan_extensions", []))
    excluded = set(policy.get("exclude_dirs", []))
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in excluded]
        for name in filenames:
            p = Path(dirpath) / name
            if p.suffix.lower() in exts:
                yield p


def is_allowed(rel: str, policy: dict) -> bool:
    rel = rel.replace(os.sep, "/")
    return any(fnmatch.fnmatch(rel, pat) for pat in policy.get("allowed_reference_globs", []))


def find_flag(registry: dict, key: str):
    for item in registry.get("flags", []):
        if item.get("key") == key:
            return item
    return None


def scan(args) -> int:
    root = Path(args.root).resolve()
    registry_path = Path(args.registry).resolve()
    policy_path = Path(args.policy).resolve()
    out_path = Path(args.out).resolve()
    if not root.is_dir():
        raise ValueError(f"repository root is not a directory: {root}")
    policy = load_json(str(policy_path))
    registry = load_json(str(registry_path))
    flag = find_flag(registry, args.flag)
    if flag is None:
        write_json(args.out, {"status": "blocked", "flag": args.flag, "errors": ["flag missing from registry"], "references": []})
        return 2
    refs = []
    needle = args.flag
    excluded_files = {registry_path, policy_path, out_path}
    for p in iter_files(root, policy):
        try:
            resolved = p.resolve()
        except OSError:
            resolved = p.absolute()
        if resolved in excluded_files:
            continue
        try:
            lines = p.read_text(encoding="utf-8", errors="replace").splitlines()
        except OSError as e:
            raise RuntimeError(f"cannot read {p}: {e}") from e
        rel = p.relative_to(root).as_posix()
        for number, line in enumerate(lines, 1):
            if needle in line:
                refs.append({"path": rel, "line": number, "allowed": is_allowed(rel, policy), "excerpt": line.strip()[:240]})
    active = [r for r in refs if not r["allowed"]]
    out = {
        "status": "pass" if not active else "references-found",
        "flag": args.flag,
        "registry": flag,
        "reference_count": len(refs),
        "active_reference_count": len(active),
        "references": refs,
    }
    write_json(args.out, out)
    return 0 if not active else 2


def verify(args) -> int:
    policy = load_json(args.policy)
    registry = load_json(args.registry)
    report = load_json(args.scan)
    flag = find_flag(registry, args.flag)
    errors = []
    if flag is None:
        errors.append("flag missing from registry")
    else:
        if flag.get("state") != "retired":
            errors.append("registry state must be retired before final cleanup verification")
        if flag.get("expected_behavior") not in policy.get("required_retired_behavior", ["enabled", "disabled"]):
            errors.append("retired flag must declare expected_behavior as enabled or disabled")
        if not flag.get("owner"):
            errors.append("retired flag must retain owner metadata")
        if not flag.get("retired_at"):
            errors.append("retired flag must retain retired_at metadata")
    if report.get("flag") != args.flag:
        errors.append("scan report flag mismatch")
    if report.get("status") not in ("pass", "references-found"):
        errors.append("scan report status is invalid or blocked")
    if int(report.get("active_reference_count", -1)) != 0:
        errors.append("non-allowlisted references remain")
    status = "verified" if not errors else "failed"
    write_json(args.out, {"status": status, "flag": args.flag, "errors": errors, "scan": args.scan, "registry": args.registry})
    return 0 if not errors else 2


def main() -> int:
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("scan")
    s.add_argument("--flag", required=True); s.add_argument("--root", default=".")
    s.add_argument("--registry", required=True); s.add_argument("--policy", required=True); s.add_argument("--out", required=True)
    s.set_defaults(fn=scan)
    v = sub.add_parser("verify")
    v.add_argument("--flag", required=True); v.add_argument("--registry", required=True)
    v.add_argument("--policy", required=True); v.add_argument("--scan", required=True); v.add_argument("--out", required=True)
    v.set_defaults(fn=verify)
    args = ap.parse_args()
    try:
        return args.fn(args)
    except (OSError, RuntimeError, ValueError, json.JSONDecodeError) as e:
        print(f"flag_cleanup_gate: {e}", file=sys.stderr)
        return 3

if __name__ == "__main__":
    raise SystemExit(main())
