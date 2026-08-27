# Dependency Resilience Rules

## Purpose
Prevent dependency failures from becoming uncontrolled API-wide outages.

## Scope
Applies to databases, caches, remote APIs, identity systems, queues, DNS, and other runtime dependencies.

## MUST
- Critical dependencies MUST have documented failure modes, timeout behavior, capacity assumptions, and recovery expectations.
- APIs MUST bound resource use when a dependency slows or fails.
- Dependency health MUST be measured from actual request outcomes, not connectivity alone.
- Fallbacks MUST preserve correctness and security invariants.
- Dependency changes with material reliability impact MUST be tested under degraded conditions before broad rollout.

## MUST NOT
- MUST NOT treat a successful health probe as proof that dependency operations are healthy.
- MUST NOT retry dependency failures indefinitely.
- MUST NOT serve stale or partial data as authoritative unless the contract permits it.

## SHOULD
- Bulkheads, circuit breaking, caching, or alternate paths SHOULD be used where evidence shows they reduce blast radius.
- Dependency budgets SHOULD fit within the caller's latency and availability objectives.

## Exceptions
Exceptions require failure analysis, user-impact assessment, compensating controls, owner, review date, and approval.

## Verification
Review dependency maps, traces, fault-injection tests, timeout/retry settings, degraded-mode tests, and incident evidence.