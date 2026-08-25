# Workflow: Interrupt Resume Lifecycle

## Trigger
A suspended agent run receives human responses for one or more pending interrupts.

## Goal
Resume only from a complete, unambiguous decision set and preserve all siblings.

## Inputs
Current pending interrupt snapshot, resume payload, run/thread identity.

## Baseline
Record pending count, nested container count, scalar-resume attempts, prior mismatch/drop incidents.

## Context
Framework resume semantics, checkpoint version, current run/thread, authorization requirements.

## Stages
1. **Observe** — fetch current pending state.
2. **Measure baseline** — flatten IDs and record counts.
3. **Diagnose** — identify scalar ambiguity, missing IDs, unknown IDs, duplicated IDs, or stale snapshot.
4. **Form hypothesis** — choose exact mapped response or correct host cardinality extraction.
5. **Implement improvement** — alter adapter/host logic; never weaken approval policy.
6. **Measure again** — run pre-resume validator.
7. **Improved?** If no and state genuinely changed concurrently, refresh once and retry; otherwise stop.
8. **Apply** — atomically consume the validated response set, or durably journal each applied ID.
9. **Verify** — independent reviewer checks post-resume state and outcomes.
10. **Complete** — only when reconciliation is exact.

## Responsible agent
Implementer: stages 1–8. `resume-verifier`: stage 9.

## Tools
`python scripts/interrupt_resume_guard.py`, state/event exporter, unit/integration tests.

## Outputs
Validation report, post-resume reconciliation report, reviewer verdict.

## Checkpoints
Before consumption, after any refresh, immediately after application, before next model call.

## Metrics
Mismatch count, unresolved count, dropped-approved-call count, retry count, validation latency.

## Retry policy
Maximum one refreshed-state retry. No blind replay of a partially consumed batch.

## Stop conditions
Success: exact reconciliation and reviewer verified. Failure: persistent mismatch, duplicate identity, stale response, or unrecoverable partial consumption.

## Failure path
Keep/restore pending state when possible; present exact current decisions to human again. Escalate if any side effect may have executed without durable outcome evidence.

## Verification
Unit tests plus target-runtime scenario with at least two simultaneous interrupts and mixed approve/reject dispositions.

## Definition of Done
Exact pre-resume set, safe application, exact post-resume state, terminal evidence, bounded retry, independent verification.