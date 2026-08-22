# Rules — Token Telemetry Semantics

- Token counters MUST have explicit semantics: current-context, per-turn output, cached input, cumulative session, or estimate.
- Every normalized token value MUST record a measurement source.
- Provider-measured or tokenizer-measured current-context values MUST NOT be overwritten by estimates.
- Cumulative session usage MUST NOT be used as current context occupancy.
- Context-management automation MUST use current-context tokens plus model context-window capacity, never an ambiguous `tokens_used` field.
- Session cumulative counters SHOULD be monotonic; decreases MUST be explained by a new session/ledger identity.
- Current-context tokens greater than the declared model window MUST be treated as inconsistent telemetry, not automatically as proof that the model exceeded its window.
- Estimated and measured values SHOULD coexist when available so estimator error can be measured.
- Estimator relative error MUST be checked against policy before the estimator drives compaction thresholds.
- Multilingual/non-ASCII samples MUST be included when validating byte/character-based estimators.
- Cached input MUST remain distinguishable from uncached input and cumulative consumption.
- UI labels SHOULD say `current context`, `session cumulative`, or `estimated` rather than generic `used tokens`.
- Missing semantics or provenance MUST block automated compaction/routing decisions when configured by policy.
