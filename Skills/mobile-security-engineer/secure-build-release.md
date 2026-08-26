# Secure Mobile Build and Release

## Purpose
Protect signing identities, build provenance, release configuration, and production artifacts from tampering or accidental insecure settings.

## When to use
Use for CI/CD design, signing changes, store releases, build-system migration, or release incident response.

## Inputs
Build pipeline, signing configuration, branch protections, artifact flow, environment configuration, release process.

## Preconditions
Identify who and what may produce trusted release artifacts.

## Context to inspect
CI runners, signing keys/certificates, provisioning profiles, secrets, dependency resolution, build flags, artifact storage, store credentials.

## Core knowledge
Release integrity depends on protected signing material, reproducible/traceable inputs, least privilege, and separation between development and production configuration.

## Procedure
1. Map source-to-store artifact flow.
2. Restrict release permissions.
3. Protect signing keys with managed or hardware-backed controls where feasible.
4. Separate environments and credentials.
5. Pin and verify dependencies according to policy.
6. Disable debug/test capabilities in production.
7. Generate provenance/SBOM evidence where supported.
8. Scan and inspect final packaged artifacts.
9. Define signing-key compromise and rollback procedures.

## Decision points
Prefer managed signing when it improves custody and recovery. Use self-managed keys only with explicit operational ownership and backup controls.

## Common failure patterns
Shared signing credentials, production secrets on developer machines, debug builds shipped, mutable dependencies, unreviewed CI scripts, and no key-recovery plan.

## Verification
Inspect the exact store-bound artifact, signatures, entitlements, permissions, endpoints, and build metadata.

## Expected output
A traceable least-privilege release pipeline with protected signing and verified production artifacts.

## Stop conditions
Escalate on suspected signing-key compromise, unexplained artifact drift, or inability to establish release provenance.