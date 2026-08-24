# Data Encoding and ABI

## Purpose
Prevent ambiguity and incompatibility at binary, ABI, event, and message boundaries.

## Scope
ABI encoding, serialization, selectors, event topics, typed messages, proofs, and cross-system payloads.

## MUST
- Define canonical types, field order, units, byte order, and versioning for externally consumed payloads.
- Validate decoded lengths, ranges, discriminators, and expected schema before use.
- Preserve compatibility for public interfaces or introduce an explicit version/migration path.
- Test encoding across independent producer/consumer implementations when interoperability matters.
- Treat event schemas used by integrations as public contracts.

## MUST NOT
- Concatenate variable-length fields ambiguously for security-sensitive hashing or signing.
- Silently reinterpret an existing selector, field, or event meaning.
- Accept malformed trailing or truncated data unless the protocol explicitly defines it.

## SHOULD
- Use established codecs and generated bindings over handwritten binary parsing.

## Exceptions
Custom encodings require specification, test vectors, compatibility analysis, and review.

## Verification
Run round-trip and cross-language tests, malformed-input tests, selector/schema diffs, and compatibility checks.