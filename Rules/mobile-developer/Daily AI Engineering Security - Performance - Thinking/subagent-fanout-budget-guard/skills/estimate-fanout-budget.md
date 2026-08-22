# Skill — Estimate Fan-out Budget

## Purpose
Decide whether proposed parallel delegation is likely to improve throughput without unacceptable aggregate token/context amplification.

## Trigger
Before spawning two or more subagents, or before retrying a failed child from a new context.

## Inputs
Parent context tokens, number of children, expected work tokens per child, retry bound, task descriptions/signatures, budget config, optional serial baseline.

## Preconditions
Use measured context/token values when available; otherwise label estimates explicitly.

## Required context
Only delegation descriptions and resource estimates. Do not load implementation context merely to run this gate.

## Allowed tools
`fanout_budget.py`, token counters, session telemetry, task manifests.

## Constraints
Performance claims require before/after measurements. Token budget must never override correctness-critical context.

## Procedure
1. Measure or estimate parent context size.
2. Define each child task and normalize its task signature.
3. Reject duplicate/effectively identical child assignments when distinctness is required.
4. Estimate inherited context using the configured ratio.
5. Add expected child work and bounded retry exposure.
6. Compare per-child, concurrency, and aggregate cost with policy thresholds.
7. If over budget, reduce fan-out, serialize work, shrink child context safely, or use deterministic tools.
8. After execution, record actual child usage and wall time.
9. Compare actual versus prediction and adjust future estimates only from observed evidence.

## Decision points
- Simple deterministic search/grep: prefer a deterministic tool over a full child agent.
- High parent context + low child work: strongly prefer scoped context or serialization.
- Independent high-work tasks with small inherited context: parallelism is more likely to pay off.
- Retry from blank context: charge the retry as a new child execution.

## Expected output
Decision (`allow`, `warn`, `block`), predicted aggregate tokens, predicted per-child tokens, amplification ratio versus serial estimate, reasons, and mitigation when blocked.

## Metrics
Prediction error, amplification ratio, useful output per child, retries, compactions, elapsed time, serial fallback rate.

## Verification
Observed usage must be reconciled after representative runs. Tighten policy if actual usage repeatedly exceeds estimate.

## Failure handling
Invalid/missing budget inputs return a blocking error for large fan-outs. Retry input collection once; do not guess unlimited capacity.

## Stop conditions
Stop after one policy evaluation plus at most one redesigned proposal.