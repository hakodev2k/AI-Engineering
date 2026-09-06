# Rules: Reasoning Cache Preservation

- Dynamic reasoning-effort changes for compatible GPT-6 Astra standard single-agent flows MUST use an observable `configuration_update` transition when cache preservation is required.
- Request-level `reasoning.effort` MUST remain stable across a cache-preserving transition unless the provider compatibility rules require otherwise.
- Every optimization claim MUST include a measured baseline and post-change comparison.
- Cache preservation MUST be evaluated using cached-input tokens or an equivalent provider-supported signal, not total tokens alone.
- The workflow MUST record transition mode as `configuration_update`, `request_level`, or `none` from observable request/history data.
- Teams MUST NOT remove correctness-critical instructions, tool state, user requirements, or safety context merely to reduce tokens.
- Quality acceptance MUST remain equal to or better than the defined baseline; token savings MUST NOT override a quality regression.
- A cache-hit ratio drop, token increase, or latency increase beyond configured thresholds MUST block a Verified optimization claim.
- Framework serialization/replay support MUST NOT be assumed to prove that the production setting-change path emits the intended transition.
- Resume, fork, and replay paths SHOULD be tested separately if they persist configuration state.
- Retries MUST be bounded to two migration/retest cycles.
- The agent implementing the transition MUST NOT be the only verifier.
