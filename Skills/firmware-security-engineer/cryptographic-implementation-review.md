# Cryptographic Implementation Review

## Purpose
Review firmware cryptography for correct algorithms, parameters, APIs, randomness, key separation, nonce handling, error behavior, and platform-specific leakage risks.

## When to use
Use when adding encryption/signatures/MACs/KDFs, integrating a crypto library or accelerator, reviewing legacy crypto, or investigating interoperability/security failures.

## Inputs
Security objective, protocol, source, crypto library/version, hardware accelerator docs, key lifecycle, RNG design, test vectors, and performance constraints.

## Preconditions
Prefer established protocols and vetted libraries. Do not invent cryptographic algorithms or custom modes when a standard construction meets the requirement.

## Context to inspect
Algorithm selection, modes, parameters, key derivation, random generation, nonce/counter persistence, certificate validation, constant-time behavior, accelerator DMA, zeroization, and error handling.

## Core knowledge
Correct cryptography is protocol-dependent. AEAD needs nonce discipline; signatures need correct message/domain binding; KDFs need context separation; RNG failure can destroy otherwise strong crypto. Hardware acceleration may introduce alignment, concurrency, fault, or side-channel concerns.

## Procedure
1. State the security property and attacker model.
2. Map every cryptographic operation and key to a single purpose.
3. Replace obsolete algorithms/modes with approved alternatives where compatibility permits.
4. Validate key sizes, tags, nonces, salts, iterations, curves, and certificate constraints.
5. Trace entropy from hardware source through DRBG seeding/reseeding.
6. Prove nonce uniqueness/randomness requirements across reset and power loss.
7. Bind protocol context using associated data or domain separation.
8. Check return codes and fail closed on authentication errors.
9. Prevent secret-dependent logging and unnecessary key copies.
10. Review library configuration and hardware accelerator errata.
11. Run standard vectors plus negative/tamper tests.
12. Benchmark on target without weakening parameters solely for performance.

## Decision points
Hardware crypto can improve speed/key isolation but may have opaque side-channel properties. Software libraries may be easier to audit and update. Choose asymmetric algorithms based on ecosystem, hardware support, certificate needs, and long-term policy rather than novelty.

## Common failure patterns
AES-ECB for confidentiality; encryption without authentication; GCM nonce reuse after reset; homemade KDFs; accepting invalid certificates; ignoring verify return codes; weak fallback RNG; shared keys across protocols; truncating tags without analysis.

## Verification
Use known-answer vectors, interoperability tests, malformed/tampered inputs, reset/persistence tests for nonce state, RNG health tests, and target benchmarks. Confirm release binaries link the intended library/configuration.

## Expected output
Reviewed crypto design, corrected implementation/configuration, test evidence, dependency/version requirements, and unresolved cryptographic risks.

## Stop conditions
Escalate when requirements demand nonstandard cryptography, certified algorithms/modules are mandatory, RNG quality is unknown, or changing deployed cryptographic formats requires coordinated migration.