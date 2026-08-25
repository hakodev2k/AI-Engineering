# Cost Efficiency Rules
## Purpose
Balance database performance objectives with sustainable infrastructure and operational cost.
## Scope
Compute, storage, licensing, replicas, managed-service tiers, and tuning alternatives.
## MUST
- Quantify expected performance benefit and recurring cost for material scaling recommendations.
- Compare tuning, architectural, and capacity alternatives when their risk and effort differ materially.
- Include peak, redundancy, backup, and data-transfer costs where relevant.
## MUST NOT
- Optimize solely for lower cost when doing so violates reliability, security, recovery, or latency objectives.
- Recommend permanent overprovisioning without a measured headroom requirement.
## SHOULD
- Prefer changes that improve efficiency per unit of useful throughput when risk is acceptable.
## Exceptions
Temporary overprovisioning is acceptable for incidents, migrations, or seasonal peaks with an explicit expiry review.
## Verification
Review cost models, utilization, service objectives, benchmark results, scaling alternatives, and post-change spend.