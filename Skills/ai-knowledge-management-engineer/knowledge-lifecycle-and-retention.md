# Knowledge Lifecycle and Retention

## Purpose
Manage creation, active use, review, supersession, archival, retention, and deletion of AI-consumable knowledge so the platform remains accurate, compliant, and operable over time.

## When to use
Use when defining retention policies, decommissioning sources, implementing deletion, handling expired content, or reducing corpus bloat.

## Inputs
Content classes, owners, retention policies, legal holds, review intervals, archival requirements, source deletion semantics, and derived artifact inventory.

## Context to inspect
Inspect source lifecycle states, index records, caches, embeddings, backups, derived summaries, graph edges, and deletion propagation mechanisms.

## Core knowledge
Lifecycle applies to derived artifacts as well as source documents. A deleted or superseded document can persist in embeddings, caches, snapshots, or generated summaries. Legal retention and operational freshness may require different handling.

## Procedure
1. Define lifecycle states and accountable owners for each content class.
2. Map retention, review, archival, and deletion rules to those states.
3. Identify all derived artifacts created from source content.
4. Implement state transitions using stable identifiers and version lineage.
5. Prevent expired or superseded content from normal retrieval unless historical intent requires it.
6. Propagate deletion through indexes, caches, graph records, and derived stores.
7. Preserve legal-hold content without exposing it outside authorized contexts.
8. Schedule review for high-impact knowledge with explicit expiry or recertification.
9. Record deletion and archival evidence without retaining prohibited content.
10. Test full lifecycle transitions end-to-end.

## Decision points
Archive rather than delete when historical reasoning or audit is required. Hard-delete only when policy permits and all dependent artifacts can be addressed safely.

## Common failure patterns
Deleting only source records, leaving embeddings behind, no owner for review, keeping expired policies searchable, and conflating legal hold with normal retrieval eligibility.

## Verification
Create test content and exercise publish, supersede, archive, delete, and hold flows. Confirm every downstream representation reaches the expected state.

## Expected output
A lifecycle policy, state model, retention matrix, deletion propagation design, and verification evidence.

## Stop conditions
Stop when retention obligations conflict, legal holds are ambiguous, or downstream stores cannot prove compliant deletion behavior.