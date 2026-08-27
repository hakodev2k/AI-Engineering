# Workflow: Observe → Recover → Verify

## Trigger
Parent wait exceeds expected latency, a child stops reporting meaningful progress, or cleanup blocks.

## Goal
Reach a bounded, evidence-backed terminal state without allowing one child to stall the entire workflow indefinitely.

## Inputs
Child ledger, `config/policy.json`, task acceptance criteria, child outputs.

## Baseline
Record expected child duration, required quorum, downstream verification stage, and current barrier policy before intervention.

## Context
Facts and externally observable events only. Hidden chain-of-thought is out of scope.

## Stages
1. **Observe** — capture statuses, start times, last meaningful progress, and outputs.
2. **Measure baseline** — compare elapsed/idle times with declared policy.
3. **Diagnose** — run `scripts/barrier_watchdog.py` and classify stalled/failed children.
4. **Form hypothesis** — choose one concrete cause that can be tested from logs/state.
5. **Recover** — permit at most one changed recovery attempt per stalled child.
6. **Measure again** — rerun watchdog and check whether quorum/acceptance evidence is available.
7. **Verify** — independent Barrier Verification Agent reviews the complete ledger.

## Responsible agent
Orchestration owner diagnoses and recovers; Barrier Verification Agent verifies.

## Tools
Runtime status/log APIs, watchdog script, unit/acceptance tests.

## Outputs
Barrier decision, child terminal ledger, recovery evidence, verification result.

## Checkpoints
Before recovery; after recovery; before degraded release; before final completion.

## Metrics
Barrier wall time, idle-progress violations, verification reach rate, recovery count, parent duplicate-work rate.

## Retry policy
Maximum one recovery attempt per child.

## Stop conditions
Stop when quorum is reached, quorum is impossible, a required irreversible operation lacks approval, or the single recovery attempt fails.

## Failure path
Return `blocked` with missing evidence and terminal child states; do not weaken acceptance criteria.

## Verification
Independent verifier checks both policy compliance and actual downstream artifacts.

## Definition of Done
Implemented watchdog is active; Measured child timings are recorded; Verified decision and required outputs pass independent review.
