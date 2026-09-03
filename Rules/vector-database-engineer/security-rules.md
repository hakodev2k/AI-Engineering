# Security

## Purpose
Protect vector data, metadata, credentials, control planes, and retrieval interfaces against unauthorized access and abuse.

## Scope
Applies to authentication, authorization, network access, secrets, encryption, auditability, and dependency risk.

## MUST
- All non-public vector database interfaces MUST authenticate callers and enforce least-privilege authorization.
- Credentials MUST be stored in approved secret-management mechanisms and rotated according to policy.
- Sensitive data MUST be protected in transit and at rest using approved controls.
- Administrative operations MUST be auditable with actor, action, target, and outcome.
- Security-relevant dependencies and images MUST be scanned and patched according to risk.
- Network exposure MUST be minimized to required paths.

## MUST NOT
- MUST NOT commit credentials or tokens to source control.
- MUST NOT log secrets, raw authentication tokens, or unnecessary sensitive vector payloads.
- MUST NOT disable authentication, TLS, authorization, or audit controls merely to unblock deployment.
- MUST NOT grant broad administrative access where scoped permissions suffice.

## SHOULD
- Threat models SHOULD cover inference leakage, data exfiltration, tenant escape, abusive expensive queries, and control-plane compromise.
- Security defaults SHOULD fail closed.

## Exceptions
Weakening a security control requires documented risk, compensating controls, time bound, security-owner approval, and verification. AI agents may analyze or prepare changes but MUST NOT execute high-risk access or security-control changes without human approval.

## Verification
Review IAM policies, network rules, TLS configuration, secret scans, dependency scans, audit logs, penetration tests, and access reviews.