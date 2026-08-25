# IDS and IPS
## Purpose
Detect and, where appropriate, block malicious network behavior with controlled false-positive risk.
## Scope
Network IDS/IPS, cloud detection sensors, signatures, and behavioral detection.
## MUST
- Detection coverage MUST map to relevant threats and monitored network paths.
- Blocking rules MUST be validated for false-positive and availability impact.
- High-severity detections MUST have triage ownership and response guidance.
- Sensor health and telemetry gaps MUST be monitored.
## MUST NOT
- Signatures MUST NOT be enabled blindly when they can disrupt critical traffic.
- Alerts MUST NOT be considered coverage if traffic bypasses sensors.
## SHOULD
- Detection tuning SHOULD use incident, threat, and baseline evidence.
## Exceptions
Require documented coverage gap, risk owner, compensating telemetry, and remediation plan.
## Verification
Inspect sensor placement, signature state, test traffic, alert routing, health metrics, and tuning records.