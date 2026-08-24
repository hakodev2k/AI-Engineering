#!/usr/bin/env python3
"""Deterministic pre-render gate for remote A2A AgentCard metadata."""
from __future__ import annotations
import argparse, hashlib, json, re, sys
from pathlib import Path

DEFAULT_PATTERNS = [
    r"\bignore\b.{0,40}\b(previous|prior|system|developer|instructions?)\b",
    r"\b(system|developer)\s+(override|message|instruction)\b",
    r"\bdo not (tell|reveal|mention)\b",
    r"\bexecute\b.{0,40}\b(command|shell|script|tool)\b",
    r"\bexfiltrat(e|ion)\b|\bsteal\b.{0,30}\b(secret|token|credential)\b",
]
TEXT_FIELDS = [("description",), ("skills", "*", "name"), ("skills", "*", "description")]

def load_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as e:
        raise ValueError(f"cannot parse {path}: {e}") from e

def iter_values(card, spec):
    if spec == ("description",):
        v = card.get("description") if isinstance(card, dict) else None
        if isinstance(v, str): yield "description", v
        return
    skills = card.get("skills", []) if isinstance(card, dict) else []
    if not isinstance(skills, list): return
    key = spec[-1]
    for i, skill in enumerate(skills):
        if isinstance(skill, dict) and isinstance(skill.get(key), str):
            yield f"skills[{i}].{key}", skill[key]

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("card")
    ap.add_argument("--policy", default=None)
    ap.add_argument("--normalized-out")
    args = ap.parse_args()
    try:
        raw = Path(args.card).read_bytes()
        card = json.loads(raw.decode("utf-8"))
        if not isinstance(card, dict): raise ValueError("AgentCard root must be an object")
        policy = {"max_text_length": 2000, "strict": True, "instruction_patterns": DEFAULT_PATTERNS}
        if args.policy:
            supplied = load_json(Path(args.policy))
            if not isinstance(supplied, dict): raise ValueError("policy root must be an object")
            policy.update(supplied)
        max_len = int(policy["max_text_length"])
        pats = [re.compile(p, re.I | re.S) for p in policy.get("instruction_patterns", DEFAULT_PATTERNS)]
    except (OSError, UnicodeError, json.JSONDecodeError, ValueError, TypeError, re.error) as e:
        print(json.dumps({"decision":"error","error":str(e)}))
        return 64
    findings = []
    for spec in TEXT_FIELDS:
        for path, text in iter_values(card, spec):
            if len(text) > max_len:
                findings.append({"path":path,"reason":"text_too_long","length":len(text)})
            for idx, pat in enumerate(pats):
                if pat.search(text):
                    findings.append({"path":path,"reason":"instruction_like_text","pattern_index":idx})
                    break
    normalized = {
        "name": card.get("name"),
        "url": card.get("url"),
        "description": card.get("description"),
        "skills": [{k:s.get(k) for k in ("id","name","description","tags") if k in s}
                   for s in card.get("skills", []) if isinstance(s, dict)],
        "source_sha256": hashlib.sha256(raw).hexdigest(),
        "trust": "remote-data-only"
    }
    decision = "block" if findings else "allow"
    result = {"decision": decision, "findings": findings, "normalized": normalized}
    if args.normalized_out and decision == "allow":
        Path(args.normalized_out).write_text(json.dumps(normalized, indent=2, sort_keys=True), encoding="utf-8")
    print(json.dumps(result, sort_keys=True))
    return 2 if findings else 0

if __name__ == "__main__":
    sys.exit(main())
