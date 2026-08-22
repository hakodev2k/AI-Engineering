# Streaming Tool Dispatch Latency Profiler

## Category
Performance

## Problem
A streaming agent may have a complete, approved, guardrail-cleared tool call ready while the runtime still waits for later model output or message finalization before starting the tool. That idle gap increases critical-path latency and is hidden by coarse model/tool spans.

## Evidence
See `evidence/research.md`. Current public signals include OpenAI Agents SDK #3404 (eager tool dispatch) and #1282 (buffered streamed tool-call feedback), plus official tool-execution concurrency documentation.

## Existing approach
Parallel tool calls, local tool concurrency limits, tracing, and application-specific callbacks.

## Existing limitations
Parallelism cannot remove a dispatch delay that happens before the runtime starts an already-complete call. Aggregate traces do not distinguish safety/approval time from avoidable scheduler/message-finalization wait. Naive early dispatch can violate ordering or safety.

## Proposed improvement
Measure one explicit lifecycle for each call: arguments complete -> safety ready -> tool start -> tool end. Quantify dispatch wait from `max(call_complete, safety_ready)` to start, then optimize only calls that are both safe and measurably delayed.

## Architecture
- `evidence/research.md` — current signals, existing approaches, gaps and root causes.
- `skills/dispatch-latency-investigation.md` — evidence-driven investigation procedure.
- `rules/dispatch-performance-rules.md` — measurable performance and safety rules.
- `subagents/benchmark-verifier.md` — independent benchmark verification.
- `workflows/measure-optimize-verify.md` — bounded baseline-to-verification workflow.
- `hooks/dispatch-regression-check.md` — deterministic pre-release check.
- `scripts/dispatch_profiler.py` — dependency-free JSONL latency profiler.
- `tests/sample-trace.jsonl` — reference trace for validation.

## Installation
Python 3.9+ only; no third-party packages are required.

## Usage
From the package root:

`python scripts/dispatch_profiler.py tests/sample-trace.jsonl --threshold-ms 100`

Instrument the target runtime with the same fields: `call_id`, `tool`, `call_complete_ms`, `safety_ready_ms`, `tool_start_ms`, and `tool_end_ms`. Timestamps must use one monotonic clock domain.

## Workflow
Measure baseline -> diagnose where the wait occurs -> form a falsifiable hypothesis -> implement the smallest optimization -> measure the matched workload again -> independently verify metrics and safety. Maximum two optimization attempts before re-diagnosis/escalation.

## Metrics
Dispatch-wait p50/p95, tool-duration p50/p95, per-tool dispatch p50/p95, eager-opportunity ratio, end-to-end latency in the host benchmark, error rate, ordering violations and safety-order violations.

## Verification
The profiler returns exit 0 for structurally valid traces with no safety/timestamp violation, exit 2 for invalid input, and exit 3 for lifecycle violations. A real performance improvement is verified only by matched before/after workload data; `eager_opportunity_count` is a diagnostic opportunity estimate, not a claimed speedup.

## Safety
Tool start must never precede approval/authorization/input-guardrail readiness. Sequenced tools must not be reordered. State-changing operations should be benchmarked in an isolated environment or with reversible fixtures.

## Failure handling
Detection: invalid/negative timestamps, safety-order violation, no matched latency improvement, or correctness regression. Evidence: preserve raw traces and workload identifiers. Retry: at most two implementation attempts. Fallback: revert the dispatch change. Escalation: scheduler/framework owner. Stop condition: verified gain, evidence that dispatch is not material, or two failed attempts.

## Definition of Done
Evidence documented; representative baseline captured; dispatch bottleneck measured; root cause supported; improvement implemented; matched workload re-measured; p50/p95 reported; correctness/security/order tests pass; independent verification completes; no blocking issue remains.

## Status language
- **Implemented**: instrumentation/optimization exists.
- **Measured**: target before/after traces exist.
- **Verified**: matched benchmark improves and all semantic/security checks pass independently.
