# Data Integrity Rules

## Purpose
Detect and prevent silent corruption and inconsistent storage state.

## Scope
Checksums, end-to-end validation, filesystems, metadata, repair, and transfer integrity.

## MUST
- Integrity-critical data MUST use available checksum or equivalent validation mechanisms across relevant storage layers.
- Integrity errors MUST be surfaced, investigated, and tracked to resolution.
- Data movement and migration MUST include source-to-destination validation appropriate to risk.
- Repair operations MUST preserve evidence needed to determine scope and root cause.

## MUST NOT
- MUST NOT silently discard checksum, media, or filesystem corruption signals.
- MUST NOT overwrite suspected-corrupt source data before a recoverable copy or forensic decision exists.
- MUST NOT assume successful transport implies content integrity.

## SHOULD
- Use periodic scrubbing and independent validation for long-lived critical data.

## Exceptions
Validation may be sampled for very large low-criticality datasets if sampling risk is documented and approved.

## Verification
Review checksum configuration, scrub reports, error logs, migration validation results, and incident records.