# Deployment and Cutover Rules

## Purpose
Control production activation of integrations so failures are bounded, reversible, and observable.

## Scope
Applies to first production launch, endpoint migration, routing changes, data-flow activation, and major integration releases.

## MUST
- Production cutovers MUST have entry criteria, validation steps, rollback or containment actions, owners, and decision points.
- Data-affecting cutovers MUST define reconciliation before and after activation.
- High-risk releases MUST use staged rollout, parallel run, canary, feature control, or another justified blast-radius mechanism where feasible.
- Production deployment or routing changes with material impact MUST require human approval.
- Rollback feasibility MUST be evaluated before execution, including schema and data side effects.

## MUST NOT
- MUST NOT execute irreversible cutovers without explicit approval and a documented recovery strategy.
- MUST NOT declare success solely because deployment completed.
- MUST NOT remove the prior path before the new path meets defined verification criteria unless the migration explicitly requires it.

## SHOULD
- Cutovers SHOULD avoid unrelated concurrent changes.
- Business and technical support owners SHOULD be available for critical migrations.

## Exceptions
Document why standard staging or rollback is infeasible, the risk, alternative containment, evidence, and approver.

## Verification
Review the cutover plan, approvals, deployment evidence, reconciliation, health metrics, rollback tests, and post-cutover validation.