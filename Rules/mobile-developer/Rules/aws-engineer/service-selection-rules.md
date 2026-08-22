# AWS Service Selection Rules
## Purpose
Choose AWS services from requirements and trade-offs rather than novelty or habit.
## Scope
Managed services, compute, storage, databases, integration, analytics, and platform capabilities.
## MUST
- Derive service choice from functional needs, NFRs, data model, failure modes, team capability, cost, and exit constraints.
- Document material trade-offs for decisions that create long-term coupling or migration cost.
- Validate service limits, regional availability, security controls, and operational model before adoption.
## MUST NOT
- Select a service solely because it is newer, managed, or already familiar.
- Introduce multiple overlapping services without clear ownership and differentiated need.
## SHOULD
- Prefer the simplest service that satisfies verified requirements and operational constraints.
## Exceptions
Strategic experiments require bounded scope, success criteria, cost limit, and exit plan.
## Verification
Review architecture decisions, requirements traceability, service quotas, cost estimates, proof-of-concept evidence, and operational readiness.