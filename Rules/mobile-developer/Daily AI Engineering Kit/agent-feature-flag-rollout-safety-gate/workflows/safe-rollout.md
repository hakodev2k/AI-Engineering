# Workflow: Safe Feature-Flag Rollout

## Trigger
A request creates, changes, rolls out, rolls back, or removes a feature flag.

## Entry conditions
A repository is available and a request conforming to `templates/change-request.json` can be produced.

## Stages
1. **Context — Rollout Planner:** inventory definitions, call sites, tests, overrides, fallback, side effects. Artifact: evidence notes.
2. **Plan — Rollout Planner:** classify risk, determine approval, define rollout increment, rollback trigger, and verification signals.
3. **Pre-change gate — deterministic:** run `python scripts/feature_flag_gate.py --config config/policy.yaml --request <request> --repo-root .`. Any failure blocks edits.
4. **Approval checkpoint — human:** required for protected exposure above policy threshold, global enable, deletion, rollback removal, security weakening, or other dangerous actions. Approval must match exact scope.
5. **Execute — implementer:** make the smallest requested repository change. No production provider mutation is authorized.
6. **Test — implementer:** exercise enabled and disabled paths plus affected integration behavior.
7. **Post-change gate — deterministic:** rerun the gate and inspect Git diff for unrelated flag/policy changes.
8. **Verify — Independent Verifier:** compare request, approval, diff, tests, rollback, and required telemetry.
9. **Complete:** emit verified status only when Definition of Done is satisfied.

## Retry rules
Transient command/tool failures: maximum 2 retries, preserving command and error each time. Validation, test, approval, scope, or policy failures are non-retryable until inputs/code change. After two transient failures, stop and escalate.

## Failure paths
Missing approval -> blocked. Missing rollback -> blocked. Tests fail -> return to implementation for one bounded correction cycle, then rerun tests; a second failure stops. Scope drift -> invalidate approval and stop. Missing production telemetry -> `implemented-unverified`.

## Approval points
Production/protected rollout increases above threshold, global enable, flag deletion, rollback removal, security weakening, destructive data/schema/infrastructure/deployment actions.

## Definition of Done
Inventory complete; request valid; required approval exact and present; final diff scoped; tests pass; static gate passes; rollback preserved; verifier evidence complete; no blocking risk remains.