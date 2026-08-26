# IP and Domain Warmup Rules

## Purpose
Introduce new sending capacity without creating abnormal volume or quality signals that damage reputation.

## Scope
New dedicated IPs, domains, subdomains, provider migrations, dormant identities, and major volume expansions.

## MUST
- Warmup plans MUST define baseline, recipient quality, volume progression, stop conditions, and observability.
- Initial traffic MUST prioritize recipients and message types with strong legitimate engagement and low complaint risk.
- Progression MUST be adjusted from actual receiver outcomes, not a fixed calendar alone.
- Material complaint, block, deferral, or bounce deterioration MUST pause or reduce ramp-up pending investigation.
- Provider migration MUST account for both old and new reputation surfaces.

## MUST NOT
- MUST NOT warm reputation with purchased, scraped, unconsented, or synthetic recipient traffic.
- MUST NOT abruptly send mature-stream peak volume through an unproven identity.
- MUST NOT continue a ramp solely to meet a launch date when safety thresholds are breached.

## SHOULD
- Segment ramp by major mailbox provider where behavior differs.
- Preserve enough old capacity for safe rollback during migration.

## Exceptions
Accelerated warmup requires documented evidence, capacity need, risk, rollback, monitoring, and human approval.

## Verification
Compare planned versus actual volume, recipient cohorts, complaint/bounce/deferral rates, inbox placement, and provider reputation signals at each stage.