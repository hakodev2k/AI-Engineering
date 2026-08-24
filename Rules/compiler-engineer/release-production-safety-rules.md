# Release and Production Safety Rules

## Purpose
Prevent compiler releases from distributing known correctness, security, or compatibility hazards.

## Scope
Release qualification, rollout, rollback, production toolchains, and high-risk changes.

## MUST
- Release candidates MUST pass correctness, conformance, security, target, and performance gates defined for supported configurations.
- Known miscompilations MUST be severity-assessed before release.
- Rollback or replacement strategy MUST exist for release-critical regressions.
- Production deployment, signing changes, security-control weakening, and breaking compatibility changes MUST require authorized human approval.

## MUST NOT
- MUST NOT promote a compiler with unexplained correctness failures in supported configurations.
- MUST NOT conceal known regressions by disabling tests without documented disposition.
- MUST NOT let an automated agent exceed its authority to publish or alter production toolchains.

## SHOULD
- High-risk releases SHOULD use staged rollout and telemetry where ecosystem constraints permit.
- Release notes SHOULD identify material compatibility changes.

## Exceptions
Gate waivers require evidence, risk owner, mitigation, expiry, and approval.

## Verification
Inspect release-gate evidence, signatures, test matrices, benchmark deltas, known-issue disposition, and rollback rehearsal.