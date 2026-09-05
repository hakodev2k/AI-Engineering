# Agent Latency Attribution Profiler

**Category:** Performance  
**Run date:** 2026-09-05 (UTC+7)

## Problem
Agent runtimes can attribute human approval wait, orchestration overhead, queueing, or framework delay to the underlying tool itself. That produces false performance diagnoses and can trigger needless tool/code changes.

## Evidence
See `evidence/research.md`. Current signals: Codex #38731 (approval wait misattributed as tool execution), Codex #40087 (request to separate execution from agent overhead), Claude Code #81258 (5–10s fixed latency around MCP and built-in tools).

## Existing approach and limitation
OpenAI Agents SDK and OpenTelemetry GenAI tracing provide model/function/tool spans, but a coarse span can still conflate approval, queue, framework, execution, propagation, and resume phases.

## Proposed improvement
Record `requested`, `approval_started`, `approval_ended`, `dispatch_started`, `tool_started`, `tool_ended`, `result_received`, `turn_resumed`. The profiler derives mutually exclusive durations and blocks causal claims when coverage is insufficient.

## Package tree
- `evidence/research.md`
- `skills/latency-attribution.md`
- `rules/performance-measurement.md`
- `subagents/performance-reviewer.md`
- `workflows/measure-diagnose-optimize.md`
- `workflows/regression-verification.md`
- `hooks/post-run-profile.md`
- `scripts/latency_attribution.py`
- `config/thresholds.example.json`
- `tests/test_latency_attribution.py`

## Installation
Python 3.10+, standard library only.

## Usage
`python scripts/latency_attribution.py trace.jsonl config/thresholds.example.json`

## Metrics
p50/p95 E2E, approval wait, dispatch overhead, execution, result propagation, resume overhead, attribution coverage, throughput, errors.

## Verification
**Implemented:** profiler/rules/workflows/tests. **Measured:** before/after traces use equivalent workload. **Verified:** target phase and E2E improve without shifted delay, correctness regression, or weakened approvals.

## Safety
Never bypass approval for speed. Do not log secrets; timestamp/operation metadata is sufficient.

## Failure handling
Missing phase data blocks causal diagnosis. Repair instrumentation once. At most two optimization cycles.

## Definition of Done
Baseline captured; >=95% phase coverage; dominant phase evidenced; improvement measured; tests pass; independent reviewer verifies.