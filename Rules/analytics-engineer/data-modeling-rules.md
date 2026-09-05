# Data Modeling Rules

## Purpose
Ensure analytical models preserve business meaning, remain maintainable, and support reliable downstream use.

## Scope
Applies to fact tables, dimensions, marts, intermediate models, snapshots, and analytical datasets.

## MUST
- Models MUST have a clearly defined grain that is documented and testable.
- Facts, dimensions, and derived attributes MUST preserve stable business semantics across releases.
- Primary business keys and surrogate keys MUST have explicit uniqueness and nullability expectations.
- Denormalization decisions MUST be justified by query patterns, usability, or performance evidence.
- Model ownership and downstream impact MUST be known before materially changing structure or semantics.

## MUST NOT
- MUST NOT mix multiple incompatible grains in one model without explicit, documented semantics.
- MUST NOT duplicate core business logic across marts when a reusable upstream model can own it.
- MUST NOT expose ambiguous column names whose business meaning depends on tribal knowledge.

## SHOULD
- Prefer conformed dimensions and reusable intermediate models when they reduce semantic drift.
- Keep model boundaries aligned with business domains and ownership.

## Exceptions
Exceptions require documented context, alternatives considered, downstream risk, and verification evidence.

## Verification
Review model grain, uniqueness tests, schema tests, lineage, representative queries, and downstream references.