# Cryptographic Testing and Test Vectors

## Purpose
Build evidence that cryptographic implementations conform to specifications and reject invalid or adversarial inputs.

## When to use
Use for new crypto integrations, migrations, protocol implementations, cross-language systems, and regression suites.

## Inputs
Specification, implementation, supported algorithms, serialization formats, official vectors, and interoperability peers.

## Context to inspect
Unit/integration tests, vector sources, boundary values, parser behavior, malformed-input handling, version compatibility, and randomized test infrastructure.

## Core knowledge
A passing encrypt/decrypt round trip can preserve the same bug on both sides. Independent known-answer vectors, negative tests, interoperability, and invariant/property tests provide stronger evidence.

## Procedure
1. Identify authoritative vectors for each primitive/protocol.
2. Add known-answer tests independent of local generation.
3. Test boundary sizes and parameter limits.
4. Mutate ciphertexts, tags, signatures, certificates, and encodings.
5. Test wrong keys, nonces, contexts, identities, and versions.
6. Verify malformed input fails safely without partial trust.
7. Add cross-implementation interoperability tests.
8. Add property/fuzz tests to parsers and state machines where appropriate.
9. Preserve regression cases for every security defect.
10. Run tests across supported architectures/library versions.

## Decision points
Use fuzzing for complex parsers/state machines; use formal conformance suites when standards provide them. Do not rely on randomized tests alone for deterministic edge cases.

## Common failure patterns
Only round-trip tests; self-generated vectors; no negative tests; accepting malformed encodings; tests that ignore authentication failure; platform-specific assumptions.

## Verification
Ensure vectors come from independent authoritative sources, negative cases fail for the expected reason, and CI exercises supported implementations.

## Expected output
A layered cryptographic test suite with known-answer, negative, boundary, interoperability, and regression coverage.

## Stop conditions
Stop release if authoritative conformance cannot be established for security-critical behavior or peers disagree on canonical protocol behavior.