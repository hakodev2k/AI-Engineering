# Workflow: Verify → Repair → Bounded Retry

## Trigger
Tool error, validator/test failure, contradictory state, duplicate attempt, or completion claim.

## Goal
Recover from agent failures using observable evidence, structured repair feedback, and bounded retries while preventing unsupported success and infinite loops.

## Inputs
Task goal, acceptance contract, event log, current state, attempt history, and policy.

## Baseline
Before mutation, capture current state and evaluate whether the goal is already satisfied. Record acceptance predicates and required-call coverage using `skills/acceptance-contract.md`.

## Context
Use observable Facts, Assumptions, Evidence, Hypotheses, Decision, Risks, and Verification status. Do not request hidden chain-of-thought.

## Stages
1. **Observe** — capture current state and latest tool/test evidence.
2. **Measure baseline** — evaluate predicates and coverage before modification.
3. **Diagnose** — classify failed predicates, missing calls, contradictions, or tool errors.
4. **Form hypothesis** — choose one evidence-supported repair hypothesis.
5. **Implement improvement** — execute the smallest safe change; fingerprint the attempt.
6. **Measure again** — rerun required deterministic checks.
7. **Improved?** — if no, create structured repair feedback with `skills/structured-repair.md` and retry only if budget and progress rules permit.
8. **Verify** — Independent Verifier evaluates final predicates and coverage.
9. **Complete or stop** — complete only on Verified; otherwise preserve evidence and stop/escalate.

## Responsible agent
Implementation agent performs repair. `subagents/independent-verifier.md` performs final verification.

## Tools
Task-specific validators/tests, read-only state inspection, event logs, diff inspection, and `scripts/repair_verifier.py`.

## Outputs
Acceptance record, attempt fingerprints, repair feedback, deterministic verifier result, and final status.

## Checkpoints
- Goal-state check before mutation.
- Failure evidence captured before retry.
- Fingerprint stored before each attempt.
- Retry budget checked before mutation.
- Independent verification before success.

## Metrics
Recovery success rate, repair attempts, duplicate attempts blocked, predicate coverage, required-call coverage, tokens/time per repair, and unsupported success claims blocked.

## Retry policy
Default maximum three repair attempts. Identical fingerprint may occur at most once unless new external evidence is recorded. Unknown failures get one diagnostic retry by default.

## Stop conditions
All required predicates and calls verified; retry budget exhausted; repeated attempt without new evidence; unsafe repair path; or unverifiable requirement.

## Failure path
Return structured failure evidence, preserve the last safe state when possible, and escalate. Never suppress a failed check or mutate acceptance criteria to obtain a pass.

## Verification
Run deterministic verifier and independent evidence review. For high-risk changes, the implementer cannot be sole verifier.

## Definition of Done
Acceptance contract exists; current state evaluated; failures typed; retries bounded; no duplicate loop; required checks executed; predicates pass; independent verifier reports Verified; no blocking risk remains.