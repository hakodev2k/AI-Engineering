# Consistency Rules
## Purpose
Prevent contradictory representations of the same business facts.
## Scope
Cross-table, cross-system, temporal, and semantic consistency.
## MUST
- Shared metrics and entities MUST have documented canonical definitions or explicit transformation differences.
- Cross-system reconciliations MUST define tolerated variance and timing assumptions.
- Conflicting authoritative values MUST be investigated rather than arbitrarily selected.
## MUST NOT
- MUST NOT compare values across different grains or time windows without normalization.
- MUST NOT mask inconsistencies through undocumented coercion.
## SHOULD
- Consistency checks SHOULD target high-value joins and replicated data paths.
## Exceptions
Intentional divergence requires documented ownership, rationale, and consumer-facing semantics.
## Verification
Inspect reconciliation results, grain definitions, transformation logic, and discrepancy investigations.