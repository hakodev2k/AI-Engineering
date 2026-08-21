# Execution Rules

- Every call MUST be fingerprinted before dispatch.
- Fingerprints MUST use canonical arguments plus logical scope; provider call IDs MUST NOT be the sole identity.
- Tools MUST declare `read`, `idempotent-write`, or `non-idempotent-write`; unknown tools MUST use the safest class.
- Exact duplicate reads SHOULD execute once per configured scope.
- Non-idempotent writes MUST NOT be replayed or collapsed through cached output unless an application-owned idempotency contract explicitly permits it.
- Same call ID with different arguments MUST be treated as an integrity anomaly and MUST NOT be merged.
- Legitimate distinct calls SHOULD retain bounded parallel execution.
- Completion MUST include before/after measurements and regression results.
- Optimization MUST NOT weaken permission, approval, or tool-input validation rules.