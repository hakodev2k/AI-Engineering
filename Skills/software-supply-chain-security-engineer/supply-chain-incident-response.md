# Software Supply Chain Incident Response

## Purpose
Contain and investigate suspected compromise of source, dependencies, build systems, signing identities, registries, or released artifacts while preserving evidence and restoring trusted delivery.

## When to use
Use for malicious packages, CI compromise, signing-key exposure, registry tampering, unauthorized releases, or credible upstream compromise.

## Inputs
Incident report, audit logs, build logs, source history, artifact digests, SBOMs, provenance, signatures, IAM events, and deployment inventory.

## Context to inspect
Establish affected trust boundary, earliest credible compromise time, identities involved, artifacts produced, downstream consumers, and available clean recovery points.

## Core knowledge
Supply-chain incidents can invalidate trust in normal build evidence. Containment may require freezing releases, revoking identities, quarantining artifacts, and rebuilding from a separately trusted environment.

## Procedure
1. Declare scope and incident authority.
2. Preserve logs, artifacts, metadata, and relevant volatile evidence.
3. Stop or isolate compromised build/release paths.
4. Revoke suspected credentials, signing identities, and tokens.
5. Identify all artifacts produced during the exposure window.
6. Determine distribution and deployment reach by digest.
7. Analyze source, dependency, builder, and registry changes.
8. Establish a clean trust root and recovery environment.
9. Rebuild/reissue affected artifacts when necessary.
10. Verify eradication, restore delivery gradually, and document control improvements.

## Decision points
Do not rebuild on infrastructure whose integrity is still uncertain. Customer notification and artifact revocation depend on confirmed or credible exposure and organizational incident policy.

## Common failure patterns
Deleting evidence during cleanup; rotating only one credential; trusting old signatures after signer compromise; focusing solely on CVEs; resuming releases before trust is re-established.

## Verification
Confirm revoked credentials fail, compromised artifacts are blocked, clean artifacts have new verified provenance, and affected deployments are remediated.

## Expected output
A contained incident, scoped artifact impact, restored trusted release path, and evidence-backed lessons learned.

## Stop conditions
Escalate immediately for active compromise, public distribution of malicious artifacts, uncertain signing-key exposure, or legal/regulatory notification triggers.