# Retention and Lifecycle

## Purpose
Preserve required recovery history while controlling cost and legal exposure.

## Scope
Backup retention, expiration, archival, legal holds, and media lifecycle.

## MUST
- Retention MUST satisfy approved recovery, regulatory, contractual, and legal-hold requirements.
- Expiration behavior MUST be understood and tested before policy activation.
- Retention changes MUST account for existing restore points and grandfathering behavior.
- Disposal of expired backup media MUST preserve confidentiality.

## MUST NOT
- MUST NOT delete protected restore points subject to active hold or approved retention requirements.
- MUST NOT extend retention indefinitely without ownership and cost justification.
- MUST NOT assume application deletion policies apply identically to backup copies.

## SHOULD
- Lifecycle tiers SHOULD balance retrieval time, durability, and cost against recovery objectives.
- Retention SHOULD be reviewed when data classification or business requirements change.

## Exceptions
Exceptions require documented requirement, affected datasets, duration, risk/cost impact, and approval.

## Verification
Inspect retention configuration, hold records, expiration reports, media-destruction evidence, restore-point age distribution, and policy-change history.