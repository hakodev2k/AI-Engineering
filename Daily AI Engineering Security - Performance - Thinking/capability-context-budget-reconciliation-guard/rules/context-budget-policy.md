# Context Budget Policy Rules

## Scope
These rules apply when changing capability catalogs, tool/skill/plugin visibility, schema size, lazy loading, deduplication, prompt prefixes, or any host behavior intended to reduce context usage.

## Enforceable rules
- A token optimization **MUST** capture a whole-context baseline before implementation.
- A category-row reduction **MUST NOT** be claimed as a context reduction unless total effective context also decreases by the policy threshold.
- The team **MUST** compare before/after category deltas and **MUST** investigate compensating growth in unrelated categories.
- Disabled or hidden capabilities **MUST NOT** be assumed absent from model context without measurement.
- Required correctness, security, tool contracts, and active-task context **MUST NOT** be removed merely to meet a token target.
- Every optimization **MUST** define `max_total_tokens` and, when a removal is expected, `expected_removed_tokens` plus `min_effective_reduction_ratio`.
- Prompt-cache improvements **MUST** be reported separately from context-window reduction. Cached tokens still occupy context.
- Capability ordering **SHOULD** be deterministic where the protocol/runtime permits it to stabilize prompt prefixes.
- Lazy loading **SHOULD** preserve an explicit retrieval path for capabilities required by the task.
- A candidate **MUST** pass task-quality regression tests at or above the configured quality floor before completion.
- A host upgrade or plugin/MCP inventory change **MUST** rerun the reconciliation gate when it changes startup context.
- Automatic optimization retries **MUST** be bounded to three hypotheses.
- If a token reduction causes security or correctness regression, the change **MUST** be rejected regardless of cost savings.

## Blocking conditions
Completion is blocked by total-budget breach, insufficient effective reduction, unexplained category displacement above policy, missing baseline, or failed quality regression tests.

## Evidence
Preserve baseline/candidate snapshots, policy, reconciliation JSON, and independent quality-test results for each accepted change.
