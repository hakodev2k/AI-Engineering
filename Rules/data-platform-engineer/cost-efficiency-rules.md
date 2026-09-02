# Cost Efficiency Rules

## Purpose
Control platform spend without trading away reliability, security, correctness, or future operability invisibly.

## Scope
Applies to compute, storage, network transfer, managed services, retention, reservations, and platform-wide resource decisions.

## MUST
- Material platform cost drivers MUST be attributable to workloads, tenants, services, or documented shared overhead where practical.
- Cost optimizations MUST quantify expected savings and identify reliability, performance, security, and operational trade-offs.
- Savings claims MUST be validated against actual billing or equivalent usage evidence after implementation.
- Retention, compression, tiering, and compute-rightsizing decisions MUST respect recovery, compliance, and SLO requirements.
- High-cost configuration changes MUST have budget ownership and monitoring sufficient to detect unexpected spend.

## MUST NOT
- MUST NOT delete recoverable history, reduce redundancy, or weaken controls solely for cost savings without approved risk analysis.
- MUST NOT optimize unit cost by shifting material hidden toil or outage risk to consumers.
- MUST NOT treat unused-looking capacity as removable without considering peaks, failover, and scheduled workloads.

## SHOULD
- Prefer unit economics such as cost per processed volume, query, tenant, or workload where meaningful.
- SHOULD automate anomaly detection for major spend categories.

## Exceptions
Exceptions require quantified rationale, risk, evidence, duration when temporary, and accountable financial and technical approval.

## Verification
Use billing exports, resource utilization, unit-cost trends, retention policy inspection, SLO evidence, and post-change cost reconciliation.