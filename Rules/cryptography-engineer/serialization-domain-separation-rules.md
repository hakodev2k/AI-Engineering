# Serialization and Domain Separation Rules

## Purpose
Prevent ambiguous encodings and cross-context cryptographic substitution.

## Scope
Hashed, MACed, signed, encrypted, or KDF input structures.

## MUST
- Define an unambiguous encoding for every cryptographically protected structured message.
- Include explicit type, version, and domain context where cross-protocol confusion is plausible.
- Specify normalization rules for text and structured data before cryptographic processing.

## MUST NOT
- Concatenate variable-length fields without an unambiguous framing scheme.
- Sign or MAC a representation that permits multiple security-relevant interpretations.

## SHOULD
- Prefer established canonical or length-delimited encodings with interoperability tests.

## Exceptions
Existing wire formats require documented ambiguity analysis and compensating validation.

## Verification
Use alternate-encoding, field-boundary, normalization, version-confusion, and cross-protocol test cases.