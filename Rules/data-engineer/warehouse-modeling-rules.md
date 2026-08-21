# Warehouse Modeling Rules
## Purpose
Keep analytical models consistent, performant, and understandable to consumers.
## Scope
Facts, dimensions, marts, semantic layers, and analytical tables.
## MUST
- Grain, keys, business definitions, and update semantics MUST be explicit.
- Shared metrics MUST have one governed definition or clearly named variants.
- Slowly changing behavior MUST be intentional and tested where history matters.
## MUST NOT
- MUST NOT mix incompatible grains in one model without explicit aggregation semantics.
- MUST NOT duplicate core business metrics with conflicting logic.
## SHOULD
- Prefer models optimized for common analytical access patterns and clear semantics.
## Exceptions
Specialized models may diverge when consumer needs justify it and naming prevents ambiguity.
## Verification
Review model docs, metric definitions, dimensional tests, sample queries, and consumer usage.