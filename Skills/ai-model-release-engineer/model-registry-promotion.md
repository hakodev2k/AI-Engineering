# Model Registry Promotion

## Purpose
Promote AI artifacts through controlled environments using immutable identities, explicit lifecycle states, and auditable approvals.

## When to use
Use when moving a model or adapter from development to validation, staging, canary, or production.

## Inputs
Registry artifact, provenance, evaluation evidence, release gates, environment policy, approvals, and deployment target.

## Preconditions
Registry lifecycle states and promotion permissions exist.

## Context to inspect
Inspect tags/aliases, immutable digests, metadata schemas, environment bindings, access controls, retention, and rollback artifacts.

## Core knowledge
Promotion should change an artifact's approved usage state, not rebuild it. Rebuilding between environments destroys evidence continuity. Mutable aliases are useful pointers but must resolve to immutable artifacts.

## Procedure
1. Resolve the candidate to an immutable digest/version.
2. Confirm required provenance and evaluation metadata.
3. Verify the exact artifact passed applicable gates.
4. Check environment-specific compatibility and policy.
5. Obtain required approvals.
6. Promote by changing lifecycle state or approved alias without altering artifact bytes.
7. Record actor, timestamp, evidence, and previous production version.
8. Verify deployment resolves the intended digest.
9. Preserve rollback artifacts according to retention policy.

## Decision points
Use aliases for operational convenience but audit underlying immutable versions. Require separation of duties for high-risk production promotion when policy demands it.

## Common failure patterns
Rebuilding after approval, promoting `latest`, deleting previous versions immediately, weak registry permissions, and metadata copied without verifying artifact identity.

## Verification
Fetch the production-resolved artifact identity and compare its digest with the approved candidate; verify audit records and rollback availability.

## Expected output
An auditable registry promotion linking immutable artifact, evidence, approvals, and environment state.

## Stop conditions
Stop on digest mismatch, missing approval, mutable-only identity, insufficient permissions, or absent rollback artifact.
