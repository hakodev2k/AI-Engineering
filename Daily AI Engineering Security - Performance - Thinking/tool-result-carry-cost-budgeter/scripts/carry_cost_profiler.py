#!/usr/bin/env python3
"""Attribute cumulative retained-turn token cost to individual tool results.

JSONL event schema:
  {"type":"tool_result","turn":1,"id":"r1","tokens":1200,"tool":"search"}
  {"type":"model_turn","turn":2}
  {"type":"evict","turn":4,"id":"r1"}

A result contributes `tokens` once as direct cost and again for each later model_turn
that occurs before its evict event (or end of trace). Exit: 0 pass, 2 budget fail,
3 invalid input/config.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path


def read_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc


def load_events(path: Path):
    events = []
    seen = set()
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError as exc:
        raise ValueError(f"cannot read trace {path}: {exc}") from exc
    for line_no, line in enumerate(lines, 1):
        if not line.strip():
            continue
        try:
            e = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"invalid JSON line {line_no}: {exc}") from exc
        if not isinstance(e, dict) or e.get("type") not in {"tool_result", "model_turn", "evict"}:
            raise ValueError(f"line {line_no}: unsupported event type")
        if not isinstance(e.get("turn"), int) or e["turn"] < 0:
            raise ValueError(f"line {line_no}: turn must be a non-negative integer")
        if e["type"] == "tool_result":
            rid = e.get("id")
            tokens = e.get("tokens")
            if not isinstance(rid, str) or not rid or rid in seen:
                raise ValueError(f"line {line_no}: tool_result id must be unique non-empty string")
            if not isinstance(tokens, int) or tokens < 0:
                raise ValueError(f"line {line_no}: tokens must be a non-negative integer")
            seen.add(rid)
        elif e["type"] == "evict":
            if not isinstance(e.get("id"), str) or not e["id"]:
                raise ValueError(f"line {line_no}: evict requires non-empty id")
        e["_index"] = len(events)
        events.append(e)
    return events


def profile(events, cfg):
    results = {}
    active = {}
    model_turns = 0
    for e in events:
        typ = e["type"]
        if typ == "tool_result":
            rec = {
                "id": e["id"], "tool": str(e.get("tool", "unknown")),
                "created_turn": e["turn"], "tokens": e["tokens"],
                "carried_model_turns": 0, "carry_tokens": 0
            }
            results[e["id"]] = rec
            active[e["id"]] = rec
        elif typ == "model_turn":
            model_turns += 1
            for rec in active.values():
                if e["turn"] > rec["created_turn"]:
                    rec["carried_model_turns"] += 1
                    rec["carry_tokens"] += rec["tokens"]
        elif typ == "evict":
            active.pop(e["id"], None)

    direct = sum(r["tokens"] for r in results.values())
    carry = sum(r["carry_tokens"] for r in results.values())
    total = direct + carry
    amplification = (total / direct) if direct else 1.0
    top_n = int(cfg.get("top_n", 10))
    ranked = sorted(results.values(), key=lambda r: (r["carry_tokens"], r["tokens"]), reverse=True)[:max(0, top_n)]

    violations = []
    max_direct = int(cfg.get("max_direct_tool_result_tokens", 2**63 - 1))
    max_carry = int(cfg.get("max_cumulative_carry_tokens", 2**63 - 1))
    max_amp = float(cfg.get("max_carry_amplification_ratio", float("inf")))
    if direct > max_direct:
        violations.append({"metric":"direct_tool_result_tokens","actual":direct,"limit":max_direct})
    if carry > max_carry:
        violations.append({"metric":"cumulative_carry_tokens","actual":carry,"limit":max_carry})
    if amplification > max_amp:
        violations.append({"metric":"carry_amplification_ratio","actual":round(amplification, 6),"limit":max_amp})

    return {
        "status": "fail" if violations else "pass",
        "model_turns": model_turns,
        "tool_results": len(results),
        "direct_tool_result_tokens": direct,
        "cumulative_carry_tokens": carry,
        "total_attributed_tokens": total,
        "carry_amplification_ratio": round(amplification, 6),
        "top_contributors": ranked,
        "violations": violations
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("trace", type=Path)
    ap.add_argument("--config", required=True, type=Path)
    ap.add_argument("--report", type=Path)
    args = ap.parse_args()
    try:
        if not args.trace.is_file():
            raise ValueError(f"trace not found: {args.trace}")
        cfg = read_json(args.config)
        if not isinstance(cfg, dict):
            raise ValueError("config must be a JSON object")
        result = profile(load_events(args.trace), cfg)
    except (ValueError, OSError) as exc:
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
