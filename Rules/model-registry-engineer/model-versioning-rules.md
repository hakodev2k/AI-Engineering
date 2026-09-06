# Model Versioning Rules

## Purpose
Provide stable, unambiguous model identities across experimentation, validation, deployment, rollback, and audit.

## Scope
Model versions, aliases, semantic labels, immutable identifiers, version metadata, and compatibility boundaries.

## MUST
- Every registered model MUST receive an immutable version identifier distinct from mutable aliases such as `staging` or `production`.
- Version metadata MUST identify the exact artifact digest and producing code or pipeline revision where available.
- Breaking changes in model input, output, preprocessing, or runtime requirements MUST be represented by an explicit compatibility boundary.
- Human-readable aliases MUST resolve to one immutable version at a time and alias changes MUST be auditable.
- Version ordering semantics MUST be documented if numeric or semantic versions are used.

## MUST NOT
- A published version identifier MUST NOT be reused for different artifact content.
- Consumers MUST NOT rely on ambiguous labels such as `latest` for production deployment without resolving and recording the immutable version.
- Version metadata MUST NOT be rewritten to conceal the original provenance of a model.

## SHOULD
- Prefer monotonically understandable version schemes where they improve operations.
- Keep aliases separate from immutable version identity.

## Exceptions
Exceptions require a documented compatibility rationale, migration plan, and registry-owner approval.

## Verification
Inspect registry metadata, alias history, artifact digests, deployment manifests, and tests that resolve aliases to immutable versions.