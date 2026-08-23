# Artifact Signing Rules

## Purpose
Provide verifiable authenticity and integrity for released software artifacts.

## Scope
Packages, binaries, containers, installers, firmware, manifests, and release metadata.

## MUST
- Release artifacts MUST be signed when the distribution channel and platform support trustworthy verification.
- Signing keys MUST be protected with access controls appropriate to release impact.
- Signature verification MUST occur before promotion or deployment of signed artifacts.
- Signing identities and algorithms MUST be documented and rotated according to defined policy.
- Compromise of a signing key MUST trigger incident response, revocation, impact analysis, and re-signing where required.

## MUST NOT
- MUST NOT store production signing keys in source repositories or ordinary CI variables.
- MUST NOT sign artifacts whose provenance or build result is unknown.
- MUST NOT bypass failed signature verification to unblock delivery.

## SHOULD
- Signing SHOULD use short-lived or keyless identities where the threat model and ecosystem support them.
- Verification policy SHOULD bind signatures to expected repository, workflow, environment, and release context.

## Exceptions
Exceptions require risk assessment, explicit approval, compensating integrity controls, and a time-bounded remediation plan.

## Verification
Inspect signatures, certificate or identity chains, key custody controls, verification logs, revocation procedures, and release pipeline policy.