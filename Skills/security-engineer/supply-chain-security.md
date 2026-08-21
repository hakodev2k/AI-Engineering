# Software Supply Chain Security

## Purpose
Reduce risk from compromised dependencies, build systems, package registries, artifacts, and release pipelines.

## When to use
Use when reviewing CI/CD, dependency trust, package provenance, artifact signing, or responding to supply-chain incidents.

## Inputs
Dependency manifests, lockfiles, build pipeline, package sources, artifact registry, signing/provenance setup, release process, third-party tooling.

## Context to inspect
Dependency sources, transitive packages, CI credentials, runner trust, artifact promotion, checksums/signatures, SBOMs, branch protections, release permissions, and build reproducibility.

## Core knowledge
Supply-chain security protects the path from source to running artifact. Strong controls include trusted sources, pinned/reviewed dependencies, isolated builds, least-privilege CI identities, artifact integrity, provenance, and controlled promotion.

## Procedure
1. Inventory package ecosystems, registries, build tools, and artifact stores.
2. Restrict dependency sources to approved registries where practical.
3. Pin or lock dependencies and review unexpected graph changes.
4. Scan dependencies and build images for known risks.
5. Protect CI credentials and minimize runner privileges.
6. Separate build, signing, and deployment permissions.
7. Generate traceable build metadata, SBOM, and provenance where supported.
8. Sign or otherwise verify critical artifacts before deployment.
9. Promote immutable artifacts across environments instead of rebuilding.
10. Test revocation and replacement procedures for compromised dependencies or artifacts.

## Decision points
Use stronger signing/provenance controls for high-value or externally distributed artifacts. Balance automatic upgrades with compatibility and change-review requirements.

## Common failure patterns
Unpinned dependencies, arbitrary public registries, privileged shared runners, mutable release artifacts, secrets available to untrusted builds, and rebuilding separately for production.

## Verification
A deployed artifact can be traced back to approved source and build evidence, dependency changes are auditable, and unauthorized artifacts fail promotion or verification.

## Expected output
A controlled software supply chain with trusted inputs, protected builds, immutable artifacts, integrity evidence, and compromise-response procedures.

## Stop conditions
Escalate when build infrastructure is suspected compromised, signing keys may be exposed, or remediation would invalidate currently deployed critical artifacts.