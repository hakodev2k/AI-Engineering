# Multi-Region Networking Rules

## Purpose
Control cross-region connectivity, routing, failover, and dependency behavior.

## Scope
Applies to inter-region peering, transit, DNS steering, replicated services, and regional failover designs.

## MUST
- Cross-region traffic flows MUST have documented latency, cost, capacity, and failure assumptions.
- Region failover MUST define routing or DNS convergence behavior and recovery sequencing.
- Data residency and security constraints MUST be checked before enabling cross-region paths.
- Shared cross-region components MUST be assessed for correlated failure risk.
- Changes affecting active-active or active-passive traffic distribution MUST be validated before production use.

## MUST NOT
- MUST NOT assume regions fail independently when architecture introduces shared control or transit dependencies.
- MUST NOT route sensitive traffic across regions without policy validation.
- MUST NOT use multi-region networking without understanding inter-region transfer cost and capacity effects.

## SHOULD
- Prefer designs that preserve regional isolation and bounded blast radius.
- Test regional isolation and reconvergence periodically.

## Exceptions
Exceptions require documented business need, failure analysis, security review, cost impact, and approval.

## Verification
Inspect topology, route propagation, DNS policies, transfer metrics, failover test results, and dependency documentation.