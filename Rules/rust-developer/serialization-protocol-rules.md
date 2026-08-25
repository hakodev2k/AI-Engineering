# Serialization and Protocols

## Purpose
Protect compatibility, integrity, and resource safety at serialization and wire-format boundaries.

## Scope
JSON, binary formats, schemas, network protocols, persisted payloads, and message contracts.

## MUST
- External payloads MUST have explicit size/depth limits before or during decoding.
- Schema evolution MUST preserve compatibility required by deployed producers and consumers.
- Unknown or future fields MUST be handled according to an explicit compatibility policy.
- Numeric conversions and enum decoding MUST reject invalid or lossy values when correctness depends on them.

## MUST NOT
- MUST NOT deserialize untrusted input into unchecked privileged actions.
- MUST NOT change persisted or wire representations accidentally through internal refactoring.
- MUST NOT assume UTF-8, endianness, alignment, or version without contract evidence.

## SHOULD
- Separate wire models from domain models when compatibility and domain evolution differ.
- Add golden/round-trip tests for stable formats.

## Exceptions
Breaking format changes require versioning, migration, rollback, and consumer-impact approval.

## Verification
Use compatibility fixtures, round-trip tests, fuzzing, malformed-input tests, and cross-version integration tests.