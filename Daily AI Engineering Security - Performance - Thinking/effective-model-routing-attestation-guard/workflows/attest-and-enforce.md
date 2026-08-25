# Workflow — Attest and Enforce Effective Routing

## Trigger
A task uses a model/effort/provider profile because quality, cost, quota, latency, or independence depends on it.

## Goal
Accept results only when effective runtime routing matches the frozen routing intent or an explicitly approved fallback.

## Inputs
Task, routing intent, runtime metadata source, acceptance policy.

## Baseline
Record the parent/coordinator model and effort plus the child's intended profile. Baseline metrics: requested/effective model, effort, task duration, and usage when available.

## Context
Configuration may be overridden by runtime inheritance, resumed thread state, provider fallback, dispatch-path differences, or cross-thread messages.

## Stages
1. **Observe** — collect current parent/thread routing state and known runtime capabilities.
2. **Freeze intent** — write the task-specific required profile before dispatch.
3. **Dispatch** — start the child/thread without changing unrelated permissions or sandbox boundaries.
4. **Measure** — collect host-controlled effective routing metadata immediately after spawn.
5. **Diagnose** — run `scripts/model_route_guard.py`; classify any drift.
6. **Hypothesize** — identify one likely cause: inheritance, unsupported override, stale state, source-thread leakage, fallback metadata, or missing instrumentation.
7. **Correct** — change only the diagnosed routing cause.
8. **Measure again** — maximum two corrective redispatches.
9. **Verify output gate** — for routing-sensitive work, run a final attestation after any resume/handoff and before accepting output.
10. **Complete** — attach attestation evidence to the task result.

## Responsible agent
Orchestrator owns intent and dispatch. `subagents/routing-verifier.md` owns independent attestation.

## Tools
Runtime logs/provider metadata, JSON files, Python 3, supplied guard script.

## Outputs
Routing intent, observed profile, attestation result, retry evidence, final acceptance state.

## Checkpoints
- Intent frozen before first dispatch.
- Effective profile observed after spawn.
- Any cross-thread/resume event re-attested.
- Final result accepted only after pass.

## Metrics
Pass rate, mismatches by field, redispatch count, unverifiable count, cost/quota variance, and rejected-result count.

## Retry policy
Maximum two corrective redispatches. Each retry must change a documented routing cause. Blind retry is prohibited.

## Stop conditions
Pass; two failed corrective attempts; missing trustworthy runtime evidence; or human approval required for a downgrade.

## Failure path
Quarantine the child result, preserve intent/observation, escalate with the exact mismatch. Never silently accept a different profile.

## Verification
Unit tests must pass; integration canary must intentionally use a child profile different from the parent and produce matching runtime evidence.

## Definition of Done
Implemented: guard, rules, hook contract, workflow exist. Measured: intended and effective profiles are captured. Verified: deterministic attestation passes and no required field is missing. No blocking routing issue remains.
