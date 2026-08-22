# Tool-Burst Rules

- The runtime **MUST** establish baseline calls/turn, tokens/turn, and turn latency before claiming improvement.
- The runtime **MUST** retain an independent hard global turn/step ceiling.
- The runtime **MUST** evaluate heterogeneous bursts; it **MUST NOT** rely only on identical-call signatures.
- The runtime **MUST** count consecutive tool calls since the last user-visible or structured consolidation checkpoint.
- The runtime **MUST** track at least call count and cumulative prompt/input tokens when usage is available.
- The runtime **SHOULD** track elapsed burst time and repeated target/domain locality.
- Crossing a configured budget **MUST** require a consolidation checkpoint before additional ordinary tool calls.
- A checkpoint **MUST** state facts/evidence obtained, unresolved hypothesis, and why another call is necessary; it **MUST NOT** request hidden chain-of-thought.
- Budget reset **MUST NOT** occur merely because the model emits filler text; reset requires a valid checkpoint event defined by the host.
- Security approval and least-privilege rules **MUST NOT** be weakened to reduce tool count.
- Retry loops **MUST** remain bounded.
- Performance improvement **MUST NOT** be reported unless before/after metrics show lower waste with no material completion regression.
