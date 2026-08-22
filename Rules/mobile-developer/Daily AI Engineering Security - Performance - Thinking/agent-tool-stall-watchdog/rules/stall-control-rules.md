# Stall Control Rules

## MUST
- Establish healthy runtime and silence baselines before tuning thresholds.
- Use a monotonic clock for liveness and deadlines.
- Maintain both a global run deadline and a shorter silence deadline.
- Capture diagnostics before termination.
- Terminate the complete process tree after the grace period when supported.
- Retry only explicitly idempotent/safe work.
- Account retry delay and execution against the original global budget.
- Bound retries and backoff.
- Record tool/stage/version identifiers when available.

## MUST NOT
- Treat increasing the global timeout as evidence that performance is fixed.
- Retry an operation with unknown side-effect status automatically.
- Allow an infinite silent wait.
- Reset the global deadline when retrying.
- suppress a repeated stall by weakening observability.
- claim upstream root cause from timing correlation alone.

## SHOULD
- Configure stage-specific silence thresholds for legitimately long operations.
- Include jitter in multi-worker retries.
- Preserve the last bounded stdout/stderr window for diagnosis.
- Alert when the same stage breaches the watchdog repeatedly.
- Compare p95/p99 wall-clock and silence distributions after rollout.
- Keep the platform-level outer timeout as a final independent safety net.