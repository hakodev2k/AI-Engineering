# Artifact and Supply Chain Security

## Purpose
Protect build inputs, dependencies, artifacts, and delivery provenance from tampering.

## When to use
Use when designing or reviewing shared build and release infrastructure.

## Inputs
Dependency sources, build pipelines, registries, signing systems, SBOM requirements, and threat model.

## Context to inspect
Runner trust, package feeds, lockfiles, artifact permissions, provenance, signing, scanning, and promotion flow.

## Core knowledge
Trust should be established from source through deployed artifact. Immutable artifacts, constrained identities, provenance, and verifiable metadata reduce supply-chain risk.

## Procedure
1. Map artifact flow and trust boundaries.
2. Pin and verify dependencies where practical.
3. Isolate and harden build execution.
4. Generate SBOM and provenance metadata.
5. Scan dependencies and artifacts by risk policy.
6. Sign or attest release artifacts.
7. Restrict registry mutation and promotion.
8. Verify provenance before deployment.
9. Define response for compromised dependencies.

## Decision points
Use blocking controls for high-confidence critical risks; avoid noisy gates that teams learn to bypass.

## Common failure patterns
Mutable artifacts, shared admin credentials, untrusted pull-request secrets, unsigned releases, and scanners without ownership.

## Verification
Trace a deployed artifact to source and build identity; confirm tampered or unauthorized artifacts are rejected.

## Expected output
A controlled software supply chain with provenance, policy, verification, and incident procedures.

## Stop conditions
Escalate evidence of compromise or inability to establish artifact origin.