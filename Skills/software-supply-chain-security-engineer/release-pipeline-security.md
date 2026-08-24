# Release Pipeline Security

## Purpose
Design release workflows so only reviewed source, trusted builders, authorized identities, and verified artifacts can reach production distribution channels.

## When to use
Use when creating or auditing release automation, adding environments, or changing promotion mechanisms.

## Inputs
Release workflow, branch/tag rules, environment protections, artifact registry, signing/provenance controls, identities, and rollback process.

## Context to inspect
Trace release authorization, source selection, build invocation, artifact identity, approvals, signing, registry publication, promotion, and rollback.

## Core knowledge
A secure release separates code contribution from release authority and preserves immutable artifact identity across environments. Rebuilding during promotion creates a new artifact and breaks assurance continuity.

## Procedure
1. Define authoritative release source and trigger.
2. Require protected source state and required checks.
3. Build in a trusted isolated environment.
4. Generate SBOM, provenance, and signatures for final artifacts.
5. Store artifacts immutably.
6. Separate build and production deployment permissions.
7. Promote the same digest through environments.
8. Require risk-appropriate production authorization.
9. Enforce verification at deployment/distribution.
10. Test rollback using previously verified artifacts.

## Decision points
Manual approval can be useful for high-impact releases but should not compensate for weak technical integrity. Progressive delivery reduces operational risk but must preserve artifact identity.

## Common failure patterns
Rebuilding per environment; production credentials in build jobs; mutable release tags; unsigned emergency releases; approval after an artifact can still be changed.

## Verification
Trace a sample release from source commit to deployed digest and verify every policy gate and identity. Negative tests should reject unauthorized releases.

## Expected output
An auditable release chain with immutable promotion and enforced verification.

## Stop conditions
Escalate if artifact identity changes during promotion, production release can bypass verification, or release credentials are exposed to untrusted code.