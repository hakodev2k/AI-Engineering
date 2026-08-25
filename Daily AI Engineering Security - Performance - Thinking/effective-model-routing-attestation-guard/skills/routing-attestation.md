# Skill — Routing Attestation

## Purpose
Verify that an agent/thread actually ran with the execution profile required by the task rather than merely being configured or displayed that way.

## Trigger
Before dispatch, immediately after spawn/resume/handoff, and before accepting routing-sensitive output.

## Inputs
- Intended task profile: task ID, model, reasoning effort, optional provider/service tier/sandbox mode, inheritance policy.
- Host-controlled runtime observation for the same task/thread.
- Acceptance policy from `rules/model-routing-contract.md`.

## Preconditions
A stable task identifier exists and runtime metadata can be captured without asking the model to identify itself.

## Required context
The task's quality/cost/security requirements and the runtime's documented routing metadata source.

## Allowed tools
Read-only session/log inspection, provider request metadata, shell/Python for deterministic comparison, and the supplied script.

## Constraints
Do not mutate routing intent after execution to make a mismatch disappear. Do not infer a pass from UI labels alone. Do not expose secrets found in logs.

## Procedure
1. Classify which routing fields are acceptance-critical.
2. Freeze those fields in an intent JSON record before dispatch.
3. Dispatch or resume the worker.
4. Capture effective runtime fields from a host-controlled source.
5. Run `python scripts/model_route_guard.py --intent <intent.json> --observed <observed.json>`.
6. If exit code is 0, attach the attestation record to the result.
7. If exit code is 2, identify whether the cause is inheritance, wrong override precedence, stale thread state, cross-thread mutation, unsupported model, or missing evidence.
8. Correct one diagnosed cause and redispatch at most twice.
9. If drift persists, stop and escalate rather than accepting the result.

## Decision points
- If the task is not routing-sensitive, record that decision and skip blocking enforcement.
- If a permitted fallback profile is explicitly declared before execution, compare against that declared fallback.
- If runtime evidence is unavailable, status is unverifiable and blocks acceptance for routing-sensitive work.

## Expected output
A JSON attestation with pass/drift status, field-level mismatches, evidence source, and task identifier.

## Metrics
Attestation pass rate, mismatch count by field, missing-evidence rate, redispatch count, quota/cost variance by intended profile.

## Verification
Use `tests/test_model_route_guard.py`. For an integration canary, intentionally request a different child model/effort than the parent and confirm runtime metadata plus the script agree.

## Failure handling
Preserve the failed evidence, do not weaken the required profile, retry only after a concrete routing change, maximum two redispatches.

## Stop conditions
Stop on pass, two failed corrective redispatches, missing trustworthy runtime evidence, or required human approval for a downgrade.
