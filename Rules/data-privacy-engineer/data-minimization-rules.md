# Data Minimization Rules

## Purpose
Limit personal-data collection and processing to what is necessary for an approved purpose.

## Scope
Applies to product fields, telemetry, analytics, imports, APIs, caches, feature stores, logs, test data, and derived attributes.

## MUST
- Every personal-data field MUST have a documented purpose and a current consumer.
- Collection and persistence MUST be limited to data necessary for the approved processing purpose.
- New sensitive fields MUST be justified before schema or event-contract changes are approved.
- Periodic reviews MUST identify unused personal fields, redundant copies, and unnecessary precision.

## MUST NOT
- Systems MUST NOT collect personal data "for future use" without a defined approved purpose.
- Full records MUST NOT be copied when only a subset of fields is needed.
- Debugging convenience MUST NOT justify permanent capture of sensitive payloads.
- Derived identifiers or fingerprints MUST NOT be introduced as a workaround for restrictions on direct identifiers.

## SHOULD
- Systems SHOULD prefer coarse-grained or aggregated data when it satisfies the use case.
- Short-lived processing SHOULD be preferred over persistence where durable storage is unnecessary.

## Exceptions
Exceptions require a documented purpose, necessity analysis, alternatives considered, retention limit, risk controls, and approval where the added data materially increases privacy risk.

## Verification
Review schemas, event payloads, API contracts, analytics queries, logs, storage snapshots, and data-usage telemetry. Confirm each collected field has a justified consumer and retention path.