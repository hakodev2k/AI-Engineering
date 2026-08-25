# Key Derivation and Domain Separation

## Purpose
Derive independent cryptographic keys from shared secret material without unsafe key reuse.

## When to use
Use in protocols, envelope encryption, session establishment, multi-purpose master keys, and hierarchical key systems.

## Inputs
Source key material, entropy properties, contexts, required child keys, algorithms, and lifecycle boundaries.

## Context to inspect
Existing KDF calls, labels/info fields, salt handling, key hierarchy, versioning, and whether source material is a password or high-entropy secret.

## Core knowledge
KDFs for high-entropy keys and password hashing solve different problems. Domain separation ensures one derived key cannot be confused with another purpose, protocol, tenant, direction, or version.

## Procedure
1. Characterize source material and entropy.
2. Select an approved KDF suitable for that source.
3. Define unique labels/context for every derived purpose.
4. Bind protocol version, role, direction, tenant, or algorithm where needed.
5. Use salts according to the KDF specification.
6. Define output lengths from consuming primitives.
7. Prevent child keys from being reused across algorithms or purposes.
8. Version the derivation scheme.
9. Protect master material more strongly than derived keys.
10. Add deterministic test vectors and cross-context inequality tests.

## Decision points
Use password-specific memory-hard KDFs for human passwords; use HKDF-like standardized extract/expand designs for high-entropy key material where appropriate.

## Common failure patterns
Using a hash directly as a KDF; same key for encryption and MAC; missing labels; confusing salt with secret; deriving from low-entropy passwords with a fast KDF; changing labels incompatibly.

## Verification
Compare against known vectors, confirm every purpose has unique context, verify output lengths, and test version migration.

## Expected output
A versioned derivation tree with source assumptions, labels, algorithms, output sizes, and test vectors.

## Stop conditions
Stop if source entropy is unknown, domain labels collide, or the required derivation conflicts with an established protocol specification.