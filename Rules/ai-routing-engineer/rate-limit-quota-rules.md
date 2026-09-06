# Rate Limit and Quota Rules

## Purpose
Protect routing capacity and provider quotas from overload, starvation, and uncontrolled retry amplification.

## Scope
Provider quotas, model limits, tenant budgets, concurrency, admission control, and queueing.

## MUST
- Known provider and model limits MUST be represented in capacity and routing decisions where material.
- Critical workloads MUST have explicit admission or prioritization behavior during constrained capacity.
- Per-tenant or per-workload controls MUST prevent one caller from exhausting shared routing capacity where multi-tenancy exists.
- Queue length and wait time MUST be bounded when synchronous latency objectives apply.
- Quota exhaustion MUST be observable before it becomes a sustained outage where provider telemetry permits.

## MUST NOT
- MUST NOT respond to rate limiting with unbounded immediate retries.
- MUST NOT reserve critical quota using undocumented manual behavior.
- MUST NOT silently starve higher-priority traffic with best-effort workloads.

## SHOULD
- Use token-bucket, concurrency, or workload-aware controls appropriate to provider semantics.
- Maintain capacity headroom for critical traffic.

## Exceptions
Exceptions require quantified risk, duration, owner, and verification plan.

## Verification
Inspect quota configuration, load tests, throttling metrics, queue telemetry, and priority tests.