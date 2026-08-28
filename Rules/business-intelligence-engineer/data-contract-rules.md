# Data Contract Rules

## Purpose
Protect BI consumers from undocumented upstream changes.

## Scope
Applies to source tables, events, files, APIs, and curated datasets consumed by BI systems.

## MUST
- Critical sources MUST define expected schema, key fields, nullability, freshness, and ownership.
- Contract-breaking source changes MUST be detected before downstream production reports are released.
- Consumers MUST define behavior for missing, late, or structurally invalid source data.
- Contract versions MUST be traceable to affected models and dashboards.

## MUST NOT
- MUST NOT assume an upstream field is stable solely because it has not changed previously.
- MUST NOT silently coerce incompatible data types when financial or operational meaning can change.

## SHOULD
- Contracts SHOULD be machine-validated in CI or pipeline checks when practical.

## Exceptions
Exceptions require documented source limitations, risk assessment, compensating validation, and owner approval.

## Verification
Inspect schema tests, pipeline checks, ownership metadata, change logs, and failure-path behavior.