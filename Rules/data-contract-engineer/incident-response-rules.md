# Incident Response Rules

## Purpose
Provide disciplined response when a data contract causes incorrect, unavailable, stale, or incompatible data.

## Scope
Applies to production incidents involving contract violations, semantic defects, consumer breakage, quality breaches, and failed migrations.

## MUST
- Incident response MUST identify affected contracts, versions, producers, known consumers, and time range as evidence becomes available.
- Containment decisions MUST prioritize preventing further incorrect data propagation when that risk exceeds temporary unavailability.
- Corrections or backfills MUST preserve auditability and be validated before affected data is declared repaired.
- Significant incidents MUST produce a root-cause or bounded-cause analysis and prevention actions.

## MUST NOT
- Teams MUST NOT declare resolution solely because a pipeline is running again.
- Incorrect historical data MUST NOT be silently overwritten without assessing downstream effects.
- Contract guarantees MUST NOT be weakened during an incident without explicit approval.

## SHOULD
- Incident communication SHOULD distinguish confirmed facts, hypotheses, and unknowns.
- Recovery SHOULD include consumer-specific validation for critical use cases.

## Exceptions
Emergency actions require incident authority, documented rationale, bounded scope, and retrospective review.

## Verification
Inspect incident timelines, validation evidence, lineage, repaired datasets, consumer confirmations, and follow-up actions.