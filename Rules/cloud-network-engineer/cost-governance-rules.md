# Network Cost Governance Rules

## Purpose
Ensure cloud network architecture balances reliability and security with sustainable operating cost.

## Scope
Applies to data transfer, NAT, load balancers, transit services, private connectivity, dedicated circuits, and cross-region traffic.

## MUST
- Network designs MUST identify major traffic-based and fixed-cost drivers before approval.
- Cross-region, cross-zone, and internet data-transfer patterns MUST be evaluated when they can materially affect cost.
- Expensive shared services MUST have ownership, utilization visibility, and review criteria.
- Cost optimization proposals MUST preserve required security, availability, and performance outcomes.
- Material architectural cost increases MUST be supported by workload demand or risk reduction evidence.

## MUST NOT
- MUST NOT reduce redundancy or security solely to lower cost without explicit risk approval.
- MUST NOT assume provider transfer pricing is uniform across paths.
- MUST NOT introduce high-volume hairpin traffic without evaluating alternatives.

## SHOULD
- Prefer architectures that keep high-volume traffic local when consistent with resilience requirements.
- Review network spend trends against utilization and business growth.

## Exceptions
Exceptions require documented business value, cost impact, alternatives considered, and approval.

## Verification
Inspect billing dimensions, traffic metrics, topology, transfer paths, utilization reports, and architecture decisions.