# Context Window Rules

## Purpose
Manage finite model context without losing critical instructions or evidence.

## Scope
Long conversations, retrieved context, file inputs, summaries, examples, and dynamically assembled prompts.

## MUST
- Critical instructions and safety constraints MUST remain present or equivalently enforced when context is truncated or summarized.
- Context selection MUST prioritize information by task relevance, authority, freshness, and risk.
- Token budgets MUST reserve capacity for required output and tool interaction.
- Summaries used as replacement context MUST preserve decisions, constraints, unresolved risks, and provenance needed for correctness.

## MUST NOT
- MUST NOT silently drop mandatory requirements to fit token limits.
- MUST NOT flood context with low-value material that displaces higher-priority evidence.
- MUST NOT treat generated summaries as authoritative source data without traceability.

## SHOULD
- Context SHOULD be deduplicated and segmented by function.
- Long-running workflows SHOULD use explicit memory or state structures rather than relying only on transcript position.

## Exceptions
Aggressive truncation is acceptable for low-risk tasks when discarded information cannot affect correctness or safety.

## Verification
Test near-limit scenarios, inspect assembled context, verify retention of critical constraints, and measure output quality under realistic token pressure.