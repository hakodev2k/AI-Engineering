# CI/CD, Signing, and Release

## Purpose
Build reproducible, securely signed mobile artifacts and release them with controlled risk.

## When to use
Pipeline creation, signing changes, store releases, build reproducibility issues.

## Inputs
Build configuration, signing model, store requirements, environments, release policy.

## Context to inspect
Secrets, certificates/keys, provisioning, build variants, dependency locks, versioning, store automation.

## Core knowledge
Signing identities are high-value secrets. Release artifacts must be traceable to source, configuration, dependencies, and CI execution.

## Procedure
1. Define immutable version/build numbering.
2. Separate environment configuration from source secrets.
3. Pin toolchain/dependency versions where practical.
4. Protect signing material using CI secret/key facilities.
5. Build/test release configuration in CI.
6. Produce symbols/mapping files and retain them securely.
7. Automate store upload with least privilege.
8. Use staged rollout and rollback/kill-switch plans.
9. Record provenance for each artifact.

## Decision points
Use manual approval for high-risk production promotion while keeping artifact creation automated and repeatable.

## Common failure patterns
Developer-machine-only releases, signing keys in repo, debug/release divergence, missing symbols.

## Verification
Install exact CI artifact, verify signature/version, tests, provenance, and store metadata.

## Expected output
Reproducible auditable release pipeline.

## Stop conditions
Stop on signing uncertainty, secret exposure, or unverifiable artifact provenance.