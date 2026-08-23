# Telemetry Retention and Lifecycle Rules
## Purpose
Retain enough evidence for operations while controlling privacy, compliance, and cost.
## Scope
Hot storage, archive, deletion, legal retention, and lifecycle tiers.
## MUST
- Define retention by signal value, investigation horizon, compliance, and cost.
- Apply deletion and archival policies consistently.
- Document exceptions for regulated or forensic data.
## MUST NOT
- Retain sensitive telemetry indefinitely without justified policy.
- Delete required audit evidence before mandated retention ends.
## SHOULD
- Use tiered storage for long-lived low-query evidence.
## Exceptions
Incident preservation may temporarily override normal lifecycle with authorized scope and expiry.
## Verification
Inspect lifecycle policies, storage age distribution, deletion jobs, access, and compliance requirements.