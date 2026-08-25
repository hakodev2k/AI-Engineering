# Cryptography Rules

## Purpose
Ensure cryptography protects defined security properties without introducing avoidable design or implementation weaknesses.

## Scope
Applies to encryption, hashing, signatures, MACs, password storage, randomness, certificates, and cryptographic protocols.

## MUST
- Cryptographic requirements MUST state the property being protected: confidentiality, integrity, authenticity, non-repudiation where applicable, or password resistance.
- Implementations MUST use maintained platform or well-reviewed cryptographic libraries and approved algorithms/modes.
- Passwords MUST be stored using a password-specific adaptive hashing construction with appropriate parameters and salts.
- Random values used for credentials, keys, nonces, or security tokens MUST come from a cryptographically secure source.
- Key lifecycle, purpose, ownership, storage, rotation, and compromise response MUST be defined for material keys.
- Encryption designs MUST account for integrity/authentication, not confidentiality alone, where tampering is a threat.

## MUST NOT
- MUST NOT design custom cryptographic algorithms or protocols without specialist review and a compelling requirement.
- MUST NOT use obsolete hashes or ciphers for security-sensitive purposes merely for compatibility.
- MUST NOT hard-code keys or reuse nonces/IVs in ways prohibited by the selected construction.

## SHOULD
- SHOULD use high-level authenticated-encryption and protocol APIs that minimize misuse.
- SHOULD plan algorithm agility when data or systems have long lifetimes.

## Exceptions
Compatibility exceptions require documented interoperability constraints, risk, compensating controls, migration plan, and security approval.

## Verification
Review library/API choices, parameters, key handling, test vectors where appropriate, dependency versions, configuration, and negative tests. Specialist review is required for novel protocol composition.