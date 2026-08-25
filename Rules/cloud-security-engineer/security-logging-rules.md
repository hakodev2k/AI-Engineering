# Security Logging

## Purpose
Preserve trustworthy evidence for detection, investigation, and accountability.

## Scope
Cloud control-plane, identity, network, data-access, workload, and security-service logs.

## MUST
- Security-relevant administrative and authentication events MUST be logged where the platform supports it.
- Critical logs MUST be centralized, access-controlled, time-synchronized, retained according to requirements, and protected from unauthorized deletion.
- Log pipelines MUST expose delivery failures and material coverage gaps.
- Sensitive fields MUST be filtered or protected before ingestion.

## MUST NOT
- MUST NOT log secrets, session tokens, private keys, or unnecessary sensitive payloads.
- MUST NOT claim investigative coverage without confirming relevant event sources are enabled and retained.

## SHOULD
- Normalize high-value fields and preserve source identifiers needed for correlation.
- Test log availability during incident exercises.

## Exceptions
Document missing telemetry, risk, alternative evidence, remediation owner, target date, and approval where the gap is material.

## Verification
Inspect enabled log sources, sample events, retention, access controls, integrity protections, delivery health, and end-to-end queryability.