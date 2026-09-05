#!/usr/bin/env python3
"""Validate tool-call journals and create conservative repaired copies.

Repair never fabricates successful output. It appends explicit cancellation events
for calls that remain unresolved at end of journal.
"""
from __future__ import annotations

import json
import sys
from dataclasses import dataclass
from pathlib import Path

TERMINAL = {"result", "cancel"}
VALID_TYPES = {"call", "result", "cancel", "note"}


@dataclass
class Report:
    malformed: list[str]
    duplicates: list[str]
    orphan_terminals: list[str]
    unresolved: list[str]

    @property
    def valid(self) -> bool:
        return not (self.malformed or self.duplicates or self.orphan_terminals or self.unresolved)


def read_events(path: Path) -> list[dict]:
    events: list[dict] = []
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError as exc:
        raise ValueError(f"cannot read {path}: {exc}") from exc
    for lineno, line in enumerate(lines, 1):
        if not line.strip():
            continue
        try:
            obj = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"line {lineno}: invalid JSON: {exc}") from exc
        if not isinstance(obj, dict):
            raise ValueError(f"line {lineno}: event must be an object")
        obj["__line__"] = lineno
        events.append(obj)
    return events


def analyze(events: list[dict]) -> Report:
    malformed: list[str] = []
    duplicates: list[str] = []
    orphan: list[str] = []
    open_calls: dict[str, int] = {}
    seen_calls: set[str] = set()

    for idx, event in enumerate(events, 1):
        line = event.get("__line__", idx)
        etype = event.get("type")
        if etype not in VALID_TYPES:
            malformed.append(f"line {line}: invalid type {etype!r}")
            continue
        if etype == "note":
            continue
        call_id = event.get("call_id")
        if not isinstance(call_id, str) or not call_id.strip():
            malformed.append(f"line {line}: {etype} requires non-empty call_id")
            continue
        if etype == "call":
            if call_id in seen_calls:
                duplicates.append(f"line {line}: duplicate call_id {call_id}")
                continue
            seen_calls.add(call_id)
            open_calls[call_id] = line
        elif etype in TERMINAL:
            if call_id not in open_calls:
                orphan.append(f"line {line}: {etype} without open call {call_id}")
            else:
                del open_calls[call_id]

    unresolved = [f"call {cid} opened at line {line} has no terminal event" for cid, line in open_calls.items()]
    return Report(malformed, duplicates, orphan, unresolved)


def unresolved_ids(events: list[dict]) -> list[str]:
    open_calls: dict[str, bool] = {}
    seen: set[str] = set()
    for event in events:
        etype = event.get("type")
        call_id = event.get("call_id")
        if not isinstance(call_id, str):
            continue
        if etype == "call" and call_id not in seen:
            seen.add(call_id)
            open_calls[call_id] = True
        elif etype in TERMINAL and call_id in open_calls:
            del open_calls[call_id]
    return list(open_calls.keys())


def print_report(report: Report) -> None:
    groups = [
        ("malformed", report.malformed),
        ("duplicates", report.duplicates),
        ("orphan_terminals", report.orphan_terminals),
        ("unresolved", report.unresolved),
    ]
    for name, items in groups:
        if items:
            print(f"{name}:")
            for item in items:
                print(f"- {item}")


def write_repaired(events: list[dict], output: Path) -> None:
    clean_events = []
    for event in events:
        clone = {k: v for k, v in event.items() if k != "__line__"}
        clean_events.append(clone)
    for call_id in unresolved_ids(events):
        clean_events.append({
            "type": "cancel",
            "call_id": call_id,
            "reason": "transcript_repair_unresolved_call_no_result_evidence",
        })
    try:
        output.write_text("".join(json.dumps(e, separators=(",", ":")) + "\n" for e in clean_events), encoding="utf-8")
    except OSError as exc:
        raise ValueError(f"cannot write {output}: {exc}") from exc


def main(argv: list[str]) -> int:
    if len(argv) not in {3, 4} or argv[1] not in {"validate", "repair"}:
        print(f"usage: {argv[0]} validate <transcript.jsonl> | repair <input.jsonl> <output.jsonl>", file=sys.stderr)
        return 1
    mode = argv[1]
    if mode == "repair" and len(argv) != 4:
        print("repair requires input and output paths", file=sys.stderr)
        return 1
    try:
        events = read_events(Path(argv[2]))
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    report = analyze(events)
    if mode == "validate":
        if report.valid:
            print(f"PASS: {len(events)} event(s), transcript structurally valid")
            return 0
        print("BLOCK: transcript invalid")
        print_report(report)
        return 2

    # Repair is intentionally conservative: malformed, duplicate, or orphan
    # structures require human/runtime-specific diagnosis. Only unresolved calls
    # can be safely closed as cancellations without inventing success.
    if report.malformed or report.duplicates or report.orphan_terminals:
        print("BLOCK: automatic repair supports unresolved calls only")
        print_report(report)
        return 2
    output = Path(argv[3])
    if output.resolve() == Path(argv[2]).resolve():
        print("ERROR: repair output must differ from input; original evidence is preserved", file=sys.stderr)
        return 1
    try:
        write_repaired(events, output)
        repaired = read_events(output)
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    after = analyze(repaired)
    if not after.valid:
        print("BLOCK: repaired copy is still invalid")
        print_report(after)
        return 2
    print(f"PASS: repaired copy written to {output}; unresolved calls closed as cancellations")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
