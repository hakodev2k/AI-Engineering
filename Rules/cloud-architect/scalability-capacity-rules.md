# Scalability and Capacity Rules

## Purpose
Ensure cloud architectures scale predictably from measured demand while preserving safety margins and bounded failure behavior.

## Scope
Applies to compute, storage, database, network, quotas, concurrency, autoscaling, and growth planning.

## MUST
- Capacity designs MUST use measured or explicitly modeled demand, growth assumptions, bottlenecks, quotas, and headroom.
- Critical services MUST identify hard platform limits and quota exhaustion paths before production launch.
- Autoscaling policies MUST define safe minimums, maximums, signals, cooldown behavior, and downstream capacity constraints.
- Scale tests MUST include realistic traffic shape, concurrency, data volume, and dependency behavior.

## MUST NOT
- MUST NOT claim scalability from theoretical service limits alone.
- MUST NOT autoscale one tier in a way that can overwhelm constrained downstream systems.
- MUST NOT operate critical workloads continuously near hard capacity limits without an accepted risk plan.

## SHOULD
- Prefer horizontal scaling and stateless designs when compatible with workload semantics.
- Maintain forecast and capacity reviews for rapidly growing workloads.

## Exceptions
Exceptions require quantified demand, risk, operational mitigation, monitoring thresholds, and accountable approval.

## Verification
Review load-test evidence, capacity models, quota settings, autoscaling configuration, saturation metrics, and production growth trends.