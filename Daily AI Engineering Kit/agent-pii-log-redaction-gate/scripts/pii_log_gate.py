#!/usr/bin/env python3
import argparse, json, re, sys
from pathlib import Path

PATTERNS = {
    "email": re.compile(r"(?<![\w.-])[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}(?![\w.-])", re.I),
    "phone": re.compile(r"(?<!\d)(?:\+?\d[\d .()-]{7,}\d)(?!\d)"),
    "ipv4": re.compile(r"(?<!\d)(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)(?!\d)"),
    "jwt": re.compile(r"\beyJ[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\b"),
    "bearer_token": re.compile(r"(?i)\bBearer\s+[A-Za-z0-9._~+/-]{12,}={0,2}\b"),
    "credit_card_like": re.compile(r"(?<!\d)(?:\d[ -]*?){13,19}(?!\d)"),
    "connection_string_secret": re.compile(r"(?i)\b(?:Password|Pwd|AccountKey)\s*=\s*[^;\s]{4,}"),
    "api_key_like": re.compile(r"(?i)\b(?:api[_-]?key|client[_-]?secret|secret|token)\b\s*[:=]\s*['\"]?[A-Za-z0-9_\-./+=]{12,}['\"]?"),
}

def load_policy(path: Path):
    try:
        import yaml
    except ImportError:
        raise SystemExit("PyYAML is required: pip install pyyaml")
    data = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict) or "patterns" not in data:
        raise SystemExit("Invalid policy: missing patterns")
    return data

def allowed(value, policy):
    allow = policy.get("allowlist", {})
    if value in allow.get("literals", []):
        return True
    return any(re.search(rx, value) for rx in allow.get("regexes", []))

def luhn_candidate(value):
    digits = re.sub(r"\D", "", value)
    if not 13 <= len(digits) <= 19:
        return False
    total = 0
    parity = len(digits) % 2
    for i, ch in enumerate(digits):
        n = int(ch)
        if i % 2 == parity:
            n *= 2
            if n > 9: n -= 9
        total += n
    return total % 10 == 0

def scan_text(text, path, policy):
    findings = []
    for name, enabled in policy.get("patterns", {}).items():
        if not enabled or name not in PATTERNS: continue
        for m in PATTERNS[name].finditer(text):
            val = m.group(0)
            if name == "credit_card_like" and not luhn_candidate(val): continue
            if allowed(val, policy): continue
            line = text.count("\n", 0, m.start()) + 1
            findings.append({"file": str(path), "line": line, "type": name, "severity": policy.get("severity", {}).get(name, "medium"), "sample": "[REDACTED]"})
    return findings

def redact_text(text, policy):
    for name, enabled in policy.get("patterns", {}).items():
        if not enabled or name not in PATTERNS: continue
        def repl(m):
            v=m.group(0)
            if name == "credit_card_like" and not luhn_candidate(v): return v
            if allowed(v, policy): return v
            return policy.get("replacement", "[REDACTED]").format(type=name)
        text = PATTERNS[name].sub(repl, text)
    return text

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--policy", required=True)
    ap.add_argument("--input", nargs="+", required=True)
    ap.add_argument("--report", default="pii-gate-report.json")
    ap.add_argument("--redact", action="store_true")
    args=ap.parse_args()
    policy=load_policy(Path(args.policy))
    findings=[]
    for raw in args.input:
        p=Path(raw)
        if not p.exists() or not p.is_file():
            print(f"skip: {p}", file=sys.stderr); continue
        text=p.read_text(encoding="utf-8", errors="replace")
        findings.extend(scan_text(text,p,policy))
        if args.redact:
            p.write_text(redact_text(text,policy), encoding="utf-8")
    result={"status":"blocked" if findings else "passed","finding_count":len(findings),"findings":findings}
    Path(args.report).write_text(json.dumps(result,indent=2), encoding="utf-8")
    print(json.dumps(result,indent=2))
    return 2 if findings and not args.redact else 0

if __name__ == "__main__":
    raise SystemExit(main())
