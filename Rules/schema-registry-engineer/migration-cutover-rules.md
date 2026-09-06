# Migration and Cutover Rules

## Purpose
Move producers and consumers between schema generations without corrupting data or breaking readers.

## Scope
Dual-read, dual-write, re-encoding, topic migration, subject migration, and final cutover.

## MUST
- Migrations MUST define source and target schema versions, affected data ranges, consumers, and cutover criteria.
- Re-encoding historical data MUST preserve original meaning and provenance.
- Dual-write or dual-read strategies MUST define reconciliation and divergence handling.
- Cutover MUST include explicit validation that target consumers can process representative data.
- Destructive cleanup MUST occur only after rollback and replay requirements are satisfied.

## MUST NOT
- MUST NOT mix incompatible payloads under an ambiguous contract identity.
- MUST NOT delete migration source data before verification completes.
- MUST NOT treat successful registration as evidence that migrated payloads are semantically correct.

## SHOULD
- Use sampled reconciliation before full cutover.
- Keep migration tooling repeatable and idempotent.

## Exceptions
Emergency migration requires documented incident context, reduced scope, approval, and post-run reconciliation.

## Verification
Inspect migration manifests, reconciliation results, payload samples, replay tests, and cleanup approvals.