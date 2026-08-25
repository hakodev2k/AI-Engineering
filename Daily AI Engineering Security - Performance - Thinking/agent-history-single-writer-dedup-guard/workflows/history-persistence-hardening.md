# Workflow: History Persistence Hardening

## Trigger
Token/context growth, duplicate transcript evidence, history-provider changes, checkpoint/transport composition, or provider pairing errors.

## Goal
Eliminate persistence-caused duplicate context while preserving correctness and durability.

## Inputs
Persistence topology, event trace, representative workload, token metrics.

## Baseline
Run the same workload before changes and capture turns, unique message IDs, append events, history bytes, input tokens, cost, latency, and structural errors.

## Context
Document every writer/loader and whether its payload is a full snapshot, append delta, or replacement.

## Stages
1. **Observe** — instrument writer IDs and stable message IDs.
2. **Measure baseline** — run guard and token/context accounting.
3. **Diagnose** — locate duplicate ownership or full-state-as-delta boundary.
4. **Form hypothesis** — select one authoritative writer/idempotency correction.
5. **Implement improvement** — disable secondary append or enforce unseen-ID delta commit; preserve required load/durability behavior.
6. **Measure again** — replay the same workload.
7. **Improved?** If duplicate count is not zero or token use does not improve where duplication existed, revise once; maximum two cycles.
8. **Verify correctness** — validate tool-call/result pairing, context coverage, quality/regression rate.
9. **Independent review** — `history-budget-verifier` checks evidence.
10. **Complete** — only when both efficiency and correctness criteria pass.

## Responsible agent
Performance/token implementer stages 1–8; independent verifier stage 9.

## Tools
`python scripts/history_write_guard.py`, runtime telemetry, provider usage metrics, transcript structural tests.

## Outputs
Before/after report, ownership map, guard report, verifier decision.

## Checkpoints
After baseline, after each correction, after structural/quality verification.

## Metrics
Append amplification, duplicate commits, tokens/task, cost/task, history bytes, context utilization, provider errors, quality regression.

## Retry policy
Maximum two implementation cycles, each requiring a changed evidence-backed hypothesis.

## Stop conditions
Success: zero duplicate commits, one append writer, measured savings, no correctness regression. Failure: identity unavailable, duplication persists after two cycles, or required context/quality regresses.

## Failure path
Restore prior safe persistence behavior if necessary; keep instrumentation; escalate ownership architecture rather than truncating uncertain history.

## Verification
Run included tests and target integration benchmark with identical multi-turn/tool workload before and after.

## Definition of Done
Measured baseline and post-change comparison, zero duplicate stable IDs, one writer, lower duplication-caused token overhead, valid conversation structure, independent verification.