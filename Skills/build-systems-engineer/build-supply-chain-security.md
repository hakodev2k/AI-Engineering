# Build Supply Chain Security

## Purpose
Protect build inputs, tooling, execution, and outputs from tampering while producing auditable provenance.

## When to use
Use for release hardening, dependency/toolchain onboarding, provenance requirements, or build-infrastructure threat reviews.

## Inputs
Dependency sources, toolchains, CI identities, build workers, artifact stores, signing systems, SBOM/provenance requirements, and threat model.

## Context to inspect
Inspect download integrity, mutable tags, credentials, runner trust, third-party build plugins, artifact permissions, signing boundaries, and logs.

## Core knowledge
The build pipeline is a privileged software supply-chain boundary. Integrity requires authenticated sources, immutable identities, least privilege, isolated execution, traceable provenance, and protected artifact publication.

## Procedure
1. Threat-model source-to-artifact flow.
2. Inventory third-party dependencies and executable build tools.
3. Pin versions and verify cryptographic integrity where available.
4. Restrict registries/mirrors and prevent dependency confusion.
5. Minimize CI and worker privileges.
6. Isolate untrusted build actions and pull-request contexts.
7. Protect signing keys outside ordinary build steps.
8. Generate SBOM/provenance from actual resolved inputs.
9. Make published artifacts immutable and access-controlled.
10. Exercise incident response for compromised dependency/toolchain scenarios.

## Decision points
Use isolated trusted release builders when ordinary CI accepts untrusted contributions. Prefer keyless/short-lived identities where ecosystem support and policy permit.

## Common failure patterns
Unsigned mutable downloads, secrets exposed to forks, build plugins with unrestricted execution, provenance generated from manifests rather than resolved reality, and long-lived signing credentials on general runners.

## Verification
Attempt unauthorized artifact publication; validate dependency integrity failures; inspect provenance against resolved graph; confirm secret isolation and immutable release artifacts.

## Expected output
A threat model, hardened trust boundaries, integrity controls, provenance/SBOM generation, and verification evidence.

## Stop conditions
Stop and escalate on suspected compromise, missing signing authority, unverifiable critical toolchains, or policy conflicts requiring security approval.