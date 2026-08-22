#!/usr/bin/env python3
import json, re, sys
from pathlib import Path

ID_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
MODES = {"exact", "numeric", "unordered", "invariant"}

def fail(msg):
    print(f"ERROR: {msg}", file=sys.stderr)
    return 1

def main():
    if len(sys.argv) != 2:
        return fail("usage: validate-scenario-suite.py <suite.json>")
    p = Path(sys.argv[1])
    if not p.is_file():
        return fail(f"file not found: {p}")
    try:
        data = json.loads(p.read_text(encoding="utf-8"))
    except Exception as e:
        return fail(f"invalid json: {e}")
    if not isinstance(data, dict) or not data.get("suite_id") or not data.get("version"):
        return fail("suite_id and version are required")
    scenarios = data.get("scenarios")
    if not isinstance(scenarios, list) or not scenarios:
        return fail("scenarios must be a non-empty array")
    seen = set()
    for i, s in enumerate(scenarios):
        if not isinstance(s, dict):
            return fail(f"scenario[{i}] must be object")
        sid = s.get("id")
        if not isinstance(sid, str) or not ID_RE.match(sid):
            return fail(f"invalid scenario id: {sid!r}")
        if sid in seen:
            return fail(f"duplicate scenario id: {sid}")
        seen.add(sid)
        if not isinstance(s.get("critical"), bool):
            return fail(f"{sid}: critical must be boolean")
        if not isinstance(s.get("category"), str) or not s["category"]:
            return fail(f"{sid}: category required")
        evidence = s.get("evidence", [])
        if not isinstance(evidence, list):
            return fail(f"{sid}: evidence must be array")
        if s["critical"] and not evidence:
            return fail(f"{sid}: critical scenario requires evidence")
        assertions = s.get("assertions")
        if not isinstance(assertions, list) or not assertions:
            return fail(f"{sid}: at least one assertion required")
        for a in assertions:
            if not isinstance(a, dict) or not isinstance(a.get("path"), str) or a.get("mode") not in MODES:
                return fail(f"{sid}: invalid assertion {a!r}")
        tol = s.get("numeric_tolerance", 0)
        if not isinstance(tol, (int, float)) or tol < 0:
            return fail(f"{sid}: numeric_tolerance must be >= 0")
        ignored = s.get("ignored_paths", [])
        if not isinstance(ignored, list) or any(not isinstance(x, str) for x in ignored):
            return fail(f"{sid}: ignored_paths must be string array")
    print(f"VALID: {len(scenarios)} scenarios")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())