# Content Refresh and Retirement

## Trigger
Freshness date reached, product/positioning changed, claim expired, performance declined, duplication detected, or stakeholder flags staleness.

## Goal
Keep the content system accurate, useful, discoverable, and maintainable while preserving valuable history and links.

## Inputs
Asset inventory, canonical relationships, source changes, analytics, search/referral data, claim ledger, redirect/link constraints.

## Stages
1. Detect and classify stale, conflicting, duplicate, low-value, or unsupported content.
2. Assess business/user impact and inbound dependencies.
3. Choose keep, refresh, consolidate, redirect, archive, or retire.
4. Verify current audience need, facts, positioning, examples, CTA, accessibility, and metadata.
5. Update canonical asset first; propagate dependent derivatives using traceability.
6. Validate links, redirects, analytics continuity, and downstream references.
7. Obtain approval for destructive retirement of high-impact/publicly relied-on content.
8. Record decision, reason, evidence, changed dependencies, and next freshness date.

## Parallelism
Performance analysis and claim freshness checks may run concurrently. Downstream derivative updates wait on canonical decisions.

## Retry and Failure
Two transient retries; unresolved ownership, legal hold, or redirect risk blocks retirement and escalates.

## Definition of Done
No known stale dependent remains untracked; canonical truth is consistent; affected links/redirects work; decision evidence and next review date exist.