# Intelligence Sharing

## Purpose
Share intelligence with internal and external consumers while preserving sensitivity, provenance, licensing, privacy, and operational value.

## When to use
Use for ISAC/community sharing, vendor exchange, partner notifications, internal dissemination, or machine-to-machine feeds.

## Inputs
Intelligence product, handling markings, source permissions, TLP or equivalent, recipient need, legal/privacy constraints.

## Context to inspect
Check source licenses, personal data, victim identifiers, active investigations, recipient trust, sharing agreements, and machine-readable standards.

## Core knowledge
Need-to-share and need-to-know must be balanced. Markings travel with data; derived intelligence may retain source restrictions.

## Procedure
1. Identify intended recipients and defensive purpose.
2. Review source and derivative sharing rights.
3. Classify sensitivity and apply handling markings.
4. Minimize personal, victim, and unnecessary operational data.
5. Validate indicators and expiration before export.
6. Choose human-readable or STIX/TAXII representation as appropriate.
7. Record what was shared, with whom, and when.
8. Provide correction/revocation path.
9. Monitor feedback and downstream misuse where feasible.

## Decision points
Share broader when defensive benefit is high and sensitivity low; restrict or anonymize when victim, legal, privacy, or investigative risk dominates.

## Common failure patterns
Stripped provenance, stale IOCs, licensing violations, accidental victim disclosure, overclassification, and no revocation process.

## Verification
Recipients can interpret markings and provenance, exported data matches policy, and audit records support correction or withdrawal.

## Expected output
Policy-compliant intelligence package with markings, provenance, scope, expiry, and audit record.

## Stop conditions
Stop sharing when rights, recipient authorization, privacy basis, or investigative sensitivity is unresolved.