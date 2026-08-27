# Audit and Observability
## Purpose
Provide evidence for identity operations, investigations, and control assurance.
## Scope
Authentication, authorization, provisioning, administration, and policy telemetry.
## MUST
- Security-relevant identity events MUST record actor, subject, action, outcome, time, and relevant correlation context.
- Audit data MUST be protected from unauthorized modification and access.
- Detection coverage MUST include privileged changes and repeated or anomalous authentication failures where relevant.
## MUST NOT
- Tokens, passwords, private keys, or recovery secrets MUST NOT appear in telemetry.
- Production conclusions MUST NOT rely on agent confidence when logs or metrics can provide evidence.
## SHOULD
- Correlate identity events across provider and relying systems.
## Exceptions
Document unavailable telemetry, impact, alternate evidence, and remediation plan.
## Verification
Inspect event schemas, retention, dashboards, alerts, access controls, and incident queries.