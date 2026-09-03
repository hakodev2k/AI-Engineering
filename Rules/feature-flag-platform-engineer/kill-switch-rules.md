# Kill Switch Rules

## Purpose
Ensure operational kill switches reliably reduce harm during incidents.

## Scope
Applies to flags intended to disable risky features, integrations, jobs, traffic paths, or expensive behavior.

## MUST
- Every kill switch MUST define the failure it mitigates, the disabled behavior, and the expected safe state.
- Critical kill switches MUST be operable independently of the failing subsystem they protect against where practical.
- Operators MUST have documented authority and procedures for emergency activation.
- Activation MUST be auditable and observable.
- Kill switches MUST be exercised periodically in representative environments.

## MUST NOT
- MUST NOT make a kill switch depend on an untested code path that is only executed during emergencies.
- MUST NOT require a full application deployment to operate a flag designated as an emergency control.
- MUST NOT hide material data-loss or security consequences of activation.

## SHOULD
- Critical switches SHOULD have concise runbook references and dashboard links in metadata.

## Exceptions
If immediate remote control is impossible, the limitation and compensating operational control must be documented and approved.

## Verification
Perform controlled switch drills, inspect audit events, validate safe-state behavior, and review incident runbooks.