# Security Readiness Rules
## Purpose
Prevent production launch with unresolved material security exposure.
## Scope
Application, infrastructure, identity, data, dependencies, networks, and operational access.
## MUST
- Readiness MUST evaluate authentication, authorization, secret handling, sensitive data, input boundaries, dependency risk, and least privilege where relevant.
- Critical and high-severity findings MUST be remediated or explicitly accepted by an authorized risk owner before launch.
- Security-sensitive configuration MUST be verified in the actual production configuration path.
- Privileged access MUST be attributable and restricted to operational need.
- Security claims MUST be supported by tests, scans, configuration inspection, threat analysis, or equivalent evidence.
## MUST NOT
- Security controls MUST NOT be disabled merely to meet a release date.
- Secrets MUST NOT be embedded in source, logs, deployment output, or reusable artifacts.
- A passed scanner MUST NOT be treated as proof that no security risk exists.
## SHOULD
- Threat-model significant trust-boundary changes.
- Automate repeatable security checks while retaining human review for design risk.
## Exceptions
Security exceptions require risk owner, scope, rationale, compensating controls, expiry, and remediation plan.
## Verification
Inspect findings, threat analysis, access policies, configuration, tests, exceptions, and secret-management controls.