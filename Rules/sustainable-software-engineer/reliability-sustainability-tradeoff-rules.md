# Reliability and Sustainability Trade-off Rules

## Purpose
Prevent environmental optimization from degrading required reliability, recovery, or customer outcomes.

## Scope
Applies to redundancy, replication, capacity headroom, caching, retry behavior, disaster recovery, and availability architecture.

## MUST
- Sustainability changes affecting redundancy or capacity MUST be evaluated against explicit service objectives, recovery objectives, failure modes, and peak demand.
- Reliability trade-offs MUST quantify or bound the additional operational risk before approval.
- Safety-critical, security-critical, and contractual reliability requirements MUST take precedence over discretionary sustainability targets.
- Reduced redundancy or recovery capability in production MUST require explicit human approval.

## MUST NOT
- MUST NOT remove replicas, backups, failover capacity, or protective retries solely to reduce resource consumption.
- MUST NOT classify unused standby capacity as waste when it is required by an approved resilience design.
- MUST NOT hide increased incident or recovery risk behind aggregate efficiency improvements.

## SHOULD
- Prefer reducing duplicated unnecessary work before reducing justified resilience.
- Use measured failure and traffic data to revisit conservative historical headroom when appropriate.

## Exceptions
Exceptions require documented risk, business owner acceptance, recovery plan, alternatives considered, evidence, and time-bounded review.

## Verification
Inspect service objectives, recovery tests, capacity models, failure-mode analysis, architecture approvals, incident history, and pre/post-change reliability telemetry.
