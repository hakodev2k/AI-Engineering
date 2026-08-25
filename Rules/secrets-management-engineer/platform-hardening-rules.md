# Secrets Platform Hardening Rules

## Purpose
Protect the control plane that stores, issues, and governs credentials.

## Scope
Secrets-management servers and services, administrative endpoints, plugins, integrations, network exposure, and host/runtime configuration.

## MUST
- Secrets platforms MUST use supported versions, secure configuration baselines, restricted administrative interfaces, and least-privileged service identities.
- Network exposure MUST be limited to required consumers and administrative paths.
- Security-relevant configuration and dependency changes MUST be reviewed and tested before production rollout.
- Root or equivalent control-plane capabilities MUST receive stronger protection and monitoring than ordinary secret reads.

## MUST NOT
- Security controls MUST NOT be disabled to resolve integration failures without explicit security approval.
- Default credentials, anonymous administration, or unnecessary public exposure MUST NOT remain enabled.
- Plugins or extensions MUST NOT be installed without provenance, permission, and maintenance review.

## SHOULD
- Automate baseline validation and drift detection.
- Minimize platform features and integrations to those operationally required.

## Exceptions
Hardening deviations require threat/risk analysis, compensating controls, accountable approval, and expiry or remediation plan.

## Verification
Review configuration baselines, network policy, version/support status, vulnerability findings, administrative IAM, extension inventory, drift reports, and penetration/security test evidence.