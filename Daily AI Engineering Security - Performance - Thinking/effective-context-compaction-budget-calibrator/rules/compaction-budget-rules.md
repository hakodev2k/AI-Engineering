# Rules — Compaction Budget

- Runtime decisions MUST distinguish raw context capacity from effective usable context.
- Effective usable context MUST subtract explicit output and provider reserves from the raw window.
- Runtime-counted occupancy MUST be compared with independently observed request-level occupancy before accepting a new threshold.
- Token categories MUST NOT be double-counted across prompt, reasoning, cache, or derived totals.
- Model or provider changes MUST invalidate prior calibration unless equivalent limits and accounting semantics are proven.
- A compaction trigger MUST preserve configured minimum headroom against effective usable context.
- Token optimization MUST NOT remove active instructions, security policy, approvals, task state, or verification evidence required for correctness.
- Production rollout MUST include before/after tokens/task, compactions/task, latency/task, overflow recoveries, and task quality.
- Failed calibration or ambiguous telemetry MUST block claims that the budget is verified.
- Calibration retries MUST be bounded to two recaptures before escalation.
- The implementing agent MUST NOT be the sole verifier of a production budget change.
- Operators SHOULD retain versioned calibration snapshots for regression attribution.
