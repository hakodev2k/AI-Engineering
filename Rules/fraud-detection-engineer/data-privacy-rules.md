# Data Privacy Rules

## Purpose
Limit fraud-data use to justified, authorized, and protected purposes.

## Scope
Personal data, behavioral telemetry, identity attributes, device data, investigation evidence, and third-party data.

## MUST
- Fraud data MUST have a defined purpose, authorized access, retention policy, and protection appropriate to sensitivity.
- Data collection MUST be minimized to what is necessary for legitimate fraud objectives.
- Access to sensitive investigation data MUST follow least privilege and be auditable.
- Data sharing and third-party enrichment MUST comply with applicable contractual, legal, and privacy constraints.

## MUST NOT
- MUST NOT copy sensitive production data into unmanaged analysis locations.
- MUST NOT log secrets, authentication tokens, or unnecessary sensitive payloads.
- MUST NOT repurpose fraud data for unrelated objectives without appropriate authorization.

## SHOULD
- Analysis datasets SHOULD use de-identification or minimized fields where practical.

## Exceptions
Require documented necessity, privacy/security review, bounded access, retention, and approval.

## Verification
Inspect data inventories, access logs, retention controls, lineage, query permissions, logging configuration, and privacy reviews.