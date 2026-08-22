# Cost Governance Rules
## Purpose
Control cloud spend without compromising required service qualities.
## Scope
Budgets, tagging, allocation, forecasting, optimization, commitments, and resource lifecycle.
## MUST
- Material cloud designs MUST evaluate expected cost alongside reliability, security, performance, and operational trade-offs.
- Resources MUST have sufficient ownership metadata to support accountability and lifecycle decisions.
- Unexpected material spend increases MUST be investigated using usage and billing evidence.
## MUST NOT
- MUST NOT optimize cost by silently weakening required resilience, security, backup, or observability controls.
- MUST NOT purchase long-term commitments without evidence of stable demand and approved financial ownership.
## SHOULD
- Remove or schedule idle resources when risk permits.
## Exceptions
Exceptions require business rationale, duration, expected cost, and owner approval.
## Verification
Inspect budgets, billing reports, utilization, tags, commitments, anomaly alerts, and architecture cost estimates.