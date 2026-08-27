# Windowing and Aggregation
## Purpose
Make temporal aggregation semantics correct and reviewable.
## Scope
Tumbling, sliding, session windows, triggers, and incremental aggregation.
## MUST
- Window boundaries, timezone behavior, triggers, allowed lateness, and update semantics MUST be explicit.
- Aggregations MUST define behavior for duplicates, retractions, and late corrections.
- Numerical aggregation MUST account for overflow, precision, and null/missing values.
## MUST NOT
- Window defaults MUST NOT be accepted when they alter business semantics without review.
## SHOULD
- Incremental aggregation SHOULD be preferred when it reduces state safely.
## Exceptions
Approximate aggregation requires documented error bounds and stakeholder acceptance.
## Verification
Test boundary events, delayed events, duplicate events, empty windows, and correction behavior.