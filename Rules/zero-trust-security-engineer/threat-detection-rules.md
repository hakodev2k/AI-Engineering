# Threat Detection Rules

## Purpose
Detect misuse of identities, devices, workloads, and trust relationships using evidence aligned to Zero Trust controls.

## Scope
Applies to authentication, authorization, endpoint, network, workload, privilege, and data-access detections.

## MUST
- Detection logic MUST prioritize behaviors that indicate credential theft, privilege abuse, lateral movement, policy bypass, and anomalous access.
- High-severity detections MUST map to an owner and actionable response path.
- Detection thresholds and suppression rules MUST be evidence-based and reviewable.
- Detection coverage MUST be reassessed after material architecture or policy changes.

## MUST NOT
- MUST NOT suppress recurring high-risk alerts solely to reduce noise without root-cause or compensating detection.
- MUST NOT treat absence of alerts as proof of absence of compromise.
- MUST NOT depend on a single telemetry source for critical conclusions when corroboration is available.

## SHOULD
- Detections SHOULD combine identity, device, network, and resource context where it materially improves fidelity.
- Test cases SHOULD include expected benign edge cases and known malicious patterns.

## Exceptions
Coverage gaps require documented risk, alternate monitoring, owner, remediation target, and approval where exposure is significant.

## Verification
Use detection unit tests, replayed events, purple-team exercises, alert-quality metrics, telemetry-gap analysis, and incident postmortems to confirm useful signal and response readiness.