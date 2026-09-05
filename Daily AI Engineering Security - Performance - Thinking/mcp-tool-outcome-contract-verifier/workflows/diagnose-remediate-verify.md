# Workflow: Diagnose, Remediate, Verify

## Trigger
Outcome mismatch or integration change.

## Goal
Restore a consistent semantic contract without hiding real failures or causing duplicate side effects.

## Inputs
Raw traces, adapter/server code, fixture corpus.

## Baseline
Count false-success, false-failure, unknown and unverified consequential outcomes on the same trace set.

## Context
Tool idempotency and expected side effects.

## Stages
1. Observe raw evidence.
2. Measure baseline classification.
3. Map layer semantics.
4. Form root-cause hypothesis.
5. Change the narrowest faulty mapping/catch behavior.
6. Replay deterministic fixtures.
7. Measure again.
8. If not improved, re-evaluate once.
9. Independently verify consequential paths.

## Responsible agent
Investigator/implementer; Outcome Verifier for final verification.

## Tools
Trace reader, tests, `verify_tool_outcome.py`, safe state queries.

## Outputs
Before/after matrix, root cause, implementation, verification decision.

## Checkpoints
No automatic repeat of an unknown consequential call. Contradictions block completion.

## Metrics
False-success rate, false-failure rate, unknown rate, verification coverage, rework/duplicate-action count.

## Retry policy
Maximum 2 implementation hypotheses; maximum 1 evidence recollection retry.

## Stop conditions
Stop after bounded attempts or on unresolved consequential unknown state.

## Failure path
Preserve evidence, disable affected automation/action path if appropriate, escalate.

## Verification
Independent fixture replay plus side-effect evidence for high-impact paths.

## Definition of Done
Measured semantic errors reach zero on fixture corpus and no blocking real-world mismatch remains.