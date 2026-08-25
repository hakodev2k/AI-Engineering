# Deserialization and Parser Security

## Purpose
Safely process untrusted structured data without object injection, code execution, entity expansion, memory exhaustion, or ambiguous interpretation.

## When to use
Use for JSON/XML/YAML, binary formats, object serialization, archives, document parsers, and message ingestion.

## Inputs
Formats, libraries, schemas, parser options, payload limits, trust boundaries, and downstream object models.

## Context to inspect
Inspect polymorphic type handling, custom converters, external entities, anchors/references, recursion, decompression, and post-parse validation.

## Core knowledge
Parsing creates a high-complexity attack surface. Data-only formats should remain data-only. Schema validation does not automatically prevent resource exhaustion or unsafe object construction.

## Procedure
1. Identify all externally influenced formats and parser versions.
2. Disable unsafe type instantiation, external entity resolution, and executable tags/features.
3. Apply schema/type validation appropriate to the protocol.
4. Bound bytes, nesting depth, collection sizes, references, decompression ratio, and processing time.
5. Map parsed data into explicit domain types rather than arbitrary runtime objects.
6. Handle duplicate keys and ambiguous encodings consistently.
7. Keep parsers patched and isolate high-risk native parsers where appropriate.
8. Test malformed, deeply nested, cyclic, oversized, and type-confusion payloads.

## Decision points
Prefer simpler formats when interoperability allows. Sandbox/isolate parsers when file complexity or native-code exposure cannot be reduced sufficiently.

## Common failure patterns
Native object deserialization from untrusted data, unbounded XML/YAML features, schema validation without size limits, and inconsistent parsers across services.

## Verification
Run adversarial corpus tests and confirm unsafe features are disabled in production-equivalent configuration.

## Expected output
A constrained parser configuration, explicit data mapping, and robustness tests.

## Stop conditions
Escalate when a legacy protocol requires unsafe object deserialization or parser crashes indicate potential memory-safety exploitation.