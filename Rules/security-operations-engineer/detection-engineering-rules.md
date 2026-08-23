# Detection Engineering Rules

## Purpose
Maintain high-value, testable security detections.

## Scope
SIEM, EDR, cloud, identity, network, application, and behavioral detections.

## MUST
- Every production detection MUST define threat behavior, required telemetry, logic, severity, expected false-positive conditions, and response owner.
- Material detection changes MUST be tested against representative positive and negative cases.
- Detection gaps discovered during incidents MUST be tracked to remediation or accepted risk.
- Detections MUST fail visibly when required telemetry disappears.

## MUST NOT
- MUST NOT deploy broad noisy logic without measured operational impact.
- MUST NOT silently weaken detection thresholds to reduce workload.

## SHOULD
- Detections SHOULD map to a recognized threat model and include version-controlled tests.

## Exceptions
Emergency detections may use expedited review but require retrospective validation.

## Verification
Inspect detection definitions, tests, change history, telemetry health, false-positive metrics, and post-incident gap tracking.