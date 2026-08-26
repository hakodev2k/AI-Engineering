# Code Signing Rules

## Purpose
Preserve provenance and integrity of signed software artifacts.

## Scope
Code-signing certificates, signing services, release identities, timestamping, and verification.

## MUST
- Signing keys MUST be isolated from ordinary developer workstations and protected according to release impact.
- Signing authorization MUST bind an approved artifact or release workflow to an attributable identity.
- Signed artifacts MUST be verified after signing and before distribution.
- Compromise response MUST define certificate revocation, artifact impact analysis, and re-signing strategy.

## MUST NOT
- MUST NOT make production signing keys broadly exportable.
- MUST NOT sign unreviewed arbitrary binaries merely because a requester has repository access.
- MUST NOT treat a valid signature as proof that software is safe.

## SHOULD
- Signing SHOULD occur in hardened, reproducible automation with immutable audit evidence.

## Exceptions
Manual signing requires documented reason, controlled environment, dual review where warranted, and retained evidence.

## Verification
Inspect key custody, signing logs, artifact digests, release approvals, timestamping, and signature validation.