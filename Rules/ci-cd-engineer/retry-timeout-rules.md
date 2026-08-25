# Retry and Timeout Rules

## Purpose
Bound failure amplification and prevent hung delivery work.

## Scope
Network calls, package restoration, tests, deployments, health checks, and external integrations.

## MUST
- External operations MUST have explicit timeouts appropriate to expected latency.
- Retries MUST be limited, observable, and restricted to failures reasonably considered transient.
- Side-effecting retries MUST be idempotent or deduplicated.
- Retry exhaustion MUST fail visibly with diagnostic evidence.
- Backoff and jitter MUST be considered when many jobs can retry the same dependency.

## MUST NOT
- MUST NOT retry deterministic test failures merely to hide instability.
- MUST NOT use unbounded retries or waits.
- MUST NOT retry destructive operations without proven replay safety.

## SHOULD
- Retry policy SHOULD distinguish connection, throttling, validation, authorization, and application failures.

## Exceptions
Long-running operations require documented expected duration, cancellation path, monitoring, and owner.

## Verification
Inspect timeout/retry configuration, simulate transient and permanent failures, verify bounded duration, check logs for initial failures, and test side-effect replay safety.