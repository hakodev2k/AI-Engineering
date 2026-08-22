# Rules: Runtime Budget Enforcement

1. Every model-spend-producing operation **MUST** have a task ID, agent ID, source, model ID, and attempt ID before dispatch.
2. The runtime **MUST** reserve estimated incremental spend before a model call begins.
3. The runtime **MUST NOT** dispatch a call when `actual + outstanding reservations + new reservation` exceeds the applicable hard limit.
4. Budget enforcement **MUST** occur outside the model. A prompt telling the model to stop is not enforcement.
5. Actual provider usage **MUST** reconcile the reservation after completion when usage is available.
6. Missing or delayed usage **MUST** remain reserved or be marked unreconciled until an explicit timeout policy is applied; it **MUST NOT** be silently counted as zero.
7. Parent, subagent, retry, hook, and plugin spend **MUST** be attributable separately when those sources exist.
8. Unknown model pricing **MUST** block monetary-budget enforcement unless an explicitly reviewed fallback price is configured.
9. Hard budget limits **MUST NOT** be raised automatically to make a run succeed.
10. A wrap-up threshold **SHOULD** be lower than the hard ceiling and **SHOULD** permit one bounded final response when sufficient reservation remains.
11. A wrap-up action **MUST NOT** start new research, delegation, broad repository scans, or optional retries.
12. Retry logic **MUST** consume the same task budget and **MUST NOT** reset cumulative spend.
13. Replayed/checkpointed work **MUST** reuse durable accounting identity so earlier spend is not forgotten.
14. Budget state **MUST** use a single-writer or transactional consistency mechanism in concurrent runtimes.
15. Pricing configuration **MUST** record the model identity and **SHOULD** be versioned with an effective date in production.
16. Token reduction **MUST NOT** remove correctness-, safety-, authorization-, or verification-critical context merely to remain under budget.
17. Operators **MUST** be able to distinguish `Implemented`, `Measured`, and `Verified` states. A configured limit without observed block tests is not verified.
18. Every hard-budget block **MUST** emit a reason and remaining/consumed budget without exposing secrets or prompt content.
