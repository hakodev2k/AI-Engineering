# Sensitive Data Rules

## Purpose
Prevent graph structure and properties from exposing sensitive information or enabling unsafe inference.

## Scope
Personal, confidential, regulated, security-sensitive, and derived graph data.

## MUST
- Classify sensitive node, relationship, and property data before production use.
- Minimize collection and retention to documented purposes.
- Protect sensitive data in transit and at rest using approved controls.
- Evaluate inference risk where relationship topology reveals information not obvious from individual properties.
- Define deletion and retention behavior that accounts for connected data, indexes, replicas, exports, and backups.

## MUST NOT
- Log secrets, tokens, or unnecessary sensitive graph payloads.
- Duplicate sensitive attributes across nodes for convenience without lifecycle and access-control analysis.
- Assume pseudonymous identifiers eliminate re-identification risk.

## SHOULD
- Separate sensitive projections from general-purpose query surfaces.
- Prefer aggregated or minimized outputs for analytical consumers.

## Exceptions
Additional retention or duplication requires purpose, legal/policy basis where applicable, access controls, lifecycle, risk, and approval.

## Verification
Inspect data classification, schemas, query outputs, logs, exports, retention jobs, deletion tests, access tests, and backup lifecycle evidence. Review topology-based inference scenarios for sensitive domains.