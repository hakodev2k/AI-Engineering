# Compliance and Audit Rules

## Purpose
Make Azure controls demonstrable through durable evidence rather than informal assurance.

## Scope
Regulatory controls, Azure Policy, activity logs, access records, configuration evidence, retention, and audit preparation.

## MUST
- Map applicable control requirements to concrete Azure configurations, processes, owners, and evidence sources.
- Preserve audit evidence according to required retention and integrity expectations.
- Review material policy exemptions and privileged changes.
- Distinguish technical compliance evidence from assumptions or verbal confirmation.
- Escalate known control failures that materially affect regulated or sensitive workloads.

## MUST NOT
- Claim compliance solely because an Azure service has a provider certification.
- Alter or delete audit evidence to simplify review.
- Use one-time screenshots as the only evidence when authoritative machine-readable records exist.

## SHOULD
- Automate continuous evidence collection for deterministic controls.
- Minimize duplicate controls by using governed platform capabilities.

## Exceptions
Evidence gaps require documented scope, reason, compensating evidence, owner, and remediation.

## Verification
Inspect policy state, activity logs, RBAC history, configuration exports, retention, control mappings, exemptions, and audit records.