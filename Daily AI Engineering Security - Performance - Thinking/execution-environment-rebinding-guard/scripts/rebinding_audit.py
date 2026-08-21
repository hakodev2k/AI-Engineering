#!/usr/bin/env python3
"""Read-only audit for cross-environment agent state rebinding."""
from __future__ import annotations
import argparse, json, re, sys
from pathlib import Path
from typing import Any

WIN = re.compile(r"^[A-Za-z]:[\\/]")
WSL = re.compile(r"^/mnt/[a-zA-Z](?:/|$)")
POSIX = re.compile(r"^/")
DEFAULT_CRITICAL = ("cwd", "root", "path", "sandbox", "writable", "permission", "workspace", "skill")


def load(path: str) -> Any:
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc


def family(value: str) -> str | None:
    if WIN.match(value): return "windows"
    if WSL.match(value): return "wsl"
    if POSIX.match(value): return "posix"
    return None


def walk(value: Any, keypath: str = "$", keyname: str = ""):
    if isinstance(value, dict):
        for k, v in value.items(): yield from walk(v, f"{keypath}.{k}", str(k))
    elif isinstance(value, list):
        for i, v in enumerate(value): yield from walk(v, f"{keypath}[{i}]", keyname)
    elif isinstance(value, str):
        yield keypath, keyname.lower(), value


def norm(v: str) -> str:
    return v.replace("/", "\\").rstrip("\\").lower() if WIN.match(v) else v.rstrip("/")


def within(path: str, roots: list[str]) -> bool:
    p = norm(path)
    return any(p == norm(r) or p.startswith(norm(r) + ("\\" if WIN.match(r) else "/")) for r in roots)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--state", required=True); ap.add_argument("--mapping", required=True); ap.add_argument("--target", required=True)
    args = ap.parse_args()
    try:
        state, mapping, target = load(args.state), load(args.mapping), load(args.target)
        target_family = target["family"]
        allowed = target.get("allowed_roots", [target["workspace_root"]])
        pairs = mapping.get("path_map", [])
        critical_keys = tuple(mapping.get("critical_keys", DEFAULT_CRITICAL))
    except (ValueError, KeyError, TypeError) as exc:
        print(json.dumps({"error": str(exc)})); return 2

    findings = []
    for kp, kn, value in walk(state):
        fam = family(value)
        critical = any(token in kn for token in critical_keys)
        if not fam or not critical: continue
        if re.match(r"^[A-Za-z]:\\mnt\\[a-zA-Z]\\", value, re.I):
            findings.append({"severity":"critical","path":kp,"kind":"malformed-cross-family-path","value":value}); continue
        if fam != target_family and not (target_family == "wsl" and fam == "posix"):
            mapped = False
            for pair in pairs:
                src, dst = pair.get("from", ""), pair.get("to", "")
                if src and value.startswith(src):
                    mapped = True
                    candidate = dst + value[len(src):]
                    cf = family(candidate)
                    if cf != target_family and not (target_family == "wsl" and cf == "posix"):
                        findings.append({"severity":"critical","path":kp,"kind":"mapping-wrong-family","value":value,"candidate":candidate})
                    elif not within(candidate, allowed):
                        findings.append({"severity":"critical","path":kp,"kind":"mapped-outside-allowed-roots","value":value,"candidate":candidate})
                    break
            if not mapped:
                findings.append({"severity":"critical","path":kp,"kind":"unmapped-source-path","value":value})
        elif not within(value, allowed):
            findings.append({"severity":"critical","path":kp,"kind":"target-path-outside-allowed-roots","value":value})

    shell = target.get("shell")
    for kp, kn, value in walk(state):
        if kn in ("shell", "shell_name") and shell and value.lower() != str(shell).lower():
            findings.append({"severity":"critical","path":kp,"kind":"stale-shell","value":value,"expected":shell})

    report = {"status":"pass" if not findings else "block","critical_count":len(findings),"findings":findings}
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 0 if not findings else 1

if __name__ == "__main__":
    sys.exit(main())
