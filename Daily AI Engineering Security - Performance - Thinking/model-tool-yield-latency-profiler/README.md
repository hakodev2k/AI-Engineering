# Model-Tool Yield Latency Profiler

**Category:** Performance

## Problem
Agent runtimes often optimize raw tool execution while ignoring the latency paid every time control returns to the model between independent operations. Recent 2026 evidence shows multi-second fixed overhead around tool dispatch and independent subagent calls being serialized even when parallel execution is appropriate. OpenAI now explicitly describes tool yields as a better latency proxy than tool-call count because parallel calls share a yield.

## Evidence
See `evidence/research.md`.

## Proposed improvement
Instrument traces at the model↔tool boundary, measure wall-clock cost per yield, detect independent calls that are unnecessarily serialized, and recommend one of three evidence-based transformations: bounded parallel batching, programmatic tool execution for deterministic chains, or no change when ordering/approval/mutation dependencies require sequential execution.

## Package tree
```text
model-tool-yield-latency-profiler/
├── README.md
├── evidence/research.md
├── skills/tool-yield-performance-analysis.md
├── rules/yield-optimization-rules.md
├── subagents/trace-performance-reviewer.md
├── workflows/measure-diagnose-optimize.md
├── hooks/post-run-yield-regression-gate.md
├── scripts/analyze_tool_yields.py
└── tests/test_analyze_tool_yields.py
```

## Installation
Python 3.10+, standard library only.

## Input format
JSONL events with:
- `ts_ms`: monotonic or consistently sourced timestamp in milliseconds;
- `type`: `model_start`, `model_end`, `tool_start`, `tool_end`;
- `call_id`: required for tool events;
- `tool`: optional tool name;
- `dependency_group`: optional explicit dependency label.

## Usage
```bash
python scripts/analyze_tool_yields.py trace.jsonl --json
python scripts/analyze_tool_yields.py trace.jsonl --max-yield-p95-ms 2500
```

## Metrics
- tool yields/task;
- p50/p95 yield duration;
- tool active time vs orchestration/model-gap time;
- serializable-independent sequence count;
- potential wall-clock time saved from safe batching;
- regression delta against a baseline report.

## Workflow
Use `workflows/measure-diagnose-optimize.md`: capture baseline, analyze trace, classify dependencies, choose bounded parallelism/programmatic execution only where justified, re-run the identical workload, and compare latency without weakening correctness.

## Verification
```bash
python -m unittest tests/test_analyze_tool_yields.py -v
```
A performance improvement is verified only when the same representative workload has fewer yields or lower p95 yield latency, the result remains correct, and no approval/order/mutation invariant is lost.

## Safety and correctness
Do not parallelize operations merely because they are adjacent. Calls that mutate shared state, depend on prior results, require ordered approvals, or have coupled failure semantics remain sequential. Optimization MUST preserve cancellation, idempotency, authorization and evidence guarantees.

## Failure handling
Malformed traces fail analysis with exit `1`. Threshold regressions exit `2`. Optimization trials are bounded to two strategy revisions before escalation.

## Definition of Done
Baseline captured; bottleneck localized; dependency assumptions documented; optimization implemented; same workload re-measured; correctness/regression checks pass; p95/tool-yield metrics improve or the attempted optimization is rejected with evidence.