# Revalidate Command Before Execution

## Purpose
Prove that the command about to run is still the command that was reviewed.

## Inputs
- reviewed command intent
- current execution request
- current policy
- review record when required
- current repository/tool context

## Preconditions
- intent contract exists;
- execution has not started;
- the actor can inspect exact arguments and target.

## Procedure
1. Materialize the exact execution request after all variable/template expansion that can be safely inspected.
2. Reject opaque wrappers whose final executable/arguments cannot be determined.
3. Run `scripts/evaluate-command-drift.py --intent <intent.json> --execution <execution.json> --policy config/intent-policy.json --output <decision.json>`.
4. If status is `blocked`, do not execute. Preserve blockers and re-plan at most once.
5. If status is `review-required`, obtain a new review bound to the current intent fingerprint before execution.
6. Re-check mandatory human approval for dangerous actions. A generic approval is insufficient if target/environment/arguments changed.
7. Immediately before dispatch, re-read the execution request and ensure no caller/tool adapter mutated it.
8. Execute only after the deterministic gate permits continuation.
9. Record execution evidence separately from verification evidence.
10. Before claiming success, run `scripts/verify-final-gate.py` against the exact intent, execution request, decision, current policy, review and actor.

## Verification
Final gate must return `verified`. A successful process exit alone does not prove that the command matched reviewed intent or achieved the intended business outcome.

## Failure handling
- transient read/tool error: retry once;
- deterministic drift: no automatic retry;
- approval/review mismatch: stop for new review;
- environment/target uncertainty: stop and collect authoritative evidence.

## Stop conditions
Stop on executable drift, target drift, environment drift, side-effect escalation, unreviewed added arguments, stale fingerprints, missing approval, or forbidden self-review.
