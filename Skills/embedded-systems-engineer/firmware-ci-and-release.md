# Firmware CI and Release

## Purpose
Create reproducible firmware builds and release evidence so binaries can be traced, tested, signed, and deployed safely.

## When to use
Use when establishing CI, release pipelines, multi-target builds, production artifacts, or investigating unreproducible firmware.

## Inputs
Build system, toolchain versions, dependencies, target matrix, tests, signing process, versioning policy, and deployment/update requirements.

## Context to inspect
Inspect compiler/linker flags, generated code, submodules/packages, environment dependencies, build metadata, test gates, artifact retention, signing, and release notes.

## Core knowledge
Firmware releases must bind source revision, toolchain/configuration, hardware compatibility, and binary identity. Reproducibility and provenance reduce field-debug ambiguity. Signing keys must not be exposed to ordinary build steps.

## Procedure
1. Define supported target/configuration matrix.
2. Pin toolchain and dependencies.
3. Make clean builds non-interactive and deterministic where practical.
4. Treat warnings/static analysis according to policy.
5. Run host, target, and HIL gates appropriate to risk.
6. Emit map/size/version/checksum metadata with binaries.
7. Separate signing credentials from untrusted build execution.
8. Archive immutable release artifacts and evidence.
9. Verify installation/update using the exact release artifact.

## Decision points
Use containerized/pinned environments when toolchain drift is material. Reproducible bit-identical builds are valuable but may require controlling timestamps/build IDs; at minimum guarantee traceable inputs.

## Common failure patterns
Building releases on developer machines, floating toolchains, missing map files, version strings unrelated to commits, unsigned/untracked binaries, and release tests using a different artifact.

## Verification
Rebuild from clean state, compare metadata/artifacts as policy requires, execute release gates, and install the archived binary on representative hardware.

## Expected output
A traceable firmware release containing binary, metadata, compatibility, test evidence, and controlled signing/provenance.

## Stop conditions
Stop when signing authority, target compatibility, or mandatory release gates cannot be satisfied.