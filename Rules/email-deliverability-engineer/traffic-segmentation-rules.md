# Traffic Segmentation Rules

## Purpose
Contain reputation and operational risk by separating mail streams according to purpose and behavior.

## Scope
Transactional, security, lifecycle, promotional, bulk, tenant, region, and risk-based traffic segmentation.

## MUST
- Segmentation MUST reflect materially different consent, urgency, volume, complaint, or reputation characteristics.
- Critical account and security mail MUST be protected from avoidable bulk-marketing reputation failures.
- Shared pools MUST have controls preventing one tenant or stream from consuming disproportionate reputation or capacity.
- Routing changes MUST preserve authentication alignment, suppression behavior, and observability.
- Segmentation design MUST document ownership and failure blast radius.

## MUST NOT
- MUST NOT create segmentation solely to evade receiver enforcement while keeping abusive behavior unchanged.
- MUST NOT route high-risk bulk traffic through critical transactional identities without explicit reviewed justification.
- MUST NOT make emergency routing permanent without post-incident review.

## SHOULD
- Prefer the minimum number of segments that provides meaningful isolation.
- Reassess segments as traffic characteristics evolve.

## Exceptions
Temporary cross-routing requires incident context, risk, duration, monitoring, rollback, and human approval.

## Verification
Inspect routing rules, provider pools, DNS/authentication, traffic samples, tenant distribution, and reputation metrics. Simulate failure of a high-risk stream and confirm critical traffic remains isolated where designed.