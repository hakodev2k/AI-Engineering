# Failure Domain Capacity Rules
## Purpose
Preserve service objectives during credible infrastructure failures.
## Scope
Host, rack, zone, region, cluster, and dependency failure domains.
## MUST
- Critical services MUST calculate usable capacity after the required failure-domain loss.
- Failover destinations MUST have verified capacity for transferred demand.
- Capacity plans MUST account for degraded efficiency during failover when evidence shows it occurs.
## MUST NOT
- MUST NOT count the same reserve capacity for mutually concurrent failure scenarios without analysis.
- MUST NOT declare N+1 resilience from topology alone.
## SHOULD
- Failure scenarios SHOULD align with reliability objectives and incident history.
## Exceptions
Accepted resilience gaps require explicit owner, risk acceptance, and remediation date.
## Verification
Review topology, failover tests, load evidence, and post-failure headroom calculations.