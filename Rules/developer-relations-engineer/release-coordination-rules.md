# Release Coordination Rules

## Purpose
Ensure developer-facing launch material is synchronized with actual product readiness, compatibility, and support status.

## Scope
Applies to launches, previews, deprecations, migrations, release notes, SDK updates, and coordinated announcements.

## MUST
- Public launch content MUST be based on an approved release state and verified supported behavior.
- Required SDK, API, documentation, sample, and migration dependencies MUST be checked before coordinated publication.
- Breaking changes and deprecations MUST describe affected users, migration path, relevant dates, and known limitations.
- Embargoed information MUST remain within authorized disclosure boundaries until release approval.

## MUST NOT
- MUST NOT announce availability before the capability is actually available to the stated audience unless clearly labeled as future or preview information.
- MUST NOT describe preview behavior as a stable compatibility guarantee.
- MUST NOT omit material migration impact to simplify launch messaging.

## SHOULD
- Launch readiness SHOULD include a developer journey test from discovery through first successful use.
- Release communication SHOULD link to canonical technical guidance.

## Exceptions
Staged rollouts may use audience-specific messaging when availability boundaries are explicit.

## Verification
Check release approvals, availability, SDK versions, documentation links, migration tests, embargo status, and end-to-end developer journey evidence.