#!/usr/bin/env python3
from __future__ import annotations
import argparse, json, re, sys
from collections import Counter
from pathlib import Path

PATTERNS = {
    "email": re.compile(r"(?<![A-Za-z0-9._%+-])[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?![A-Za-z0-9.-])"),
    "bearer_token": re.compile(r"\bBearer\s+[A-Za-z0-9._~+\-/]+=*", re.I),
    "authorization_header": re.compile(r"\bAuthorization\s*[:=]\s*[^\s,;]+(?:\s+[^\s,;]+)?", re.I),
    "ipv4": re.compile(r"\b(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3}\b"),
    "long_digit_sequence": re.compile(r"(?<!\d)(?:\d[ -]?){13,19}(?!\d)")
}
MASK = "<redacted>"

def load_policy(path: Path):
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as e:
        raise ValueError(f"policy not found: {path}") from e
    except json.JSONDecodeError as e:
        raise ValueError(f"invalid policy JSON: {e}") from e
    enabled = data.get("enabled_detectors", [])
    if not isinstance(enabled, list) or any(x not in PATTERNS for x in enabled):
        raise ValueError("enabled_detectors contains unsupported detector")
    fields = data.get("sensitive_field_names", [])
    if not isinstance(fields, list) or any(not isinstance(x, str) or not x for x in fields):
        raise ValueError("sensitive_field_names must be non-empty strings")
    allow = data.get("allowlist_literals", [])
    if not isinstance(allow, list) or any(not isinstance(x, str) for x in allow):
        raise ValueError("allowlist_literals must be strings")
    limit = int(data.get("max_findings", 200))
    if limit < 1: raise ValueError("max_findings must be positive")
    return enabled, fields, allow, limit

def mask_evidence(text: str) -> str:
    if len(text) <= 6: return MASK
    return text[:2] + MASK + text[-2:]

def scan(text: str, enabled, fields, allow, limit):
    findings = []
    lower_fields = [f.lower() for f in fields]
    for line_no, line in enumerate(text.splitlines(), 1):
        if len(findings) >= limit: break
        for name in enabled:
            for m in PATTERNS[name].finditer(line):
                raw = m.group(0)
                if any(a and a in raw for a in allow): continue
                findings.append({"detector": name, "line": line_no, "column": m.start()+1, "evidence": mask_evidence(raw)})
                if len(findings) >= limit: break
            if len(findings) >= limit: break
        if len(findings) >= limit: break
        low = line.lower()
        for field in lower_fields:
            m = re.search(rf"(?:\"|')?{re.escape(field)}(?:\"|')?\s*[:=]\s*(?:\"[^\"]*\"|'[^']*'|[^,;\s]+)", low, re.I)
            if m and MASK not in m.group(0):
                findings.append({"detector": "sensitive_field", "line": line_no, "column": m.start()+1, "evidence": field + "=<redacted-value>"})
                if len(findings) >= limit: break
    counts = Counter(x["detector"] for x in findings)
    return {"status": "fail" if findings else "pass", "summary": {"total": len(findings), "by_detector": dict(sorted(counts.items()))}, "findings": findings}

def main():
    p = argparse.ArgumentParser(description="Detect likely sensitive values in application logs")
    p.add_argument("--policy", required=True, type=Path)
    p.add_argument("--input", required=True, type=Path)
    p.add_argument("--output", required=True, type=Path)
    a = p.parse_args()
    try:
        enabled, fields, allow, limit = load_policy(a.policy)
        text = a.input.read_text(encoding="utf-8", errors="replace")
        report = scan(text, enabled, fields, allow, limit)
    except (ValueError, OSError) as e:
        print(f"gate configuration/input error: {e}", file=sys.stderr); return 2
    a.output.parent.mkdir(parents=True, exist_ok=True)
    a.output.write_text(json.dumps(report, indent=2, sort_keys=True)+"\n", encoding="utf-8")
    if report["status"] == "fail":
        print(f"log redaction gate failed: {report['summary']['total']} finding(s)", file=sys.stderr); return 1
    print("log redaction gate passed"); return 0
if __name__ == "__main__": raise SystemExit(main())
