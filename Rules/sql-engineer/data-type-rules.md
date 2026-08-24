# Data Type Rules

## Purpose
Preserve domain meaning, comparison correctness, storage efficiency, and predictable query behavior through deliberate types.

## Scope
Numeric, string, temporal, binary, identifier, JSON/semi-structured, and engine-specific types.

## MUST
- Types MUST represent required range, precision, scale, encoding, and semantics without silent loss.
- Monetary and exact quantities MUST use exact representations when approximation is unacceptable.
- Temporal values MUST have an explicit time-zone and precision strategy.
- Type changes MUST assess conversion failures, truncation, indexes, constraints, and consumer compatibility.

## MUST NOT
- MUST NOT use floating-point for exact financial equality requirements.
- MUST NOT depend on implicit conversions when they can change semantics or materially degrade access paths.
- MUST NOT shrink or reinterpret types destructively without validated data and approval.

## SHOULD
- Prefer domain-appropriate bounded types over generic text storage.
- Standardize identifier and temporal representations across integration boundaries where feasible.

## Exceptions
Generic/semi-structured storage requires rationale, validation ownership, indexing strategy, and evolution plan.

## Verification
Inspect DDL and conversions; test min/max, precision, Unicode/collation, time-zone, daylight-saving, and invalid values; review plans for conversion-induced scans.