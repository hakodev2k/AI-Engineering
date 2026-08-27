# Key Generation Rules

## Purpose
Ensure cryptographic keys originate from trustworthy entropy and approved mechanisms.

## Scope
Generation of symmetric keys, asymmetric key pairs, seeds, nonces derived from secret material, and master secrets.

## MUST
- Generate keys using a cryptographically secure random source provided by an approved platform or cryptographic module.
- Generate keys at the required strength and within the intended trust boundary.
- Fail closed when entropy or key-generation operations fail.

## MUST NOT
- Derive production keys from timestamps, identifiers, predictable randomness, human-chosen strings, or undocumented transformations.
- Copy test keys into production.

## SHOULD
- Generate high-value keys inside hardware-backed or managed key systems when feasible.

## Exceptions
Alternative generation requires documented entropy analysis, risk review, validation evidence, and approval.

## Verification
Inspect generation APIs, module configuration, key metadata, entropy assumptions, and negative-path tests.