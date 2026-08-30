# Agentic Control-Plane Bottleneck Profiler

**Category:** Performance

## Problem
Agent workloads are not dominated only by model inference. Recent production-scale and benchmark evidence shows that tool execution, sandbox work, retrieval, retries, orchestration, idle state, and repeated external calls can dominate end-to-end latency and resource use. Teams that optimize only tokens/sec or model latency can miss the actual bottleneck.

## Evidence
See `evidence/research.md`. Current signals include AgentSysBench (August 15, 2026), Microsoft Research's production-scale GitHub Copilot characterization (July/August 2026), and a production tool-execution dataset published August 19, 2026.

## Existing approach
Most agent stacks expose per-call model latency and some tracing. Teams commonly inspect average response latency or provider dashboards, then optimize the LLM path first.

## Existing limitations
Agent bottlenecks shift across tasks and components. Averages hide long tails, retries, waiting, redundant search/fetch calls, and non-LLM work. Existing tracing also does not necessarily classify productive versus redundant calls or connect retry amplification to wall-clock latency.

## Proposed improvement
A reusable profiler that:

1. captures per-step spans across LLM, tool, retrieval, sandbox, queue, and orchestration work;
2. establishes a baseline before optimization;
3. identifies dominant and long-tail stages;
4. detects repeated external calls and retry amplification;
5. forms one optimization hypothesis at a time;
6. replays the same workload and verifies improvement with a quality floor.

## Architecture
```text
README.md
evidence/research.md
skills/agent-bottleneck-audit.md
rules/performance-measurement-rules.md
subagents/performance-investigator.md
subagents/benchmark-verifier.md
workflows/measure-diagnose-optimize.md
hooks/premerge-performance-gate.md
scripts/agent_trace_profiler.py
tests/test_agent_trace_profiler.py
```

## Installation
Python 3.10+; standard library only for the profiler and tests.

## Input format
JSON or JSONL span records. Required: `task_id`, `kind`, `duration_ms`. Optional: `call_key`, `success`, `retry_of`, `quality_pass`, `tokens`, `bytes`, `timestamp`.

## Usage
```bash
python scripts/agent_trace_profiler.py baseline.jsonl --json-out baseline-report.json
python scripts/agent_trace_profiler.py candidate.jsonl --compare baseline-report.json --json-out candidate-report.json
python -m unittest tests/test_agent_trace_profiler.py
```

## Workflow
Follow `workflows/measure-diagnose-optimize.md`: **Measure → Diagnose → Hypothesize → Optimize → Measure again → independent verification**. Optimization loops are bounded to two attempts per hypothesis.

## Metrics
- task latency p50/p95
- latency share by component kind
- external tool/retrieval call count per task
- duplicate call rate
- retry amplification ratio
- failed-call latency
- LLM/tool/retrieval/sandbox/queue time
- quality pass rate

## Verification
**Implemented:** instrumentation and the targeted optimization exist.  
**Measured:** identical representative workload is replayed before and after.  
**Verified:** latency/call/resource metric improves without quality regression beyond the configured floor.

## Safety
Do not remove validation, security checks, required context, or human approval to improve performance. Caching and deduplication must not cross authorization or tenant boundaries.

## Failure handling
If instrumentation is incomplete, stop optimization and fix measurement first. Retry transient benchmark infrastructure failures at most twice. If two optimization attempts fail, revert to the last known-good implementation and escalate with evidence.

## Definition of Done
Baseline captured; bottleneck supported by traces; hypothesis documented; improvement implemented; benchmark replayed; before/after report complete; quality floor preserved; independent verifier signs off; no blocking regression remains.

## Customization
Map framework-specific span names into canonical `kind` values while preserving task IDs and stable call keys so comparisons remain reproducible.
