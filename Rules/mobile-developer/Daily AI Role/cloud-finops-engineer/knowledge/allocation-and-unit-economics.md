# Allocation and Unit Economics

## Allocation hierarchy
Prefer deterministic ownership in this order: direct account/subscription/project ownership → resource metadata → service/catalog mapping → shared-cost driver → documented residual pool.

Shared costs SHOULD use a causal driver where feasible: requests, compute hours, users, storage, revenue, team size, or another agreed consumption proxy. Avoid arbitrary equal split unless explicitly accepted.

Track allocation coverage and stale ownership metadata. Unallocated cost MUST remain visible rather than silently distributed.

## Unit economics
A useful unit metric links cost to an outcome: cost per transaction, customer, active user, build, GB processed, API request, environment, order, or tenant.

For each unit metric define numerator, denominator, time window, exclusions, owner, source, and sensitivity to demand. A falling total bill with worse cost per successful transaction can indicate degradation rather than optimization.
