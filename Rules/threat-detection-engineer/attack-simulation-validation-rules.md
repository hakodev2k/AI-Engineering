# Attack Simulation Validation Rules

## Purpose
Validate that critical detections observe realistic attacker behavior under controlled conditions.

## Scope
Applies to purple-team exercises, atomic tests, adversary emulation, controlled attack simulation, and validation campaigns.

## MUST
- Simulation plans MUST define expected telemetry, expected detections, safety boundaries, and cleanup steps before execution.
- High-risk simulations affecting production-like systems MUST require explicit authorization.
- Validation MUST distinguish telemetry failure, parser failure, detection failure, alert-routing failure, and analyst-process failure.
- Missed detections MUST produce tracked remediation or a documented risk decision.

## MUST NOT
- MUST NOT execute destructive or persistence-heavy techniques outside approved boundaries.
- MUST NOT declare coverage proven from a simulation that did not generate the expected underlying telemetry.
- MUST NOT use uncontrolled live malware when safer representative techniques can validate the same detection path.

## SHOULD
- Critical detections SHOULD be revalidated after major platform, telemetry, or logic changes.
- Exercises SHOULD include realistic benign background activity.

## Exceptions
Exceptions require safety rationale, affected coverage, compensating evidence, and accountable approval.

## Verification
Review exercise plans, authorization records, generated telemetry, alert outcomes, missed-control tickets, and remediation closure evidence.