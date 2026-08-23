# Attestation and Policy Enforcement Rules

## Purpose
Turn supply-chain security claims into machine-verifiable evidence and enforceable release conditions.

## Scope
Build attestations, test evidence, scan evidence, signatures, admission policy, and release policy engines.

## MUST
- Security-critical release claims MUST be backed by verifiable attestations or equivalent evidence.
- Policy engines MUST validate artifact identity and required evidence before privileged promotion or deployment.
- Attestation issuers MUST be authenticated and authorized for the claims they produce.
- Verification policy MUST fail closed for missing or invalid mandatory evidence.
- Changes to trust roots, issuers, or enforcement policy MUST receive independent review.

## MUST NOT
- MUST NOT accept unsigned self-asserted metadata as authoritative for high-impact release decisions.
- MUST NOT allow an artifact to inherit attestations generated for a different digest.
- MUST NOT disable enforcement globally to handle a single exceptional release.

## SHOULD
- Policy SHOULD express minimum provenance, vulnerability, test, signing, and source-integrity requirements appropriate to risk.
- Evidence SHOULD be retained with release records.

## Exceptions
Exceptions require scoped policy waiver, artifact identity, rationale, compensating evidence, approver, and expiry.

## Verification
Inspect attestation subjects, issuer identities, trust configuration, policy rules, denied-release tests, waivers, and release evidence.