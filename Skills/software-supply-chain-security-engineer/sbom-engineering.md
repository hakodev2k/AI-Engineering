# SBOM Engineering

## Purpose
Produce accurate, useful Software Bills of Materials that support vulnerability response, provenance analysis, compliance, and incident investigation.

## When to use
Use when establishing SBOM generation, improving component inventory, supporting customer assurance, or investigating affected software.

## Inputs
Build definitions, package manifests, lockfiles, container images, compiled artifacts, package metadata, and required SBOM formats.

## Context to inspect
Determine whether software is interpreted, compiled, vendored, containerized, statically linked, generated, or assembled from multiple build stages.

## Core knowledge
An SBOM is evidence about a specific artifact, not a generic repository dependency list. Useful records require stable component identifiers, versions, relationships, hashes where appropriate, and artifact association. SPDX and CycloneDX are common formats.

## Procedure
1. Define the artifact and lifecycle point represented.
2. Generate SBOMs as close to the authoritative build as practical.
3. Capture direct, transitive, vendored, and embedded components where tooling supports them.
4. Normalize identifiers and versions.
5. Record dependency relationships and artifact identity.
6. Validate output against manifests and artifact inspection.
7. Attach or publish SBOMs with immutable artifact references.
8. Protect SBOM integrity and access according to sensitivity.
9. Feed SBOM data into vulnerability and incident workflows.
10. Version generation tooling and test it on representative builds.

## Decision points
Prefer build-time generation when it reflects resolved content; supplement with binary/image analysis when packaging can introduce additional components. Do not expose sensitive internal component metadata publicly without policy review.

## Common failure patterns
Generating only from source manifests; losing artifact-to-SBOM linkage; omitting transitive dependencies; treating scanner output as authoritative without validation; publishing stale SBOMs.

## Verification
Compare sampled SBOM entries with resolved dependency graphs and artifact contents. Confirm consumers can locate the exact SBOM for a deployed artifact.

## Expected output
A validated, artifact-bound SBOM with documented generation and distribution process.

## Stop conditions
Escalate when artifact contents cannot be reproduced, required metadata conflicts across tools, or disclosure requirements conflict with security policy.