#!/usr/bin/env python3
import argparse
import hashlib
import json
from pathlib import Path

DEFAULT_CRITICAL = [
    "ignore previous instructions",
    "ignore all previous instructions",
    "reveal secret",
    "reveal secrets",
    "send credentials",
    "upload credentials",
    "disable security",
    "bypass security",
    "delete all",
    "force push",
]
DEFAULT_HIGH = [
    "run this command",
    "execute this command",
    "change your role",
    "system prompt",
    "developer message",
    "do not tell the user",
    "send this data",
    "download and execute",
]


def load_markers(policy_path):
    if not policy_path:
        return DEFAULT_CRITICAL, DEFAULT_HIGH
    data = json.loads(Path(policy_path).read_text(encoding="utf-8"))
    return data.get("critical_markers", DEFAULT_CRITICAL), data.get("high_markers", DEFAULT_HIGH)


def main():
    parser = argparse.ArgumentParser(description="Scan untrusted text for prompt-injection signals.")
    parser.add_argument("--input", required=True)
    parser.add_argument("--source-id", required=True)
    parser.add_argument("--source-type", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--policy")
    args = parser.parse_args()

    p = Path(args.input)
    if not p.is_file():
        raise SystemExit(f"input file not found: {p}")

    raw = p.read_bytes()
    text = raw.decode("utf-8", errors="replace")
    critical, high = load_markers(args.policy)
    findings = []

    for line_no, line in enumerate(text.splitlines(), start=1):
        lower = line.lower()
        for severity, markers in (("critical", critical), ("high", high)):
            for marker in markers:
                if marker.lower() in lower:
                    findings.append({
                        "id": f"S-{len(findings)+1:03d}",
                        "category": "instruction-like-content",
                        "severity": severity,
                        "line": line_no,
                        "marker": marker,
                        "line_sha256": hashlib.sha256(line.encode("utf-8", errors="replace")).hexdigest(),
                    })

    report = {
        "source_id": args.source_id,
        "source_type": args.source_type,
        "content_sha256": hashlib.sha256(raw).hexdigest(),
        "finding_count": len(findings),
        "findings": findings,
        "note": "Pattern matches are triage signals, not proof of malicious intent."
    }
    Path(args.output).write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps({"status": "scanned", "findings": len(findings), "output": args.output}))


if __name__ == "__main__":
    main()
