# Artifact Signing Rules

## Purpose
Establish verifiable authenticity and integrity for released artifacts.

## Scope
Applies to packages, binaries, images, installers, manifests, provenance records, and release metadata.

## MUST
- High-trust release artifacts MUST be signed or otherwise cryptographically authenticated when supported by the delivery ecosystem.
- Signing identities MUST be restricted to approved release workflows and protected by least privilege.
- Verification instructions and trust roots MUST be documented for consumers or deployment systems that rely on signatures.
- Signing failures MUST fail the release when signatures are mandatory.

## MUST NOT
- MUST NOT expose private signing material to source repositories, ordinary build logs, or developer workstations unless explicitly approved by the security model.
- MUST NOT treat an artifact as trusted when required signature verification fails.

## SHOULD
- Signing SHOULD use short-lived or workload-bound identities where supported.
- Signature verification SHOULD be automated at promotion or deployment boundaries.

## Exceptions
Exceptions MUST document the unsigned scope, reason, compensating integrity controls, risk, duration, and approval.

## Verification
Inspect signing configuration, identity permissions, signature records, verification logs, and release gates. Confirm a modified artifact fails verification.