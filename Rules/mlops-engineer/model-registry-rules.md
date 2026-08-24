# Model Registry Rules

## Purpose
Govern model identity, lineage, lifecycle state, and promotion evidence so deployed artifacts are traceable and reproducible.

## Scope
Applies to trained models, adapters, serialized pipelines, and model packages managed for shared or production use.

## MUST
- Every releasable model MUST have an immutable registry version linked to source revision, training configuration, dataset/version references, runtime dependencies, evaluation results, and responsible owner.
- Promotion MUST use explicit lifecycle states and recorded acceptance evidence.
- Production deployment MUST resolve an immutable model version or digest rather than a mutable alias alone.
- Registry metadata MUST identify compatibility constraints and intended serving interface.

## MUST NOT
- Models MUST NOT be promoted solely because training completed successfully.
- A published model version MUST NOT be mutated in place; corrections require a new version.
- Untrusted or unreviewed artifacts MUST NOT share a production-approved lifecycle state.

## SHOULD
- Registry metadata SHOULD include limitations, intended use, known failure modes, and rollback predecessor.
- Aliases such as candidate or production SHOULD be implemented as auditable pointers to immutable versions.

## Exceptions
An exception requires documented context, risk, compensating traceability, verification, and approval from the accountable model/platform owner.

## Verification
Inspect registry metadata, artifact digests, lineage links, promotion records, evaluation gates, and deployment manifests. CI SHOULD reject releases missing mandatory provenance fields.