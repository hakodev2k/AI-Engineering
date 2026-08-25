# Context Introspection Budget Rules

1. A context/token introspection API MUST be classified as `local`, `remote-free`, `remote-billable`, or `unknown` for each provider/adapter deployment.
2. `unknown` MUST be treated as potentially remote/billable until measurement proves otherwise.
3. Auxiliary introspection requests MUST be metered separately from normal model-turn requests and included in task/session cost accounting.
4. Static context definitions MUST NOT be recounted remotely when provider, model, serialization, and content fingerprint are unchanged and a valid cached count exists.
5. Cache keys MUST include enough identity to prevent cross-model/provider reuse of incompatible token counts.
6. Cache invalidation MUST occur when relevant tool schemas, skill/memory contents, model, provider, tokenization behavior, or serialization changes.
7. A UI progress/context gauge SHOULD update from cached or event-driven measurements and MUST NOT trigger unbounded per-item remote counting on every render/turn.
8. Introspection MUST have explicit request and token budgets per turn/session. Budget breach MUST stop additional auxiliary counting, not remove correctness-critical context limits.
9. Optimization claims MUST include a measured baseline and before/after traces; raw input-token reduction alone is insufficient if context-overflow detection or result quality regresses.
10. Provider billing/invocation records SHOULD be periodically reconciled with local auxiliary-call telemetry.
11. Missing telemetry MUST NOT be interpreted as zero cost.
12. The implementation MUST preserve required context for correctness and MUST NOT disable security/safety context merely to reduce tokens.
13. Retry loops around token-count endpoints MUST be bounded and SHOULD use cached last-known-good counts when safe.
14. The verifier MUST confirm that cache hits correspond to unchanged fingerprints rather than stale data.