# IP Address Management Rules

## Purpose
Prevent address conflicts, exhaustion, and ambiguous ownership across cloud networks.

## Scope
Applies to private and public IP ranges, subnet allocation, IPAM systems, reservation policies, and hybrid connectivity.

## MUST
- Address allocations MUST be centrally tracked with owner, purpose, environment, region, and lifecycle state.
- New ranges MUST be checked for overlap with connected cloud, on-premises, partner, and future expansion ranges.
- Subnet sizing MUST include evidence-based capacity headroom.
- Reserved infrastructure addresses MUST be documented and protected from accidental reuse.
- Public IP assignments MUST have explicit business and security justification.

## MUST NOT
- MUST NOT allocate CIDR ranges ad hoc outside the approved IPAM process.
- MUST NOT reuse ranges that may later become routable to each other without documented isolation guarantees.
- MUST NOT depend on manual spreadsheets as the sole source of truth for large environments.

## SHOULD
- Prefer hierarchical allocation strategies that preserve aggregation and growth capacity.
- Reclaim unused allocations through a controlled decommission process.

## Exceptions
Exceptions require conflict analysis, owner approval, migration impact, and documented compensating controls.

## Verification
Inspect IPAM records, route domains, cloud subnet definitions, overlap checks, and utilization reports.