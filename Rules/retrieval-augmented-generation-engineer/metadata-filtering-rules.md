# Metadata Filtering Rules

## Purpose
Ensure metadata filters narrow retrieval correctly without creating authorization gaps, hidden bias, or brittle query behavior.

## Scope
Applies to tenant, user, document class, source, time, geography, lifecycle, language, and other metadata constraints used during retrieval.

## MUST
- Authorization-related filters MUST be applied before restricted candidates can become visible to downstream stages.
- Filter semantics, missing-value behavior, and type handling MUST be explicit and tested.
- Metadata used for security decisions MUST originate from trusted, validated sources.
- Query-time filters MUST preserve intended user constraints such as date, tenant, product, jurisdiction, or document class.
- Filter changes MUST be evaluated for recall loss, leakage risk, and compatibility with existing indexed metadata.
- Missing mandatory security metadata MUST fail closed.

## MUST NOT
- Client-supplied metadata MUST NOT be trusted for authorization without server-side validation.
- Security filtering MUST NOT occur only after generation.
- Missing filter fields MUST NOT default to broad access.
- Filter expressions MUST NOT be built from unsanitized user input in ways that permit query injection.

## SHOULD
- Separate security filters from relevance filters in code and telemetry.
- Keep filter dimensions low-cardinality where practical for efficient indexing.
- Include filter-specific regression cases in retrieval benchmarks.

## Exceptions
Exceptions require documented reason, threat analysis, compensating controls, and explicit approval when access-control guarantees are affected.

## Verification
Inspect query plans, filter traces, negative authorization tests, missing-metadata tests, tenant-isolation tests, and relevance benchmarks with representative filters.