#!/usr/bin/env python3
"""Validate JSONL traces for parallel tool-batch consistency invariants."""
from __future__ import annotations
import argparse, json, pathlib, sys
from collections import defaultdict

TERMINAL = {"succeeded", "failed", "rejected", "cancelled"}


def load_events(path: pathlib.Path):
    events = []
    for lineno, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            item = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"line {lineno}: invalid JSON: {exc}") from exc
        for key in ("batch_id", "event", "timestamp"):
            if key not in item:
                raise ValueError(f"line {lineno}: missing {key}")
        events.append((lineno, item))
    if not events:
        raise ValueError("trace is empty")
    return events


def analyze(events):
    errors, warnings = [], []
    batches = defaultdict(lambda: {"created": 0, "issued": set(), "starts": defaultdict(int), "terminals": defaultdict(list), "session_versions": set()})
    for lineno, e in events:
        b = batches[e["batch_id"]]
        event = e["event"]
        if "session_version" in e:
            b["session_versions"].add(str(e["session_version"]))
        if event == "batch_created":
            b["created"] += 1
            issued = e.get("tool_call_ids", [])
            if not isinstance(issued, list) or not all(isinstance(x, str) and x for x in issued):
                errors.append(f"line {lineno}: batch_created.tool_call_ids must be non-empty strings")
            if len(issued) != len(set(issued)):
                errors.append(f"line {lineno}: duplicate tool_call_ids in batch_created")
            b["issued"].update(issued)
            continue
        call_id = e.get("tool_call_id")
        if not isinstance(call_id, str) or not call_id:
            errors.append(f"line {lineno}: {event} missing tool_call_id")
            continue
        if event == "started":
            b["starts"][call_id] += 1
        elif event in TERMINAL:
            b["terminals"][call_id].append(event)

    summary = {}
    for batch_id, b in batches.items():
        if b["created"] != 1:
            errors.append(f"batch {batch_id}: expected exactly one batch_created, got {b['created']}")
        observed = set(b["starts"]) | set(b["terminals"])
        unknown = observed - b["issued"]
        for call_id in sorted(unknown):
            errors.append(f"batch {batch_id}: event for unissued call {call_id}")
        for call_id in sorted(b["issued"]):
            starts = b["starts"].get(call_id, 0)
            terms = b["terminals"].get(call_id, [])
            if starts != 1:
                errors.append(f"batch {batch_id} call {call_id}: expected one start, got {starts}")
            if len(terms) != 1:
                errors.append(f"batch {batch_id} call {call_id}: expected one terminal, got {len(terms)}")
        if len(b["session_versions"]) > 1:
            warnings.append(f"batch {batch_id}: multiple session versions observed: {sorted(b['session_versions'])}; verify versioned commits are intentional")
        summary[batch_id] = {"issued": len(b["issued"]), "started": sum(b["starts"].values()), "terminal": sum(len(v) for v in b["terminals"].values())}
    return {"ok": not errors, "errors": errors, "warnings": warnings, "batches": summary}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("trace", help="JSONL event trace")
    args = ap.parse_args()
    try:
        result = analyze(load_events(pathlib.Path(args.trace)))
    except (OSError, ValueError) as exc:
        print(json.dumps({"ok": False, "error": str(exc)}, indent=2))
        return 2
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["ok"] else 3

if __name__ == "__main__":
    raise SystemExit(main())
