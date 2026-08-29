# Container Base Image Rules

## Purpose
Control trust, freshness, provenance, and vulnerability exposure of container base images.

## Scope
Applies to base images, intermediate images, builder images, and runtime images used in delivery pipelines.

## MUST
- Base images MUST come from approved sources and be pinned to immutable digests or equivalent immutable identifiers for release builds.
- Base image ownership and update cadence MUST be defined.
- Runtime images MUST be scanned before release when scanning is supported.
- Base image changes MUST be reviewed for compatibility, provenance, and vulnerability impact.

## MUST NOT
- MUST NOT rely on floating tags alone for production release reproducibility.
- MUST NOT use unsupported or unmaintained base images without explicit risk acceptance.

## SHOULD
- Runtime images SHOULD minimize unnecessary packages and tooling.
- Builder and runtime stages SHOULD be separated where multi-stage builds improve attack-surface control.

## Exceptions
Exceptions MUST document the image source, reason, risk, compensating controls, owner, and approval.

## Verification
Inspect container definitions, resolved digests, image provenance, scanner results, and update records. Confirm released images map to approved immutable bases.