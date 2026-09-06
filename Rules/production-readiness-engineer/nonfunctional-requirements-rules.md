# Nonfunctional Requirements Rules
## Purpose
Prevent production approval based only on functional correctness.
## Scope
Availability, latency, throughput, scalability, durability, security, privacy, recoverability, operability, maintainability, and cost.
## MUST
- Material systems MUST have explicit, testable NFRs appropriate to criticality.
- NFR targets MUST state measurable thresholds, workload assumptions, and evaluation conditions.
- Readiness evidence MUST show critical NFRs are met or explicitly accepted as risk.
- Conflicting NFRs MUST be resolved through documented trade-off decisions.
- Capacity and recovery requirements MUST reflect expected production demand.
## MUST NOT
- Terms such as "fast", "scalable", "secure", or "highly available" MUST NOT be accepted as sufficient NFRs.
- Critical unmeasured NFRs MUST NOT pass without authorized exception.
## SHOULD
- Link NFRs to SLOs, architecture decisions, load tests, and recovery tests.
- Revisit NFRs when workload, data volume, tenancy, or dependencies change materially.
## Exceptions
Document deviation, evidence, impact, mitigation, risk owner, and reassessment date.
## Verification
Compare NFR definitions with benchmark, resilience, observability, and architecture evidence.