# Cost Management Rules
## Purpose
Control AWS spend without compromising required reliability or security.
## Scope
Budgets, tagging, allocation, rightsizing, commitments, storage lifecycle, and architecture cost.
## MUST
- Establish cost ownership and allocation for material workloads.
- Measure current utilization and demand before rightsizing or purchasing commitments.
- Configure budget or anomaly signals for material spend where supported.
- Include data transfer, logging, backup, support, and idle capacity in architecture cost reviews.
## MUST NOT
- Trade away required security, durability, or recovery controls solely to reduce cost.
- Purchase long commitments from speculative demand without documented risk analysis.
## SHOULD
- Remove idle resources and apply lifecycle policies based on measured access patterns.
## Exceptions
Intentional cost inefficiency requires documented operational or business justification.
## Verification
Inspect Cost Explorer, CUR/allocation data, budgets, tags, utilization metrics, commitments, lifecycle policies, and before/after cost evidence.