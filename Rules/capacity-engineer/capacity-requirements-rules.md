# Capacity Requirements

## Purpose
Define measurable capacity requirements before sizing or scaling decisions are made.

## Scope
Applies to services, platforms, databases, networks, storage, queues, and shared infrastructure.

## MUST
- Capacity requirements MUST state expected demand, peak demand, growth horizon, latency or throughput objectives, availability targets, and acceptable saturation levels.
- Assumptions MUST distinguish observed facts from forecasts.
- Critical dependencies and external service limits MUST be included in capacity requirements.
- Requirements MUST define the business or operational impact of insufficient capacity.

## MUST NOT
- MUST NOT size systems from average utilization alone.
- MUST NOT treat an unvalidated forecast as guaranteed demand.
- MUST NOT omit known seasonal, launch, migration, or failover scenarios.

## SHOULD
- Requirements SHOULD include confidence ranges and multiple demand scenarios where uncertainty is material.
- Capacity targets SHOULD be expressed in workload-relevant units rather than infrastructure units alone.

## Exceptions
Exceptions require documented rationale, evidence, risk, review date, and approval from the accountable owner.

## Verification
Review requirement documents, historical demand evidence, service objectives, dependency limits, and scenario coverage before approving a capacity plan.
