# Privacy and Deletion

## Purpose
Ensure derived vectors and retrieval artifacts respect data minimization, retention, and deletion obligations.

## Scope
Applies to embeddings, metadata, caches, replicas, snapshots, backups, logs, and derived indexes containing personal or sensitive data.

## MUST
- Data classification MUST determine whether source content, metadata, or embeddings require privacy controls.
- Deletion workflows MUST identify and remove or expire all searchable derived artifacts within approved timelines.
- Retention periods MUST be explicit for vectors, metadata, logs, snapshots, and backups.
- Data lineage MUST support locating derived records associated with a source subject or object when deletion obligations apply.
- Access to sensitive retrieval data MUST be minimized and auditable.

## MUST NOT
- MUST NOT assume embeddings are inherently anonymous or non-sensitive.
- MUST NOT retain source text in metadata merely for convenience when it violates minimization requirements.
- MUST NOT claim deletion complete while searchable replicas or caches remain outside the approved window.

## SHOULD
- Systems SHOULD store only metadata needed for retrieval and operations.
- Privacy-sensitive datasets SHOULD use documented purpose and access boundaries.
- Deletion propagation SHOULD be continuously tested.

## Exceptions
Exceptions require privacy/security review, legal or policy basis where applicable, documented risk, retention rationale, and approval.

## Verification
Inspect lineage, retention configuration, deletion integration tests, cache behavior, backup policy, access logs, and periodic deletion audits.