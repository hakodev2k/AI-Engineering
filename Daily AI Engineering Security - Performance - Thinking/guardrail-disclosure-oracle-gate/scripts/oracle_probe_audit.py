#!/usr/bin/env python3
"""Audit denial/refusal transcripts for security-sensitive disclosure.

Input JSONL records require: {"sequence_id": str, "response": str}
Optional fields: turn, denied, reason_code.
Exit codes: 0 pass, 2 policy violation, 3 invalid input/config.
"""
from __future__ import annotations
import argparse, json, re, sys
from pathlib import Path


def load_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read config {path}: {exc}") from exc


def compile_patterns(cfg):
    out = []
    for raw in cfg.get("protected_patterns", []):
        try:
            out.append((raw, re.compile(raw)))
        except re.error as exc:
            raise ValueError(f"invalid regex {raw!r}: {exc}") from exc
    return out


def audit(transcript: Path, cfg: dict):
    literals = [str(x) for x in cfg.get("protected_literals", [])]
    patterns = compile_patterns(cfg)
    max_response = int(cfg.get("max_matches_per_response", 0))
    max_sequence = int(cfg.get("max_unique_matches_per_sequence", 0))
    public_codes = set(map(str, cfg.get("public_reason_codes", [])))
    violations, seq_hits = [], {}
    rows = 0
    with transcript.open("r", encoding="utf-8") as handle:
        for lineno, line in enumerate(handle, 1):
            if not line.strip():
                continue
            rows += 1
            try:
                rec = json.loads(line)
            except json.JSONDecodeError as exc:
                raise ValueError(f"invalid JSONL at line {lineno}: {exc}") from exc
            if not isinstance(rec, dict) or not isinstance(rec.get("sequence_id"), str) or not isinstance(rec.get("response"), str):
                raise ValueError(f"line {lineno} requires string sequence_id and response")
            sid, text = rec["sequence_id"], rec["response"]
            hits = []
            low = text.casefold()
            for lit in literals:
                if lit.casefold() in low:
                    hits.append(f"literal:{lit}")
            for raw, pat in patterns:
                if pat.search(text):
                    hits.append(f"pattern:{raw}")
            if rec.get("denied") is True and rec.get("reason_code") not in (None, "") and str(rec.get("reason_code")) not in public_codes:
                hits.append(f"nonpublic_reason_code:{rec.get('reason_code')}")
            unique = sorted(set(hits))
            seq_hits.setdefault(sid, set()).update(unique)
            if len(unique) > max_response:
                violations.append({"line": lineno, "sequence_id": sid, "type": "response_budget", "matches": unique})
    for sid, hits in sorted(seq_hits.items()):
        if len(hits) > max_sequence:
            violations.append({"sequence_id": sid, "type": "sequence_budget", "matches": sorted(hits)})
    return {"records": rows, "sequences": len(seq_hits), "violations": violations, "status": "fail" if violations else "pass"}


def main():
    p = argparse.ArgumentParser()
    p.add_argument("transcript", type=Path)
    p.add_argument("--config", type=Path, required=True)
    p.add_argument("--report", type=Path)
    args = p.parse_args()
    try:
        if not args.transcript.is_file():
            raise ValueError(f"transcript not found: {args.transcript}")
        cfg = load_json(args.config)
        result = audit(args.transcript, cfg)
    except (OSError, ValueError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 3
    rendered = json.dumps(result, indent=2, sort_keys=True)
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(rendered + "\n", encoding="utf-8")
    print(rendered)
    return 2 if result["violations"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
