# Headroom Policy

## Purpose
Maintain sufficient capacity margin for demand variability, failures, scaling delay, and operational recovery.

## Scope
Applies to capacity pools and resources whose saturation can affect service objectives.

## MUST
- Headroom targets MUST be defined from demand volatility, scaling lead time, failure scenarios, and service criticality.
- Capacity calculations MUST reserve required failover or maintenance margin rather than counting all installed capacity as usable.
- Headroom breaches MUST have an owner, severity, and remediation path.
- Changes that materially consume protected headroom MUST be reviewed before production execution.

## MUST NOT
- MUST NOT use one universal utilization threshold for materially different workloads.
- MUST NOT count unavailable, unhealthy, or non-failover-capable resources as usable headroom.
- MUST NOT permanently operate a critical system at sustained saturation without an accepted risk decision.

## SHOULD
- Headroom SHOULD be expressed both as percentage margin and workload units where practical.
- Policies SHOULD distinguish normal, degraded, and emergency operating envelopes.

## Exceptions
Reduced headroom requires documented duration, evidence, compensating controls, rollback or expansion plan, and accountable approval.

## Verification
Inspect utilization distributions, failover models, autoscaling latency, maintenance requirements, alerts, and approved temporary exceptions.
