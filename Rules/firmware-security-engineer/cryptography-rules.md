# Cryptography Rules

## Purpose
Ensure firmware uses cryptography with correct algorithms, parameters, lifecycle controls, and failure handling.

## Scope
Applies to encryption, signatures, MACs, hashes, random generation, key derivation, certificates, and protocol cryptography.

## MUST
- Use reviewed cryptographic primitives and protocols suitable for the platform threat model and required security lifetime.
- Obtain security-sensitive randomness from an approved entropy source and handle initialization failures explicitly.
- Define key purpose, lifetime, storage, rotation or replacement strategy, and compromise response.
- Authenticate data whose integrity or origin is security-critical.

## MUST NOT
- Design custom cryptographic algorithms or ad-hoc protocol constructions without specialized review.
- Hard-code production secrets or use predictable nonces, IVs, challenges, or keys where unpredictability or uniqueness is required.
- Treat encryption alone as proof of authenticity.

## SHOULD
- Centralize cryptographic operations behind a small auditable interface.
- Prefer hardware-backed protection when it materially reduces extraction risk.

## Exceptions
Deviations require documented compatibility need, cryptographic review, residual risk, compensating controls, and explicit approval.

## Verification
Use static review, known-answer tests, negative tests, entropy and nonce checks, key-storage inspection, protocol interoperability tests, and security review.