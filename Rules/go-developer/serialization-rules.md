# Serialization Rules

## Purpose
Keep encoded data compatible, bounded, and safe.

## Scope
JSON, binary formats, schema tags, decoding, encoding, and public message contracts.

## MUST
- Serialized field names and semantics used externally MUST be treated as compatibility contracts.
- Decoders MUST enforce appropriate input size and structural constraints at trust boundaries.
- Numeric, time, null, and optional-field semantics MUST be defined where ambiguity affects consumers.
- Schema changes MUST assess old/new producer and consumer interoperability.

## MUST NOT
- MUST NOT expose internal structs directly as public wire contracts when internal evolution would break consumers.
- MUST NOT deserialize unbounded attacker-controlled payloads without resource controls.
- MUST NOT silently change field meaning while retaining the same contract identity.

## SHOULD
- Use dedicated transport types for stable external contracts.
- Reject unknown fields where strictness improves safety and compatibility detection.

## Exceptions
Permissive decoding requires a compatibility reason and tests for ambiguous inputs.

## Verification
Golden/contract tests, fuzzing, payload-size tests, backward/forward compatibility tests, and schema diff review.