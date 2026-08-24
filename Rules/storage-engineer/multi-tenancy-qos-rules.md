# Multi-Tenancy and QoS Rules

## Purpose
Prevent one workload or tenant from causing uncontrolled performance, capacity, or availability impact to others.

## Scope
Shared pools, quotas, reservations, limits, priority, noisy-neighbor control, and tenant isolation.

## MUST
- Shared storage MUST define resource isolation appropriate to tenant criticality and contention risk.
- QoS limits and guarantees MUST be based on measured workload needs and platform behavior.
- Capacity ownership and quota escalation paths MUST be explicit for shared environments.
- Changes to tenant limits MUST assess downstream saturation and fairness.

## MUST NOT
- MUST NOT promise guarantees the underlying system cannot enforce under failure or saturation.
- MUST NOT allow unbounded consumers to threaten critical shared capacity without explicit risk acceptance.
- MUST NOT use throttling to conceal a systemic capacity deficit indefinitely.

## SHOULD
- Monitor per-tenant consumption, throttling, latency, and contention where the platform supports it.

## Exceptions
Temporary limit increases require expiry, capacity evidence, and accountable approval.

## Verification
Inspect QoS policies, quotas, per-tenant telemetry, contention tests, saturation events, and exception records.