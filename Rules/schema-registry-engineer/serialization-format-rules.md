# Serialization Format Rules

## Purpose
Ensure supported serialization formats are used with predictable semantics and interoperability.

## Scope
Avro, Protocol Buffers, JSON Schema, encoding metadata, canonicalization, and format-specific constraints.

## MUST
- Each subject MUST declare the serialization format used by producers and consumers.
- Format-specific compatibility semantics MUST be understood before approving evolution patterns.
- Canonicalization or fingerprinting MUST be deterministic for deduplication and identity use cases.
- Encoders and decoders MUST be tested against the registry version deployed in production.
- Cross-language contracts MUST be validated with representative client implementations where interoperability risk exists.

## MUST NOT
- MUST NOT assume identical field syntax has identical evolution behavior across formats.
- MUST NOT mix incompatible wire formats under the same contract identity.
- MUST NOT depend on client-specific undocumented behavior for required compatibility.

## SHOULD
- Prefer formats with mature tooling for the project’s language ecosystem and evolution needs.
- Keep format-specific guidance close to registry policy.

## Exceptions
Exceptions require interoperability evidence, operational risk assessment, and approval.

## Verification
Run cross-language round-trip tests, canonicalization tests, and format-specific compatibility checks.