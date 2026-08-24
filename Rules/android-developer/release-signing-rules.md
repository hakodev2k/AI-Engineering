# Release and Signing Rules

## Purpose
Protect production releases, signing identity, rollout safety, and recoverability.

## Scope
Applies to release builds, signing, store artifacts, rollout, versioning, and production configuration.

## MUST
- Protect signing keys and credentials using approved secret/key management with least privilege and recovery procedures.
- Build release artifacts through a controlled, reproducible CI path where practical.
- Verify versioning, package/application identity, minification rules, production endpoints, feature flags, and debug exclusions before release.
- Use staged rollout or equivalent risk controls for material changes when distribution tooling supports them.
- Require authorized human approval before production release execution.

## MUST NOT
- Commit signing secrets or production credentials to source control.
- Ship debug backdoors, test endpoints, permissive network security, or diagnostic controls unintentionally.
- Continue rollout when release-health evidence indicates material regression without explicit incident decision.

## SHOULD
- Preserve artifact provenance and release notes linking changes to the shipped version.
- Maintain rollback/mitigation procedures for server-controlled and client-only failures.

## Exceptions
Emergency releases may compress process but still require authorization, artifact verification, and post-release review.

## Verification
Inspect CI provenance, signed artifact metadata, release configuration, store track status, staged rollout metrics, and approval records.