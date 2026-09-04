# Data Retention and Deletion

## Purpose
Design reliable retention and deletion behavior for AI systems so personal data does not persist indefinitely across primary stores, derived artifacts, models, logs, backups, and third parties.

## When to use
Use when defining lifecycle policies, implementing deletion requests, introducing new stores, changing backup strategy, or training models from user data.

## Inputs
- Data inventory and lineage
- Retention requirements
- Storage architecture
- Backup and disaster-recovery design
- Model-training lineage
- Third-party processor behavior

## Context to inspect
Inspect databases, object stores, feature/vector stores, caches, logs, traces, queues, snapshots, datasets, checkpoints, backups, exports, and provider retention settings.

## Core knowledge
Deletion is a distributed workflow. Senior design distinguishes active deletion, expiration, logical tombstones, immutable backups, derived data, and trained-model effects. A deletion claim must match technical reality and documented recovery behavior.

## Procedure
1. Map each data class to every storage and derived location.
2. Define retention duration and trigger for each location.
3. Implement lifecycle policies where deterministic expiration is sufficient.
4. Build deletion orchestration for user- or record-specific removal.
5. Propagate tombstones or delete events to asynchronous consumers.
6. Remove vectors, caches, derived features, and dataset records.
7. Define treatment of trained checkpoints and future retraining.
8. Document backup expiration and restoration safeguards.
9. Propagate required deletion to third parties.
10. Make deletion idempotent and retry-safe.
11. Record completion evidence without retaining unnecessary deleted content.
12. Run periodic orphan and retention audits.

## Decision points
Use cryptographic erasure where physical removal is impractical and key destruction provides the intended control. For immutable backups, define bounded expiration and prevent restored deleted records from silently re-entering production.

## Common failure patterns
- Deleting only the source database row
- Leaving embeddings or cached copies
- Restoring deleted records from backup
- Failing silently on downstream deletion errors
- Treating model unlearning as solved without evidence
- Keeping audit logs that recreate deleted personal content

## Verification
Issue test deletions and trace them through all stores and processors. Restore a backup in a controlled environment to verify tombstones or reconciliation prevent resurrection. Audit retention expirations.

## Expected output
A deletion and retention architecture with lineage, timers, propagation, retries, backup behavior, model implications, and verifiable completion evidence.

## Stop conditions
Escalate when a required store cannot delete or expire data, model-level obligations are unresolved, or third-party deletion behavior cannot be verified.