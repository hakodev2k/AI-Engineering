# Input and Protocol Handling

## Purpose
Make externally controlled data safe and interoperable.

## Scope
Serial protocols, network packets, radio frames, files, commands, and peripheral data.

## MUST
- External lengths, enums, offsets, counts, and state transitions MUST be validated before use.
- Parsers MUST define behavior for malformed, truncated, duplicate, reordered, and oversized inputs as applicable.
- Protocol state machines MUST reject invalid transitions deterministically.
- Timeouts and retry limits MUST be bounded.
- Compatibility-sensitive protocol changes MUST be versioned or proven backward compatible.

## MUST NOT
- Untrusted input MUST NOT directly determine memory access, allocation, or privileged actions without validation.
- Parsers MUST NOT rely on implicit struct packing or host endianness across wire boundaries.

## SHOULD
- Parsers SHOULD be fuzz-tested when inputs are attacker-controlled or complex.

## Exceptions
Exceptions require protocol evidence and bounded risk.

## Verification
Use conformance tests, malformed-input tests, fuzzing, interoperability tests, and packet/trace inspection.