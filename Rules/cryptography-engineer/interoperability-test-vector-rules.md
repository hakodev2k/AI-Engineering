# Interoperability and Test Vector Rules

## Purpose
Demonstrate that implementations agree on cryptographic semantics and reject invalid inputs.

## Scope
Algorithms, protocols, formats, providers, platforms, and language implementations.

## MUST
- Maintain authoritative positive and negative test vectors for security-critical constructions.
- Test boundary values, malformed inputs, invalid tags/signatures, unsupported versions, and algorithm negotiation.
- Verify interoperability across every implementation pair required in production.

## MUST NOT
- Treat round-trip tests from one implementation as sufficient correctness evidence.
- Accept a test vector whose provenance or expected security property is unknown.

## SHOULD
- Include published standards vectors and independently generated vectors where available.

## Exceptions
Unavailable external vectors require documented independent oracle or differential-testing strategy.

## Verification
CI must execute vectors deterministically and fail on mismatches, unexpected acceptance, or behavior drift.