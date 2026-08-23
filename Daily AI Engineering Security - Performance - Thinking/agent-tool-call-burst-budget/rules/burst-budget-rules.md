# Burst Budget Rules

- The runtime MUST retain a separate hard global turn limit even when the burst gate is enabled.
- Every tool call MUST be classified as progress, retry, poll, or approved fan-out before invocation.
- The runtime MUST measure calls, estimated input tokens, and poll/retry share before claiming improvement.
- A call MUST be blocked or deferred when its configured window budget is exceeded unless an explicit task-scoped fan-out approval exists.
- Fan-out approval MUST be bounded by call count and expiration; it MUST NOT disable the global limit.
- Polling calls MUST NOT consume an unlimited retry loop. A poll budget MUST have a finite maximum.
- A retry SHOULD change a relevant condition, argument, hypothesis, or wait state; identical blind retries SHOULD be rejected by a separate loop detector.
- Budget configuration MUST NOT silently weaken permission, sandbox, secret, or human-approval controls.
- A production rollout MUST compare baseline and candidate runs on representative fixtures.
- The implementing component MUST NOT be the sole verifier of regressions.
- A blocked call MUST emit a deterministic reason and current counters.
- Completion MUST NOT be reported when required verification metrics are missing.
