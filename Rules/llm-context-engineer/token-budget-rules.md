# Token Budget Rules

## Purpose
Allocate finite context capacity to maximize correctness, utility, and safety.

## Scope
Token limits, source quotas, truncation, compaction, and reserved capacity.

## MUST
- Context budgets MUST reserve capacity for mandatory instructions and expected model output.
- Truncation MUST be deterministic or explicitly relevance-driven and MUST preserve required safety and contract content.
- Large sources MUST be bounded before insertion.
- Budget policies MUST define behavior when required content exceeds capacity.
- Context-size regressions MUST be measured against representative workloads.

## MUST NOT
- Safety-critical instructions MUST NOT be truncated to admit lower-priority content.
- Raw documents MUST NOT be inserted without size controls when they can exhaust the context window.
- Token savings MUST NOT be claimed without measurement.

## SHOULD
- Prefer compact structured representations over repeated prose.
- Allocate budgets by source value, authority, and expected task contribution.

## Exceptions
Exceptions require measured benefit, bounded risk, and verification.

## Verification
Review token accounting, truncation tests, representative traces, and before/after measurements.