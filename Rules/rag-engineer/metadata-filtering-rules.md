# Metadata Filtering Rules

## Purpose
Ensure filters improve relevance while preserving correctness and access boundaries.

## Scope
Metadata schemas, filters, namespaces, tenant constraints, dates, categories, and source attributes.

## MUST
- Filterable metadata MUST have defined type, semantics, and ownership.
- Authorization filters MUST be applied before restricted content can enter candidate context.
- Date and range filters MUST define timezone and boundary behavior.
- Metadata schema changes MUST preserve compatibility or include migration.
- Filter effectiveness MUST be tested with representative positive and negative cases.

## MUST NOT
- MUST NOT rely on client-supplied metadata alone for authorization decisions.
- MUST NOT silently ignore unsupported or malformed security-relevant filters.
- MUST NOT use free-text labels as trusted tenant identifiers.

## SHOULD
- Normalize categorical metadata consistently.
- Keep filter logic observable separately from semantic ranking.

## Exceptions
Post-retrieval filtering is allowed only when pre-retrieval enforcement is impossible and leakage is prevented.

## Verification
Inspect metadata schemas, authorization tests, boundary cases, filter telemetry, and migration results.