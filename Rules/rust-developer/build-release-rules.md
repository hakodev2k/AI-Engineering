# Build and Release

## Purpose
Make Rust builds reproducible, auditable, compatible, and safe to release.

## Scope
Cargo profiles, toolchains, targets, artifacts, CI builds, versioning, and publishing.

## MUST
- Supported Rust toolchain policy and target matrix MUST be explicit.
- Release artifacts MUST be built from reviewed source using reproducible, controlled CI inputs where practical.
- Release profile changes affecting panic behavior, LTO, overflow, symbols, or optimization MUST be reviewed for operational impact.
- Published crate versions MUST follow the project's compatibility policy.

## MUST NOT
- MUST NOT publish or deploy artifacts whose source revision cannot be identified.
- MUST NOT bypass required tests or security gates without explicit human approval.
- MUST NOT overwrite immutable released artifacts.

## SHOULD
- Pin CI toolchain versions and record artifact provenance/checksums.
- Test minimum supported Rust version when the project promises one.

## Exceptions
Emergency releases require documented approval, skipped checks, risk, and follow-up validation.

## Verification
Inspect CI provenance, toolchain versions, checksums, release diffs, target builds, semver checks, and deployment records.