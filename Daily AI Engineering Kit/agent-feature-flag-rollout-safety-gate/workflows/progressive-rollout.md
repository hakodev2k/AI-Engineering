# Progressive Rollout Workflow

```text
Trigger -> Context -> Plan -> Validate -> Approval checkpoint -> Stage change -> Observe -> Verify
                                      | blocked -> stop             | breach -> rollback/hold
                                      | approval_required -> wait   | pass -> next stage
```

## Trigger
A feature or behavior is ready to be exposed through an existing feature flag.

## Entry conditions
Flag key and target environment are known; fallback path exists; relevant tests pass; telemetry is available; rollout policy is present.

## Inputs
Feature intent, flag key, environment, owner, target cohorts, success metrics, rollback action, expiry, repository evidence, provider state.

## Stages
1. **Context — Rollout Planner:** locate evaluation points, fallback path, dependencies, tests, provider state, and telemetry.
2. **Plan — Rollout Planner:** create a plan from `templates/rollout-plan.yaml` with bounded stages and measurable abort thresholds.
3. **Validate — deterministic script:** run `python scripts/validate_rollout.py --plan <plan> --policy config/policy.yaml --output rollout-result.json`.
4. **Checkpoint:** exit `2` blocks. Exit `4` requires human approval before protected progression. Exit `0` means the plan is structurally allowed; it is not proof that a rollout occurred.
5. **Stage execution — external controlled operator:** change only the exact target described by the validated/approved stage. Agent planning/verifier roles do not receive production mutation authority.
6. **Readback:** capture actual flag state and activation timestamp.
7. **Observe:** wait at least `duration_minutes`; collect cohort-specific metrics and relevant incident evidence.
8. **Verify — Rollout Verifier:** compare telemetry with every success/abort criterion and return `continue`, `hold`, `rollback`, or `inconclusive`.
9. **Progress:** on `continue`, move to the next stage and repeat from approval checkpoint. On `hold`, keep current safe state. On `rollback`, execute only the approved rollback action. On `inconclusive`, stop progression.
10. **Finalize:** after stable 100% verification, document remaining flag debt and schedule cleanup outside this workflow; flag deletion/fallback removal requires explicit approval.

## Produced artifacts
Rollout plan, validator JSON, approval reference, provider-state readbacks, telemetry evidence, stage decisions, final verification record.

## Retry rules
- Plan validation failure: revise and retry at most twice; never weaken policy automatically.
- Transient provider/telemetry read failure: retry once.
- Stage verification failure caused by missing evidence: one collection retry, then `inconclusive`.
- Threshold breaches are not retryable by extending the observation window to hide the breach.

## Approval points
Production rollout when required by policy; 100% rollout; destructive flag deletion; fallback removal; breaking behavior change; security-control weakening; infrastructure or production configuration changes.

## Failure paths
Unknown environment -> stop. Missing telemetry -> stop. Validator blocked -> stop. Missing approval -> stop. Actual flag state differs from plan -> hold and escalate. Abort threshold breached -> rollback/hold according to plan. Rollback fails -> preserve evidence and escalate; no repeated autonomous mutation loop.

## Definition of Done
The exact plan was validated; required approvals exist; every executed stage was read back and observed for its minimum duration; independent verification completed; final flag state matches the approved plan; abort thresholds were not breached or rollback completed; remaining cleanup risk is documented.
