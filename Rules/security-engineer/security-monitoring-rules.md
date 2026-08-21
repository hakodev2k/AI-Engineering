# Security Monitoring Rules

## Purpose
Ensure security-relevant activity is observable and actionable.

## Scope
Applies to authentication, authorization, privileged actions, sensitive data access, infrastructure, applications, and security controls.

## MUST
- Security-critical events MUST produce sufficient telemetry for investigation.
- Logs MUST include time, actor or workload identity where available, action, target, and outcome without exposing secrets.
- High-risk detections MUST have defined owners and response paths.
- Monitoring coverage MUST be reviewed when new trust boundaries or privileged flows are introduced.
- Alerting MUST distinguish actionable security signals from expected operational noise.

## MUST NOT
- MUST NOT log reusable credentials or sensitive secrets.
- MUST NOT disable high-value monitoring solely to reduce alert volume.
- MUST NOT rely on a single telemetry source for critical investigations when independent evidence is available.

## SHOULD
- Correlate identity, application, cloud, and network telemetry where useful.
- Regularly tune detections using incident and false-positive evidence.

## Exceptions
Reduced monitoring requires documented risk, compensating controls, approval, and review date.

## Verification
Use alert tests, log inspection, detection exercises, coverage reviews, retention checks, and incident evidence.