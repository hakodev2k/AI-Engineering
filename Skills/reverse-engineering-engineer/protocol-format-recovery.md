# Protocol and File Format Recovery

## Purpose
Infer undocumented message or file structures for interoperability, migration, debugging, or authorized analysis.

## When to use
Use when source specifications are unavailable and multiple legitimate samples or traces can be observed.

## Inputs
Captured messages/files, producer/consumer binaries, controlled test cases, timestamps, known semantic inputs.

## Preconditions
Ensure captures are authorized and redact sensitive payloads. Prefer controlled test data.

## Context to inspect
Framing, magic values, lengths, tags, version fields, checksums, compression, encoding, alignment, state transitions, optional fields, and error responses.

## Core knowledge
Correlation is not causation. Differential experiments are more reliable than visual pattern matching. Endianness, varints, TLV layouts, protobuf-like encodings, padding, compression, and checksums can mask structure.

## Procedure
1. Collect a corpus spanning minimal and boundary cases.
2. Align samples and identify invariant versus changing regions.
3. Change one semantic input at a time and observe byte differences.
4. Infer framing, lengths, identifiers, counters, and field ordering.
5. Test numeric widths, signedness, endianness, and encodings.
6. Identify checksums/compression only after structural hypotheses exist.
7. Model stateful sequences separately from message syntax.
8. Build a parser that rejects malformed lengths and unknown versions safely.
9. Validate against unseen samples and the original implementation.

## Decision points
Prefer black-box differential testing when it provides enough evidence; inspect producer/consumer code when ambiguity remains. Preserve unknown fields rather than inventing semantics.

## Common failure patterns
Overfitting few samples; ignoring versioning; mistaking encrypted/compressed bytes for fields; unsafe parser assumptions; assigning semantic names without evidence.

## Verification
Parser round-trips or decodes unseen legitimate samples, boundaries are validated, and controlled input changes affect predicted fields.

## Expected output
A versioned format/protocol specification, parser model, evidence notes, and unresolved fields.

## Stop conditions
Stop if analysis would require unauthorized interception, bypassing access controls, or unsafe interaction with production systems.