# Model Registry

## Purpose
Make model identity, lifecycle, provenance, and promotion states authoritative and auditable.

## Scope
Registered models, versions, aliases, metadata, approvals, and lifecycle transitions.

## MUST
- Registered versions MUST be immutable and uniquely identify their artifact and provenance.
- Production aliases or stages MUST change through an auditable promotion mechanism.
- Registry metadata MUST include ownership, lineage, evaluation evidence, and compatibility information required for deployment.

## MUST NOT
- Model binaries MUST NOT be silently replaced under an existing immutable version.
- Production promotion MUST NOT depend solely on a human-readable model name.

## SHOULD
- Registry lifecycle policy SHOULD cover deprecation, retention, rollback, and orphan cleanup.

## Exceptions
Emergency promotion requires explicit approval, recorded justification, and post-event verification.

## Verification
Inspect artifact digests, registry audit history, promotion controls, lineage links, permissions, and rollback tests.