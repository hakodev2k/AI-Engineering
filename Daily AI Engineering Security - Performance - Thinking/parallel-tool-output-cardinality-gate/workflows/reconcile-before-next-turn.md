# Workflow — Reconcile Before Next Model Turn

## Trigger
A model turn emits two or more tool calls, or any tool call passes through approval, streaming, guardrail, cancellation, structured-output, or resume logic.

## Goal
Ensure one-to-one terminal accounting for tool calls without sacrificing parallel execution.

## Inputs
Turn ID, emitted calls, terminal events, persistence state, provider acknowledgement state, approval/guardrail outcomes.

## Baseline
Measure tool-call count, parallel execution duration, provider 4xx rate, orphan rate, duplicate terminal rate, and total turn latency before enabling the gate.

## Stages
1. **Observe** — record all emitted call IDs and tool names.
2. **Register** — create the expected-call ledger before starting any tool.
3. **Execute** — run safe independent tools in parallel.
4. **Terminalize** — record one explicit terminal disposition per call.
5. **Persist** — store terminal records with separate `persisted` and `sent` markers.
6. **Reconcile** — compare expected IDs with terminal records after approvals, guardrails, cancellations, and resume hydration.
7. **Repair once** — if records are missing because state was generated/persisted but not sent, reconstruct the outgoing set from authoritative persisted state.
8. **Preflight** — run `scripts/check_cardinality.py` immediately before the next model request.
9. **Block or continue** — continue only on a complete ledger; otherwise stop and emit evidence.
10. **Measure again** — compare errors, throughput, tool-call count, and latency against baseline.

## Responsible agent
The executor records lifecycle events. A deterministic gate owns the final preflight decision; the executor MUST NOT be the sole verifier.

## Tools
Framework event stream, session store, provider conversation metadata, deterministic script, regression tests, benchmark harness.

## Outputs
Turn ledger, integrity report, reconciliation record, decision, and before/after metrics.

## Checkpoints
- C1 all emitted calls registered.
- C2 each terminal event typed explicitly.
- C3 persisted/sent states separated.
- C4 resume state reconciled.
- C5 preflight cardinality complete.

## Metrics
Orphan rate, duplicate terminal rate, missing-result provider errors, reconciliation count, verification latency, parallel throughput, total turn latency.

## Retry policy
One reconciliation attempt maximum for a given turn. No repeated model calls are allowed while the ledger remains incomplete.

## Stop conditions
Complete when every required call has exactly one terminal disposition and outgoing/provider state agrees. Block after one failed reconciliation or any conflicting duplicate terminal state.

## Failure path
Preserve state, do not send the next model request, log missing/duplicate IDs, and escalate to framework-specific recovery. Never invent an output.

## Verification
Replay mixed parallel fixtures and compare with baseline. The gate must eliminate structural missing-output requests while staying within the configured performance budget.

## Definition of Done
Implemented: ledger and preflight are integrated. Measured: baseline and post-change metrics captured. Verified: all fixtures pass, orphan and duplicate rates are zero, and no provider request is sent with incomplete required outputs.
