# Data Minimization Rules

## Purpose
Limit personal-data collection and processing to what is necessary for approved purposes.

## Scope
Forms, APIs, telemetry, analytics, profiling, experiments, model inputs, and derived data.

## MUST
- Each collected personal-data element MUST have a documented purpose and necessity rationale.
- Optional data MUST be distinguishable from required data.
- Derived attributes and inferred data MUST be evaluated as personal data when they relate to identifiable individuals.
- Unused or unjustified fields MUST be removed or disabled.
- Minimization decisions MUST be revisited when purposes or system behavior change.

## MUST NOT
- MUST NOT collect data merely because it may be useful later.
- MUST NOT replicate sensitive data when a reference, token, aggregate, or scoped attribute is sufficient.

## SHOULD
- Prefer coarse-grained, aggregated, pseudonymous, or short-lived data where equivalent outcomes are possible.

## Exceptions
Exceptions require necessity evidence, risk review, owner, duration, and approval.

## Verification
Inspect schemas, payloads, event definitions, analytics plans, model features, and production samples against documented purposes.