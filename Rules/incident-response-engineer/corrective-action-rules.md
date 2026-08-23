# Corrective Action Rules

## Purpose
Ensure post-incident actions measurably reduce recurrence or impact instead of creating unowned task lists.

## Scope
Remediation, prevention, detection, resilience, process, documentation, and training actions.

## MUST
- Link each material action to a demonstrated failure mode, control gap, or risk identified by evidence.
- Give every action an owner, priority, completion criterion, and verification method.
- Prefer actions that improve system safety or reduce classes of failure over reminders to be careful.
- Reassess residual risk when high-value actions are deferred or rejected.
- Verify completed actions actually produce the intended control or signal.

## MUST NOT
- Treat ticket creation as risk reduction.
- Close actions solely because code was merged when deployment, configuration, adoption, or validation remains necessary.

## SHOULD
- Rank actions by expected risk reduction, scope, durability, cost, and unintended consequences.

## Exceptions
An action may be consciously accepted as residual risk only by the appropriate owner with rationale and evidence recorded.

## Verification
Audit action status, owners, acceptance criteria, deployed state, tests or telemetry, and residual-risk decisions.