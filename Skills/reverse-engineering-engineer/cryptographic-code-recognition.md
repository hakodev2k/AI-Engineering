# Cryptographic Code Recognition

## Purpose
Recognize cryptographic primitives, key material flows, hashing, encoding, and authenticated-encryption usage without confusing cryptography with ordinary transforms.

## When to use
Use when binaries process opaque buffers, credentials, signatures, encrypted configuration, or integrity checks.

## Inputs
Disassembly/decompilation, constants, API imports, data-flow traces, known test vectors when legitimate.

## Preconditions
The goal is semantic identification and implementation review, not unauthorized recovery of protected secrets.

## Context to inspect
Crypto-library calls, algorithm constants, block sizes, round structures, key schedules, IV/nonces, tags, hashes, KDFs, random sources, encodings, and error handling.

## Core knowledge
Standard library APIs are stronger evidence than visual instruction patterns. Optimized implementations may use SIMD or hardware instructions. Compression, checksums, XOR transforms, and encodings are often mistaken for encryption.

## Procedure
1. Inventory known cryptographic APIs and hardware instructions.
2. Trace buffers, sizes, keys, IV/nonces, and tags through call sites.
3. Match constants and round structures only when APIs are absent.
4. Distinguish hash, MAC, encryption, signature, KDF, RNG, and encoding roles.
5. Identify mode and parameter handling where evidence supports it.
6. Check nonce uniqueness, authentication checks, key lifecycle, and error paths.
7. Validate candidate primitives with public test vectors or controlled inputs when appropriate.
8. Report semantics without exposing sensitive key material.

## Decision points
Prefer named library semantics over hand-pattern matching. Treat custom cryptography cautiously and avoid claiming an exact primitive until multiple indicators agree.

## Common failure patterns
Calling XOR encryption; confusing checksum with hash; logging keys; missing authentication-tag verification; inferring algorithm from key length alone.

## Verification
Known test vectors, library contracts, constants, and runtime input/output relationships should agree with the identification.

## Expected output
A documented cryptographic data-flow map, primitive/mode identification, parameter handling, and implementation risks.

## Stop conditions
Stop if analysis would require unauthorized secret extraction or circumvention of access controls.