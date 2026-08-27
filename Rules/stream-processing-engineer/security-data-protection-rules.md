# Security and Data Protection
## Purpose
Protect streaming data, credentials, and control surfaces.
## Scope
Identity, authorization, encryption, secrets, sensitive events, and auditability.
## MUST
- Producers, processors, state stores, and sinks MUST use least-privilege identities.
- Sensitive data MUST be classified and protected in transit, at rest, in state, and in diagnostic output.
- Secrets MUST come from approved secret-management mechanisms and be rotatable.
- Privilege or security-control changes affecting production MUST require authorized approval.
## MUST NOT
- Credentials, tokens, or sensitive payloads MUST NOT be committed or logged.
- Security controls MUST NOT be weakened merely to restore throughput or connectivity.
## SHOULD
- Access to replay and administrative operations SHOULD be separately controlled and audited.
## Exceptions
Exceptions require security review, expiry, compensating controls, and evidence.
## Verification
Inspect IAM, encryption, secret references, audit logs, scanners, and representative telemetry.