# Workflow: Terminal Integrity Verification

## Trigger
A run terminates after guardrail evaluation, max-turn handling, cancellation, failure, or resumed approval execution.

## Goal
Commit or resume only replay-valid, guardrail-consistent session state.

## Inputs
Persisted session items, terminal metadata, policy, tool side-effect classification, optional equivalent-mode comparison.

## Baseline
Capture a known-valid success fixture and at least one blocked-output fixture for the active runtime version.

## Context
Record runtime version, streaming mode, session backend, guardrail mode, resume/fresh-run status, and tool-use behavior.

## Stages
1. **Observe** — snapshot raw durable state without repair.
2. **Normalize** — map session items to stable call IDs and item types.
3. **Validate** — run deterministic structural and policy checks.
4. **Diagnose** — identify whether failure is pairing, terminal provenance, blocked payload, side-effect commit, or parity.
5. **Form hypothesis** — name the lifecycle boundary that allowed invalid state.
6. **Implement** — fix commit ordering or state construction; do not replay side effects.
7. **Measure again** — reproduce the same fixtures.
8. **Compare** — verify valid state and, when applicable, streaming/non-streaming parity.
9. **Independent verify** — Session Integrity Verifier reviews results.

## Responsible agent
Implementation owner for stages 1–8; `subagents/session-verifier.md` for stage 9.

## Tools
`scripts/session_integrity.py`, unit tests, session/trace readers.

## Outputs
Integrity report, violation list, implementation result, test evidence, recovery class, verification status.

## Checkpoints
- C1 raw state preserved.
- C2 call/output pairing complete.
- C3 terminal reason explicit.
- C4 rejected payload policy satisfied.
- C5 side effects not replayed.
- C6 verifier accepts result.

## Metrics
Orphan count, payload-leak count, terminal-reason coverage, parity mismatches, manual-review count.

## Retry policy
Maximum 2 implementation attempts. A second attempt requires a changed root-cause hypothesis or new evidence.

## Stop conditions
Stop automation on ambiguous executed side effects, unsupported history shape, or two failed attempts.

## Failure path
Block replay/resume, retain raw evidence, restore last verified implementation if possible, and escalate ambiguous state to a human owner.

## Verification
All package tests pass and reproduced terminal paths satisfy the policy without weakening guardrails.

## Definition of Done
Implemented, Measured, and Verified are separately recorded; state is replay-valid; blocked output handling matches policy; no unresolved side-effect ambiguity remains.
