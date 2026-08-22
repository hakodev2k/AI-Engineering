# Non-Functional Requirement Rules

## Purpose
Protect architecture quality by making non-functional requirements explicit, measurable, and testable.

## Scope
Covers performance, availability, reliability, scalability, security, privacy, operability, maintainability, recovery, and cost.

## MUST
- Material NFRs MUST be defined with measurable targets or bounded expectations before architecture approval.
- Availability and recovery targets MUST distinguish service availability, RTO, RPO, and degraded-mode expectations.
- Performance targets MUST specify relevant workload, percentile, throughput, or resource constraints when applicable.
- Security and privacy requirements MUST identify data sensitivity, trust boundaries, identities, and regulatory obligations.
- NFR trade-offs MUST be documented when one target degrades another, such as cost versus redundancy.

## MUST NOT
- MUST NOT use vague NFRs like “scalable,” “secure,” or “fast” as acceptance criteria.
- MUST NOT copy NFR targets from another system without workload and business justification.
- MUST NOT claim an architecture satisfies an NFR without verification evidence or a defined validation plan.

## SHOULD
- Prioritize NFRs based on business impact and failure cost.
- Revisit NFRs when scale, product criticality, or dependencies materially change.

## Exceptions
Early discovery may use ranges or hypotheses, but uncertainty MUST remain visible.

## Verification
Inspect SLOs, performance tests, threat models, recovery tests, load models, observability plans, and cost forecasts.