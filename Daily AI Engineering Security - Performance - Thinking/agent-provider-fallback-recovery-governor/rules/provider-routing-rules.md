# Provider Routing Rules

- The runtime MUST distinguish persistent user-selected provider/model from temporary fallback route state.
- Temporary fallback MUST NOT overwrite persistent selection unless the user explicitly changes it.
- Every API call MUST record the actual provider/model used, not only configured intent.
- Transient fallback state MUST be re-evaluated inside long-running turns after cooldown eligibility; turn boundaries alone are insufficient.
- Primary probes MUST be bounded and MUST NOT create provider-switch thrash.
- Hard quota, billing, and authentication failures MUST use longer/operator-driven recovery rather than aggressive probing.
- Adapter/session constructors MUST either receive the configured fallback chain or explicitly report unsupported fallback behavior.
- Failed provider attempts SHOULD use a separate retry/failover budget when consuming the productive agent iteration budget would starve recovery.
- A provider switch MUST include reason, timestamp, prior route, new route, and next eligibility state in telemetry.
- The runtime MUST NOT claim model/provider provenance from configuration when actual per-call route differs.
- Completion MUST NOT be reported as verified when fallback exhaustion terminated required work without a durable failure/recovery event.
- Recovery loops MUST stop when probe-failure or switch budgets are exhausted.
