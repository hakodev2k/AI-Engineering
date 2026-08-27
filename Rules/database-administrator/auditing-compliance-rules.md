# Auditing and Compliance

## Purpose
Provide reliable evidence of sensitive database access and administrative actions.

## Scope
Audit configuration, privileged actions, sensitive-data access, retention, and evidence handling.

## MUST
- Audit coverage MUST reflect applicable security, privacy, and regulatory requirements identified for the system.
- Privileged administrative actions MUST be attributable to an identity and retained according to policy.
- Audit storage MUST be protected against unauthorized alteration and access.
- Changes to audit configuration MUST themselves be controlled and reviewable.

## MUST NOT
- MUST NOT disable required auditing merely to reduce overhead without approved risk treatment.
- MUST NOT log secrets, full credentials, or unnecessary sensitive payloads as audit evidence.
- MUST NOT claim compliance from configuration alone when operational evidence is required.

## SHOULD
- Audit events SHOULD be centralized where this improves tamper resistance and investigation.
- Retention SHOULD balance evidentiary requirements with data-minimization obligations.

## Exceptions
Exceptions require requirement mapping, risk owner, compensating evidence, duration, and compliance/security approval when applicable.

## Verification
Inspect audit settings, sample events, identity attribution, retention, access controls, configuration-change history, and evidence retrieval tests.