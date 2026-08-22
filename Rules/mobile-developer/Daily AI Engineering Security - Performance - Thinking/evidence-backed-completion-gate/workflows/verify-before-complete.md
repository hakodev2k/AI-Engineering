# Workflow: Verify Before Complete

## Trigger
A task approaches a terminal response, a completion claim is about to be made, or a requirement changes after prior verification.

## Goal
Ensure the terminal state reflects the actual requested deliverable and fresh evidence rather than partial milestones, stale memory, or unsupported claims.

## Inputs
Acceptance criteria, requirement/evidence ledger, current diff/artifacts, validation events, and explicit user-approved exceptions.

## Baseline
Before adoption, sample completed tasks and record unsupported/qualified success claims, missing requirement statuses, stale evidence, and reviewer reconstruction effort.

## Context
The ledger is durable state and survives compaction/handoff. It contains externally inspectable facts only.

## Stages
1. **Observe** — capture material acceptance criteria as requirement rows.
2. **Implement** — update status to `implemented_unverified` when a deliverable exists.
3. **Collect evidence** — attach exact commands/tool events/results and scope.
4. **Freshness check** — compare evidence sequence against later changes to relevant paths.
5. **Hypothesis** — determine what additional validation would move each required row to `verified`.
6. **Verify** — run missing focused/broad checks appropriate to the claims.
7. **Independent review** — Independent Completion Verifier inspects scope/freshness.
8. **Gate** — execute `python scripts/completion_gate.py ledger.json`.
9. **Allowed?**
   - Yes: final response is generated from ledger statuses/evidence.
   - No: return to implementation/verification for at most two recovery cycles.
10. **Stop** — if still blocked after bounded recovery, report incomplete/blocked state rather than success.

## Responsible agent
Implementation owner updates implementation status; validation executor records evidence; Independent Completion Verifier owns final verification; orchestrator controls terminal state.

## Tools
Diff/status, test/build/lint/typecheck/runtime checks, CI/logs, completion gate.

## Outputs
Durable ledger, verification findings, deterministic finalization decision, final completion report.

## Checkpoints
- All material requirements represented.
- No `verified` row without fresh successful evidence.
- Evidence scope matches claim scope.
- Changes after verification trigger stale status.
- Required incomplete rows block success.

## Metrics
Requirement status coverage, evidence coverage, unsupported claims blocked, stale evidence detected, premature-finalization attempts, post-completion rework.

## Retry policy
Maximum two recovery cycles. Each cycle must add new evidence or implementation change; identical re-verification with unchanged inputs does not count as progress and must stop.

## Stop conditions
Gate passes; user cancels; explicit accepted exception resolves a blocker; or two recovery cycles are exhausted.

## Failure path
Malformed ledger or missing evidence is blocking. Preserve the exact missing requirement/evidence reason, do not downgrade verification standards, and escalate to human review if acceptance cannot be established.

## Verification
Replay package fixtures and at least one real task where a relevant file changes after a green test; the stale test must stop finalization until refreshed.

## Definition of Done
Implemented: ledger and gate integrated. Measured: baseline vs post-integration false-completion indicators recorded. Verified: fixtures and real task show unsupported/stale claims are blocked while fully evidenced tasks pass.
