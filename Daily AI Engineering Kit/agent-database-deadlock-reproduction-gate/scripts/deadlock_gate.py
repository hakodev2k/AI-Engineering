#!/usr/bin/env python3
from __future__ import annotations
import argparse, json, sys
from pathlib import Path
from typing import Any, Dict, List, Set, Tuple


def load(path: Path) -> Dict[str, Any]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as e:
        raise ValueError(f"input not found: {path}") from e
    except json.JSONDecodeError as e:
        raise ValueError(f"invalid JSON in {path}: {e}") from e
    if not isinstance(data, dict) or not isinstance(data.get("runs"), list) or not data["runs"]:
        raise ValueError("capture must contain non-empty runs array")
    return data


def validate_run(run: Dict[str, Any]) -> None:
    if not isinstance(run, dict) or not isinstance(run.get("run_id"), str):
        raise ValueError("run requires string run_id")
    txs = run.get("transactions")
    edges = run.get("wait_edges")
    if not isinstance(txs, list) or not isinstance(edges, list):
        raise ValueError(f"run {run.get('run_id')} requires transactions and wait_edges arrays")
    ids = set()
    for tx in txs:
        if not isinstance(tx, dict) or not isinstance(tx.get("id"), str) or not tx["id"]:
            raise ValueError(f"run {run['run_id']} has invalid transaction")
        if tx["id"] in ids:
            raise ValueError(f"run {run['run_id']} duplicate transaction {tx['id']}")
        ids.add(tx["id"])
    for edge in edges:
        if not isinstance(edge, dict) or not all(isinstance(edge.get(k), str) and edge[k] for k in ("waiter", "holder", "resource")):
            raise ValueError(f"run {run['run_id']} has invalid wait edge")
        if edge["waiter"] not in ids or edge["holder"] not in ids:
            raise ValueError(f"run {run['run_id']} edge references unknown transaction")


def find_cycles(run: Dict[str, Any]) -> List[List[str]]:
    validate_run(run)
    graph: Dict[str, List[str]] = {tx["id"]: [] for tx in run["transactions"]}
    for e in run["wait_edges"]:
        graph[e["waiter"]].append(e["holder"])
    cycles: Set[Tuple[str, ...]] = set()

    def canonical(nodes: List[str]) -> Tuple[str, ...]:
        body = nodes[:-1]
        rotations = [tuple(body[i:] + body[:i]) for i in range(len(body))]
        return min(rotations)

    def dfs(start: str, node: str, path: List[str], seen: Set[str]) -> None:
        for nxt in graph.get(node, []):
            if nxt == start:
                cycles.add(canonical(path + [start]))
            elif nxt not in seen:
                dfs(start, nxt, path + [nxt], seen | {nxt})

    for start in sorted(graph):
        dfs(start, start, [start], {start})
    return [list(c) + [c[0]] for c in sorted(cycles)]


def summarize(capture: Dict[str, Any]) -> Dict[str, Any]:
    runs = []
    deadlock_runs = 0
    for run in capture["runs"]:
        cycles = find_cycles(run)
        if cycles:
            deadlock_runs += 1
        runs.append({"run_id": run["run_id"], "cycle_count": len(cycles), "cycles": cycles})
    return {"run_count": len(runs), "deadlock_runs": deadlock_runs, "clean_runs": len(runs) - deadlock_runs, "runs": runs}


def evaluate(baseline: Dict[str, Any], candidate: Dict[str, Any], min_baseline: int, min_candidate: int) -> Dict[str, Any]:
    b = summarize(baseline)
    c = summarize(candidate)
    findings = []
    if b["deadlock_runs"] < min_baseline:
        findings.append({"severity": "blocking", "kind": "baseline_not_reproduced", "detail": f"need >= {min_baseline} deadlock baseline run(s)"})
    if c["run_count"] < min_candidate:
        findings.append({"severity": "blocking", "kind": "insufficient_candidate_runs", "detail": f"need >= {min_candidate} candidate run(s)"})
    if c["deadlock_runs"] > 0:
        findings.append({"severity": "blocking", "kind": "candidate_deadlock_present", "detail": f"{c['deadlock_runs']} candidate run(s) contain wait-for cycles"})
    status = "fail" if findings else "pass"
    return {"status": status, "baseline": b, "candidate": c, "findings": findings}


def main() -> int:
    p = argparse.ArgumentParser(description="Evidence gate for database deadlock reproduction")
    p.add_argument("--baseline", required=True, type=Path)
    p.add_argument("--candidate", required=True, type=Path)
    p.add_argument("--output", required=True, type=Path)
    p.add_argument("--min-baseline-runs", type=int, default=1)
    p.add_argument("--min-candidate-runs", type=int, default=3)
    a = p.parse_args()
    if a.min_baseline_runs < 1 or a.min_candidate_runs < 1:
        print("minimum run counts must be >= 1", file=sys.stderr); return 2
    try:
        report = evaluate(load(a.baseline), load(a.candidate), a.min_baseline_runs, a.min_candidate_runs)
    except ValueError as e:
        print(f"validation error: {e}", file=sys.stderr); return 2
    a.output.parent.mkdir(parents=True, exist_ok=True)
    a.output.write_text(json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    if report["status"] == "fail":
        print("deadlock reproduction gate failed", file=sys.stderr); return 1
    print("deadlock reproduction gate passed"); return 0

if __name__ == "__main__":
    raise SystemExit(main())
