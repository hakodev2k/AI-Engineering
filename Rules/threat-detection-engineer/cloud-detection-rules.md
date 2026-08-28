# Cloud Detection Rules

## Purpose
Detect malicious and risky activity across cloud control planes, workloads, identities, and managed services.

## Scope
Applies to cloud audit logs, IAM events, network telemetry, workload events, storage access, and security-service findings.

## MUST
- Cloud detections MUST distinguish control-plane, data-plane, identity, and workload activity.
- Detection logic MUST account for organization, account/subscription/project, region, resource, and principal context.
- High-risk detections MUST cover privilege escalation, credential misuse, logging disablement, public exposure, and destructive administrative actions where applicable.
- Changes in cloud logging or security-service configuration that reduce coverage MUST be detected or otherwise monitored.

## MUST NOT
- MUST NOT assume provider-managed identities or automation are inherently trusted.
- MUST NOT suppress administrative APIs globally because they are noisy.
- MUST NOT claim coverage for regions or services lacking required audit telemetry.

## SHOULD
- Detections SHOULD correlate control-plane changes with subsequent resource or identity behavior.
- Multi-account environments SHOULD normalize identifiers without losing tenant boundaries.

## Exceptions
Exceptions require documented architecture, compensating control, risk owner, and review date.

## Verification
Replay representative cloud attack scenarios; inspect audit-log enablement, tenant scope, exclusions, privilege coverage, and alert context.