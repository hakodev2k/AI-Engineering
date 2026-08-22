# Feature Flag Safety Rules

## MUST
- Identify the exact flag key, environment, current state, requested state, targeting rules, exposure percentage, owner, rollback mechanism, and affected call sites before editing.
- Treat production/protected-environment exposure increases as approval-bound when policy thresholds are exceeded.
- Preserve a working rollback or fallback until rollout verification is complete.
- Keep facts, hypotheses, decisions, and telemetry evidence distinct.
- Run the deterministic gate before and after edits and preserve its output.
- Verify that unrelated flag keys and targeting rules did not change.
- Re-request approval when flag, environment, exposure, targeting cohort, rollback behavior, or security impact materially differs from the approved request.

## MUST NOT
- Globally enable a protected-environment flag without explicit approval.
- Delete a flag, fallback, or kill switch while active code paths still reference it.
- Infer production health from successful build/tests alone.
- Modify policy thresholds during a rollout task merely to make a failing gate pass.
- Put secrets, tokens, customer identifiers, or raw sensitive cohort data into the request/evidence files.
- Retry validation or approval failures as if they were transient.
- Force push, deploy, change infrastructure, or mutate a production flag provider as part of this package.

## SHOULD
- Prefer small canary increments with measurable success criteria.
- Use stable cohort identifiers rather than ad-hoc targeting expressions.
- Add tests for both enabled and disabled paths while both paths remain supported.
- Record expiry/cleanup intent for temporary flags.
- Prefer provider-neutral flag semantics in application code.