#!/usr/bin/env python3
"""Static, fail-closed pre-execution guard for agent-authored shell/interpreter commands."""
from __future__ import annotations
import argparse, hashlib, json, re, shlex, sys
from pathlib import Path

EXIT = {"allow": 0, "review": 10, "block": 20, "error": 30}
INTERPRETERS = {"bash", "sh", "zsh", "python", "python3", "node", "pwsh", "powershell", "powershell.exe"}


def load_json_text(text: str, label: str):
    try:
        value = json.loads(text)
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid {label}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"{label} must be a JSON object")
    return value


def load_policy(path: Path):
    try:
        return load_json_text(path.read_text(encoding="utf-8"), "policy")
    except OSError as exc:
        raise ValueError(f"cannot read policy: {exc}") from exc


def compile_patterns(policy, key):
    out = []
    for raw in policy.get(key, []):
        if not isinstance(raw, str):
            raise ValueError(f"{key} entries must be strings")
        try:
            out.append((raw, re.compile(raw, re.IGNORECASE | re.MULTILINE)))
        except re.error as exc:
            raise ValueError(f"invalid regex in {key}: {raw}: {exc}") from exc
    return out


def inside(path: Path, roots):
    rp = path.resolve(strict=False)
    for root in roots:
        rr = root.resolve(strict=False)
        try:
            rp.relative_to(rr)
            return True
        except ValueError:
            pass
    return False


def candidate_scripts(command: str, cwd: Path, extensions):
    try:
        tokens = shlex.split(command, posix=True)
    except ValueError:
        return [], True
    found = []
    ambiguous = False
    for i, token in enumerate(tokens):
        low = Path(token).name.lower()
        if low in INTERPRETERS and i + 1 < len(tokens):
            nxt = tokens[i + 1]
            if nxt in {"-c", "-e", "--eval", "-Command", "-EncodedCommand"}:
                ambiguous = True
                continue
            if not nxt.startswith("-"):
                p = Path(nxt)
                if not p.is_absolute():
                    p = cwd / p
                if p.suffix.lower() in extensions or p.exists():
                    found.append(p)
        elif Path(token).suffix.lower() in extensions:
            p = Path(token)
            if not p.is_absolute():
                p = cwd / p
            found.append(p)
    unique = []
    seen = set()
    for p in found:
        k = str(p.resolve(strict=False))
        if k not in seen:
            seen.add(k); unique.append(p)
    return unique, ambiguous


def scan_text(text: str, source: str, block, review):
    findings = []
    for raw, rx in block:
        if rx.search(text): findings.append({"severity": "block", "source": source, "pattern": raw})
    for raw, rx in review:
        if rx.search(text): findings.append({"severity": "review", "source": source, "pattern": raw})
    return findings


def decide(event, policy):
    command = event.get("command")
    cwd_raw = event.get("cwd", ".")
    if not isinstance(command, str) or not command.strip():
        raise ValueError("event.command must be a non-empty string")
    if not isinstance(cwd_raw, str):
        raise ValueError("event.cwd must be a string")
    cwd = Path(cwd_raw).expanduser().resolve(strict=False)
    roots = []
    for raw in policy.get("trusted_roots", ["."]):
        p = Path(raw).expanduser()
        roots.append((cwd / p).resolve(strict=False) if not p.is_absolute() else p.resolve(strict=False))
    extensions = set(policy.get("script_extensions", [".sh", ".py", ".js", ".ps1"]))
    max_bytes = int(policy.get("max_script_bytes", 1048576))
    block = compile_patterns(policy, "block_patterns")
    review = compile_patterns(policy, "review_patterns")
    findings = scan_text(command, "outer-command", block, review)
    scripts, ambiguous = candidate_scripts(command, cwd, extensions)
    inspected = []
    if ambiguous:
        findings.append({"severity": "review", "source": "outer-command", "pattern": "inline-or-encoded-interpreter-code"})
    for script in scripts:
        resolved = script.resolve(strict=False)
        if not inside(resolved, roots):
            findings.append({"severity": "review", "source": str(resolved), "pattern": "outside-trusted-root"})
            continue
        try:
            data = resolved.read_bytes()
        except OSError as exc:
            findings.append({"severity": "block", "source": str(resolved), "pattern": f"unreadable-script:{type(exc).__name__}"})
            continue
        if len(data) > max_bytes:
            findings.append({"severity": "review", "source": str(resolved), "pattern": "script-too-large"})
            continue
        try:
            text = data.decode("utf-8")
        except UnicodeDecodeError:
            findings.append({"severity": "review", "source": str(resolved), "pattern": "non-utf8-script"})
            continue
        digest = hashlib.sha256(data).hexdigest()
        inspected.append({"path": str(resolved), "sha256": digest, "bytes": len(data)})
        findings.extend(scan_text(text, str(resolved), block, review))
    severity = "allow"
    if any(f["severity"] == "block" for f in findings): severity = "block"
    elif any(f["severity"] == "review" for f in findings): severity = "review"
    return {"decision": severity, "command_sha256": hashlib.sha256(command.encode()).hexdigest(), "inspected_scripts": inspected, "findings": findings}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--policy", required=True)
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--event-json")
    g.add_argument("--event-file")
    args = ap.parse_args()
    try:
        policy = load_policy(Path(args.policy))
        event_text = args.event_json if args.event_json is not None else Path(args.event_file).read_text(encoding="utf-8")
        event = load_json_text(event_text, "event")
        result = decide(event, policy)
        print(json.dumps(result, sort_keys=True))
        return EXIT[result["decision"]]
    except (OSError, ValueError, TypeError) as exc:
        print(json.dumps({"decision": "error", "error": str(exc)}), file=sys.stderr)
        return EXIT["error"]

if __name__ == "__main__":
    raise SystemExit(main())
