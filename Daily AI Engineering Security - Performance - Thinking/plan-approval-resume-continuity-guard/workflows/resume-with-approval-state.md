# Workflow: Resume With Approval State

## Trigger
Restart, resume, compaction, plan-mode transition, or phase transition after a plan-approval boundary.

## Goal
Resume idempotently when approval remains valid; otherwise stop safely for a fresh human decision.

## Inputs
Plan, receipt, task ID, workspace revision, phase, lifecycle event, policy.

## Baseline
Measure current duplicate approval prompts, approval-state losses, continuation after mismatches, and recovery-loop length.

## Context
State machine: `DRAFT → AWAITING_APPROVAL → APPROVED → EXECUTING → VERIFYING → COMPLETE`.

## Stages
1. **Observe** — capture lifecycle event and current durable state.
2. **Measure baseline** — record duplicate prompts and prior retries.
3. **Diagnose** — load receipt and recompute plan hash/workspace identity.
4. **Form hypothesis** — determine whether the receipt is valid for this exact resumed phase.
5. **Validate** — run `scripts/plan_receipt_guard.py`.
6. **Decision** — VALID: resume idempotently; BLOCKED: enter `AWAITING_APPROVAL` without continuing execution.
7. **Loop check** — repeated identical pending approval without user input halts planning/model work rather than re-requesting indefinitely.
8. **Independent verify** — Verification Agent reproduces the binding.
9. **Complete** — record implemented/measured/verified status.

## Responsible agent
Execution controller handles state; Verification Agent independently validates.

## Tools
Receipt guard, audit log, workspace revision lookup, tests.

## Outputs
State transition, findings, retry count, approval decision, verification status.

## Checkpoints
Before resumed write/tool use; after receipt validation; after any plan/workspace mutation; before completion.

## Metrics
Stale/mismatch continuations = 0; duplicate approval loop bounded; valid identical approvals deduplicated; independent verification coverage tracked.

## Retry policy
Maximum two recovery attempts. Waiting for human input does not trigger repeated planning or model calls.

## Stop conditions
Missing/invalid receipt, plan/workspace drift, expired receipt, out-of-scope phase, two failed recovery attempts, or failed independent verification.

## Failure path
Transition to `AWAITING_APPROVAL`, stop side effects, preserve evidence, escalate to human.

## Verification
Deterministic receipt tests plus lifecycle-state inspection.

## Definition of Done
Approval evidence is durable, exact, idempotent, bounded on recovery, measured, and independently verified.