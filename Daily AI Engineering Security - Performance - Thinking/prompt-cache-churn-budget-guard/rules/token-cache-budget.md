# Rules: Token and Cache Budget

- Large-context turns MUST expose `input_tokens` and `cached_tokens` when the provider returns them.
- Large-context turns MUST carry a stable `prefix_id` or equivalent fingerprint when policy requires one.
- Expected cache invalidations MUST be explicitly marked before they are excluded from churn alerts.
- An unexplained same-prefix cache-ratio collapse MUST count against the churn budget.
- Repeated large-context turns with no semantic progress MUST stop when the configured budget is exceeded.
- The system MUST NOT delete correctness-critical context merely to increase cache reuse.
- Cache optimization changes MUST be measured against a baseline and MUST include a quality/regression check.
- Retry loops MUST be bounded to two optimization attempts unless a human explicitly authorizes another attempt.
- Telemetry MUST NOT log raw secrets, credentials, or unnecessary private prompt content.
- A failed cache guard SHOULD block unattended continuation until the caller compacts safely, restores a stable prefix, changes strategy, or explicitly accepts the measured cost.
