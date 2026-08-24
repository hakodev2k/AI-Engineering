# Provenance and Attestations

## Purpose
Create and verify machine-readable evidence describing how, where, and by whom software artifacts were produced.

## When to use
Use when strengthening release integrity, implementing SLSA-aligned controls, proving builder identity, or enforcing deployment policy.

## Inputs
Build platform, artifact digests, source revisions, builder identities, workflow definitions, signing mechanism, and policy requirements.

## Context to inspect
Identify authoritative source revision, build entry point, parameterization, dependencies, builder isolation, attestation storage, and verification boundary.

## Core knowledge
Provenance should bind immutable artifact identity to source and build context. Attestations are claims; their value depends on trustworthy generation, authenticated identity, integrity protection, and independent verification.

## Procedure
1. Define the security questions provenance must answer.
2. Capture immutable source revision and repository identity.
3. Capture builder/workflow identity and relevant build parameters.
4. Bind the statement to final artifact digest.
5. Generate provenance inside the trusted build boundary.
6. Sign or otherwise authenticate the attestation.
7. Store it durably with artifact discoverability.
8. Define verification policy for source, builder, branch/tag, and workflow.
9. Enforce policy before promotion or deployment.
10. Test forged, stale, mismatched, and missing attestations.

## Decision points
Collect only fields that support security or compliance decisions; avoid leaking secrets or sensitive build arguments. Increase provenance rigor with artifact criticality.

## Common failure patterns
Self-reported provenance generated after the build; binding to tags instead of digests; trusting any signer; failing to enforce attestations; including secrets in metadata.

## Verification
Rebuild or inspect sample artifacts and confirm provenance matches source, builder, and digest. Negative tests must be rejected.

## Expected output
Authenticated provenance integrated with release and deployment policy.

## Stop conditions
Escalate when the build platform cannot provide trustworthy identity, final artifact digest changes after attestation, or policy bypass is uncontrolled.