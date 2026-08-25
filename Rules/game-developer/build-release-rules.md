# Build and Release Rules

## Purpose
Produce reproducible, traceable game builds with controlled release risk.

## Scope
Build configuration, packaging, symbols, signing, content versions, CI/CD, rollout, and rollback.

## MUST
- Every distributable build MUST be traceable to source revision, content revision, configuration, and toolchain version.
- Release builds MUST disable or secure development-only capabilities.
- Signing credentials MUST be protected by approved secret-management mechanisms.
- Release candidates MUST pass required platform, smoke, save-compatibility, and critical-path gates.
- Production publication or irreversible rollout MUST require authorized human approval.

## MUST NOT
- MUST NOT ship unreviewed local binaries as official release artifacts.
- MUST NOT rewrite Git history or force push release history without explicit authorization.

## SHOULD
- Builds SHOULD be reproducible from clean CI environments.
- Rollout SHOULD be staged when distribution channels and risk justify it.

## Exceptions
Emergency releases require documented risk acceptance, minimum critical verification, and post-release follow-up.

## Verification
Inspect provenance metadata, CI logs, signing configuration, release checklists, artifact hashes, and rollout evidence.