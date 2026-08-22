#!/usr/bin/env python3
import argparse, json, re, sys
from pathlib import Path

DEFAULT_PATTERNS = [
    r"ignore\s+(all\s+)?previous instructions",
    r"reveal\s+(the\s+)?system prompt",
    r"send\s+.*secret",
    r"disable\s+.*safety",
    r"run\s+(this\s+)?command",
    r"exfiltrat(e|ion)",
]


def load_policy(path: Path):
    text = path.read_text(encoding="utf-8")
    policy = {"max_untrusted_chars": 20000, "block_instruction_patterns": []}
    current = None
    for raw in text.splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if line.endswith(":"):
            current = line[:-1]
            continue
        if line.startswith("-") and current:
            policy.setdefault(current, []).append(line[1:].strip().strip('"'))
        elif ":" in line:
            k, v = line.split(":", 1)
            v = v.strip()
            if v.isdigit(): v = int(v)
            elif v.lower() in ("true", "false"): v = v.lower() == "true"
            else: v = v.strip('"')
            policy[k.strip()] = v
    return policy


def gate(text: str, source: str, policy: dict):
    limit = int(policy.get("max_untrusted_chars", 20000))
    clipped = text[:limit]
    patterns = policy.get("block_instruction_patterns") or []
    patterns = [re.escape(p) for p in patterns] + DEFAULT_PATTERNS
    findings = []
    for p in patterns:
        m = re.search(p, clipped, flags=re.IGNORECASE)
        if m:
            evidence = clipped[max(0, m.start()-40):min(len(clipped), m.end()+80)].replace("\n", " ")
            findings.append({"pattern": p, "severity": "high", "evidence": evidence[:200]})
    status = "block" if findings else "pass"
    sanitized = clipped
    for f in findings:
        try:
            sanitized = re.sub(f["pattern"], "[BLOCKED_UNTRUSTED_INSTRUCTION]", sanitized, flags=re.IGNORECASE)
        except re.error:
            pass
    return {"status": status, "source": source, "findings": findings, "sanitized_text": sanitized,
            "requires_approval": bool(findings), "errors": []}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", required=True)
    ap.add_argument("--source", required=True)
    ap.add_argument("--policy", default="config/policy.yaml")
    ap.add_argument("--output")
    args = ap.parse_args()
    try:
        text = Path(args.input).read_text(encoding="utf-8")
        policy = load_policy(Path(args.policy))
        result = gate(text, args.source, policy)
        payload = json.dumps(result, ensure_ascii=False, indent=2)
        if args.output:
            Path(args.output).write_text(payload + "\n", encoding="utf-8")
        else:
            print(payload)
        return 2 if result["status"] == "block" else 0
    except Exception as exc:
        print(json.dumps({"status":"block","source":args.source,"findings":[],"sanitized_text":"","requires_approval":True,"errors":[str(exc)]}), file=sys.stderr)
        return 3

if __name__ == "__main__":
    raise SystemExit(main())
