# CI/CD, Code Signing, and Provisioning

## Purpose
Build reliable iOS delivery pipelines that manage signing identities, provisioning, entitlements, tests, archives, and artifacts without manual secrets sprawl.

## When to use
Use for CI setup, signing failures, new capabilities/targets, release automation, or certificate/profile rotation.

## Inputs
Bundle IDs, team/account model, entitlements, distribution channels, CI provider, secret-management policy.

## Context to inspect
Signing settings, certificates/profiles, App Store Connect integration, export options, keychain setup, pipeline scripts, artifact retention.

## Core knowledge
Signing binds identity, entitlements, bundle ID, and provisioning. CI should generate reproducible archives and keep private keys/tokens in approved secret stores with least privilege.

## Procedure
1. Inventory targets, bundle IDs, capabilities, and distribution types.
2. Choose automatic or managed manual signing consistently.
3. Store credentials in CI secret facilities; never repository files.
4. Pin Xcode/toolchain where reproducibility matters.
5. Separate build/test/archive/export stages.
6. Validate entitlements in produced archive.
7. Preserve dSYMs and release metadata.
8. Automate credential rotation with documented ownership.
9. Test clean runner execution and release candidate installation.

## Decision points
Automatic signing reduces profile maintenance; explicit managed signing can improve deterministic enterprise pipelines. Choose based on account/control constraints.

## Common failure patterns
Personal certificates in CI, wildcard entitlement mismatch, missing dSYMs, unpinned Xcode, and secrets printed to logs.

## Verification
Clean CI run produces installable correctly signed artifact; entitlements and symbols match the release build.

## Expected output
Reproducible signed pipeline with secure credential handling and retained diagnostics.

## Stop conditions
Stop when account permissions, distribution ownership, or required credentials are unavailable.