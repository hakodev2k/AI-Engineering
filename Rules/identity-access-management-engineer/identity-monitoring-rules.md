# Identity Monitoring Rules

## Purpose
Detect identity abuse, control failure, and abnormal privilege use using actionable signals.

## Scope
Authentication anomalies, privilege elevation, account lifecycle failures, impossible or unusual access, policy changes, and service identities.

## MUST
- Monitoring MUST cover high-impact identity events and control failures with defined ownership and response paths.
- Alerts MUST be based on evidence and tuned against expected behavior to remain actionable.
- Privileged identity creation, privilege escalation, break-glass use, and critical policy changes MUST be detectable promptly.
- Monitoring gaps affecting critical identity controls MUST be tracked as operational risk.

## MUST NOT
- MUST NOT claim identity controls are effective solely because no alert fired.
- MUST NOT suppress noisy security alerts indefinitely without fixing logic or documenting alternate coverage.

## SHOULD
- Combine identity, device, workload, and resource context where it materially improves detection quality.

## Exceptions
Temporary monitoring gaps require scope, risk, compensating detection, owner, restoration deadline, and approval.

## Verification
Use alert tests, synthetic events, detection coverage reviews, incident retrospectives, telemetry freshness checks, and response metrics.