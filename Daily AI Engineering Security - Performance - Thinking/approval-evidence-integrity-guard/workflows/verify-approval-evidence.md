# Workflow — Verify Approval Evidence

## Trigger
A new approval surface, hook, reviewer, transport layer, remote-control client, or approval-related release change.

## Goal
Prove that a decision-maker sees the exact action evidence used by the approval system.

## Inputs
Policy payloads, rendered approval snapshots/events, audit records, fixtures.

## Baseline
Measure current evidence-complete rate and count every affirmative approval lacking one or more of action, target, scope, rationale.

## Context
Use `rules/approval-evidence.rules.md` and `skills/approval-evidence-review.md`.

## Stages
1. **Observe** — collect producer, transport, UI, and audit representations for the same request ID.
2. **Measure baseline** — run the validator and count missing/mutated fields.
3. **Diagnose** — locate the first layer where evidence diverges.
4. **Form hypothesis** — name one concrete serialization, rendering, state-sync, or logging defect.
5. **Implement improvement** — modify only the responsible layer; do not relax required evidence.
6. **Measure again** — replay complete and malformed fixtures.
7. **Verify** — independent verifier confirms fail-closed behavior and cross-surface parity.

## Responsible agent
Implementation owner for stage 5; `subagents/approval-verifier.md` for stage 7.

## Tools
Structured payload capture, UI snapshot/event inspection, `scripts/approval_evidence_guard.py`, test runner.

## Outputs
Baseline report, defect classification, before/after evidence results, verification record.

## Checkpoints
- Before implementation: baseline captured.
- Before affirmative UI rendering: validator passes.
- Before completion: independent verifier signs off.

## Metrics
Evidence-complete rate, parity failures, malformed requests blocked, false-block rate on valid fixtures.

## Retry policy
At most 2 diagnose→fix→remeasure cycles per defect. A third failure escalates to the owning platform/UI team.

## Stop conditions
Stop immediately if a privileged action can execute without a valid approval record. Stop successfully only after all blocking fixtures fail closed and valid fixtures pass.

## Failure path
Preserve failing payloads, disable the affected affirmative approval path or route to a safer surface, and escalate. Never replace missing scope with guessed context.

## Verification
Independent replay plus exact field comparison across producer → UI → audit.

## Definition of Done
Evidence documented; baseline captured; limitation identified; implementation complete; tests pass; before/after metrics recorded; independent verification complete; no blocking mismatch remains.
