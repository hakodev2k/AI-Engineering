# Release Signing and Play Distribution

## Purpose
Prepare Android releases with controlled signing, reproducible artifacts, safe configuration, staged rollout, and rollback-aware distribution practices.

## When to use
Use for release pipeline design, signing changes, Play Console rollout, build-variant review, or release incident prevention.

## Inputs
Release process, signing ownership, build variants, versioning, CI pipeline, Play configuration, rollout policy, compliance requirements.

## Preconditions
Confirm authorized ownership of signing material and never expose private keys or credentials in source or logs.

## Context to inspect
Gradle signing config, versionCode/versionName policy, app bundles, ProGuard/R8 mapping, native symbols, CI secrets, Play App Signing, tracks, feature flags, and release notes.

## Core knowledge
Android identity depends on signing continuity. Release artifacts must be traceable to source and configuration. Staged rollout reduces blast radius but does not replace pre-release validation.

## Procedure
1. Identify signing ownership and recovery process.
2. Keep signing credentials in approved secret storage.
3. Ensure release builds disable debug/test-only behavior.
4. Define monotonically valid versioning.
5. Build the release artifact from a clean, controlled environment.
6. Preserve mapping files and native debug symbols for crash diagnosis.
7. Run unit, integration, UI, security, and smoke gates appropriate to risk.
8. Verify package ID, manifest, permissions, endpoints, and feature flags.
9. Release through an appropriate test/staged track and monitor health metrics.
10. Pause or halt rollout when predefined regression thresholds are exceeded.

## Decision points
Use staged rollout for meaningful risk reduction; choose rollout size based on user impact and observability quality. Rotate operational credentials without breaking app signing identity.

## Common failure patterns
Keys committed to repositories, debug endpoints in release, lost mapping files, untested minification, accidental permission changes, version collisions, and full rollout without health monitoring.

## Verification
Install the exact signed artifact, run release smoke tests, verify signature/package/version, inspect Play pre-launch findings, and confirm crash/performance telemetry after rollout.

## Expected output
Traceable signed artifact, release checklist evidence, rollout plan, and preserved diagnostics.

## Stop conditions
Escalate when signing ownership is uncertain, artifacts cannot be reproduced, critical release tests fail, or rollout telemetry indicates material regression.