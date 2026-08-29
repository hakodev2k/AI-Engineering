# Secure Software Supply Chain

## Purpose
Design controls that preserve source, build, dependency, artifact, and deployment integrity from development through production.

## When to use
Use for CI/CD platforms, dependency governance, artifact repositories, release engineering, and high-assurance software delivery.

## Inputs
Source control model, build pipeline, dependency ecosystem, artifact stores, deployment process, signing capabilities, developer access model.

## Preconditions
The software delivery path and responsible platform owners are known.

## Context to inspect
Branch protection, build runners, package registries, lockfiles, provenance, artifact signing, CI secrets, deployment identities, environment approvals, and dependency scanners.

## Core knowledge
Supply-chain security reduces opportunities to introduce unauthorized code or artifacts and improves traceability. Strong controls combine least privilege, reproducible or attestable builds, dependency governance, provenance, and protected release paths.

## Procedure
1. Map the source-to-production chain and trust boundaries.
2. Protect source changes with review and branch controls.
3. Isolate build workers and minimize their credentials.
4. Pin and verify dependencies where practical.
5. Generate provenance and software inventory metadata.
6. Protect artifact repositories against replacement or confusion.
7. Sign or attest release artifacts where assurance warrants it.
8. Restrict deployment identities and environments.
9. Define vulnerability and dependency exception workflows.
10. Test rollback, revocation, and compromised-component response.

## Decision points
Use stronger signing and provenance controls for high-impact artifacts. Prefer hermetic or isolated builds when tamper resistance outweighs implementation cost.

## Common failure patterns
Mutable artifacts, broad CI credentials, unreviewed dependency changes, untrusted build runners, reusable production credentials, and no provenance.

## Verification
Trace a release from source commit to deployed artifact and confirm review, build identity, dependency metadata, provenance, and deployment authorization.

## Expected output
A software supply-chain architecture with trusted stages, integrity controls, ownership, and incident response hooks.

## Stop conditions
Stop when the release path cannot identify artifact origin, build infrastructure is unowned, or required integrity controls conflict with unsupported legacy tooling.