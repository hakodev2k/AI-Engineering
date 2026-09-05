# Token Budget Rules

1. Context-window capacity **MUST** come from validated model/provider configuration.
2. Token accounting **MUST** distinguish used tokens, remaining tokens, reserved tokens, and total context capacity.
3. Compaction **MUST** use one documented canonical equation and **MUST** have threshold boundary tests.
4. A token optimization **MUST NOT** remove user requirements, security rules, unresolved evidence, active task state, or verification criteria required for correctness.
5. Every compaction event **MUST** record pre-compaction used tokens, effective capacity, configured threshold, and resulting summary size.
6. Performance claims **MUST** compare the same representative workload before and after.
7. Lower token usage **MUST NOT** be accepted when critical-context loss or material quality regression is detected.
8. Model metadata overrides **MUST** be explicit and **SHOULD** include source and review date.
9. Unknown or contradictory capacity **MUST** block automatic threshold expansion.
10. Optimization loops **MUST** be bounded to two iterations before fallback/escalation.
11. Static duplicated instructions and repeated tool output **SHOULD** be addressed only after compaction arithmetic is proven correct.
12. Implementers **MUST NOT** be the sole verifier of quality-sensitive context changes.