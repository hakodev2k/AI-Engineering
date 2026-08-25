# Rules: Performance Measurement

- Every optimization **MUST** start from a recorded baseline on a repeatable browser workload.
- A run **MUST** separate browser/tool latency from model latency when telemetry supports it; unknown time **MUST** remain labeled unknown/unattributed rather than guessed.
- Browser observations **SHOULD** include a normalized state fingerprint that excludes volatile noise where safe.
- A repeated state hash **MUST NOT** automatically be removed if the observation is required for security, approval, timing-sensitive validation, or final correctness verification.
- Progress **MUST** be represented independently from tool invocation count.
- Performance claims **MUST** report before/after task success alongside latency/call/token metrics.
- Nondeterministic workloads **SHOULD** use at least three samples and compare medians.
- Optimization **MUST NOT** weaken authentication, authorization, confirmation, sandboxing, data-validation, or required verification controls.
- Compaction **MUST** be treated as a state transition and measured for immediate re-observation/refill behavior.
- A hypothesis loop **MUST** be bounded to two implementation attempts before escalation or stopping.
- Failed quality/security checks **MUST** block a performance-success claim.
- The implementing agent **MUST NOT** be the only verifier when behavior changes can remove or suppress observations.