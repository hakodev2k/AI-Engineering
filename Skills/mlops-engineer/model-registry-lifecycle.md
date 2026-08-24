# Model Registry Lifecycle

## Purpose
Manage model versions as immutable, governed artifacts with clear stage transitions, provenance, approvals, compatibility, and retirement.

## When to use
Use when models progress through development, validation, staging, production, rollback, or deprecation.

## Inputs
Model artifacts, metadata, evaluation evidence, signatures, dependencies, owners, deployment targets, approval policy.

## Preconditions
Artifacts are immutable and uniquely identifiable.

## Context to inspect
Registry capabilities, deployment tooling, artifact store, access controls, environment promotion rules, and existing stage conventions.

## Core knowledge
A registry is a lifecycle control point, not just file storage. Promotion should reference immutable versions and attach evidence sufficient for deployment and audit.

## Procedure
1. Define required model metadata and signature.
2. Register immutable artifact digests.
3. Link source code, data, experiment, and evaluation evidence.
4. Define stage-transition criteria.
5. Enforce approvals where risk requires them.
6. Record compatibility constraints.
7. Integrate deployment by immutable version, never mutable alias alone.
8. Define rollback candidates and retention.
9. Deprecate and archive obsolete versions.
10. Audit transition history periodically.

## Decision points
Automatic vs manual promotion; environment-specific aliases vs explicit versions; retention by age, deployments, or regulatory need.

## Common failure patterns
Mutable artifacts, undocumented manual uploads, production deployment from local files, stage aliases without audit history, and deleted rollback candidates.

## Verification
For a deployed model, resolve artifact digest, evidence, approvals, source, data lineage, and previous recoverable version.

## Expected output
Registry schema, transition policy, ownership model, retention policy, and audit evidence.

## Stop conditions
Escalate when artifact integrity cannot be verified, mandatory evidence is missing, or promotion authority is ambiguous.