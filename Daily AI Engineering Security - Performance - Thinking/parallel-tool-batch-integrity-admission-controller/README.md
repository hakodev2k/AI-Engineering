# Parallel Tool Batch Integrity Admission Controller

**Category:** Performance  
**Run date:** 2026-09-05 (UTC+7)

## Problem
Parallel tool execution reduces wall-clock latency only when the runtime can reliably return every result. A recent Hermes Agent issue reports a sharp failure threshold: batches of 1–3 parallel calls reliably return results, while batches of 4+ lose every result as `Result unavailable`. Other agent frameworks show the adjacent trade-off: sequential execution causes additive latency, while parallel execution requires explicit safety, completion, and state-handling controls.

## Evidence
See `evidence/research.md`.

## Existing approach
Frameworks support fixed concurrency limits, sequential fallback, provider/model guidance, per-tool parallel-safety declarations, and timeouts. OpenHands explicitly treated safe parallel-tool execution as a staged roadmap with analysis, benchmarking, implementation, validation, and gradual rollout.

## Remaining limitation
A static concurrency number is rarely validated against actual result-delivery integrity. Prompt-only guidance cannot enforce a hard cap. A runtime can report successful tool execution while losing the corresponding outputs before they re-enter model context, creating wasted work and retry amplification.

## Proposed improvement
Introduce an admission controller backed by measured batch-integrity telemetry. Before increasing concurrency, replay representative workloads, compute per-batch completeness and latency, determine the largest concurrency level that meets an integrity SLO, and hard-cap batches at that verified level. Every admitted batch receives an expected-result ledger; incomplete result delivery blocks continuation and triggers bounded serial/low-concurrency recovery.

## Architecture
- `evidence/research.md` — current signals and root cause.
- `skills/batch-baseline-analysis.md` — measure and diagnose.
- `rules/parallel-execution.md` — enforceable performance/reliability rules.
- `subagents/benchmark-verifier.md` — independent measurement role.
- `workflows/benchmark-and-tune.md` — baseline/tuning workflow.
- `workflows/failure-recovery.md` — bounded degraded-mode recovery.
- `hooks/preflight.md` — blocks unverified concurrency increases.
- `scripts/analyze_parallel_batches.py` — deterministic trace analyzer.
- `config/slo.example.json` — integrity/latency SLO.
- `tests/test_analyze_parallel_batches.py` — regression tests.

## Installation
Python 3.10+, standard library only.

## Trace format
JSONL, one completed batch per line: `batch_id`, `concurrency`, `expected`, `received`, `latency_ms`, `status`. `expected` and `received` are arrays of tool-call IDs.

## Usage
`python scripts/analyze_parallel_batches.py config/slo.example.json traces.jsonl`

Exit 0 means at least one concurrency level satisfies the SLO and the report prints the maximum verified level. Exit 3 means no tested level satisfies the SLO. Exit 1 means invalid input.

## Workflow
Measure current traces -> establish baseline by concurrency -> identify loss/latency threshold -> set hypothesis -> apply hard cap/admission controller -> replay -> compare -> independent verification -> gradual rollout.

## Metrics
Batch completeness rate; missing results/batch; p95 batch latency; tool calls/task; retries/task; wasted completed calls whose results were lost; task success; maximum verified concurrency.

## Verification
**Implemented:** analyzer, SLO config, rules, workflows, and tests.  
**Measured:** baseline and post-change traces are compared by concurrency.  
**Verified:** selected concurrency meets completeness and p95 latency SLO on representative tests; missing-result fixtures are detected; recovery is bounded.

## Safety
Never parallelize state-mutating tools solely for speed. Unknown tool conflict semantics default to sequential execution. Security/approval gates remain authoritative and cannot be bypassed by batching.

## Failure handling
On incomplete result delivery, stop the current model continuation, preserve the ledger, and retry at a lower concurrency once. A second failure forces serial execution or escalation. Never repeatedly resend the same mutating call without idempotency evidence.

## Definition of Done
Evidence documented; baseline captured; safe concurrency measured; hard cap configured; trace completeness SLO passes; latency measured; recovery test passes; no parallel state-conflict regression; independent verifier signs off.

## Customization
Add throughput or cost SLOs and domain-specific conflict classes while preserving result completeness as a blocking invariant.