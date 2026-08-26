# Parser and Input Safety Rules
## Purpose
Make parsers robust against malformed, adversarial, oversized, and ambiguous inputs.
## Scope
HTML, CSS, URL, MIME, image/media metadata, protocol, and other browser parsers.
## MUST
- Parser state machines MUST define behavior for malformed and truncated input.
- Arithmetic derived from input sizes or offsets MUST be checked before allocation or access.
- Resource consumption MUST be bounded for attacker-controlled nesting, repetition, and token sizes.
## MUST NOT
- MUST NOT assume inputs are normalized, trusted, or null-terminated.
- MUST NOT convert parse errors into unsafe partially initialized state.
## SHOULD
- SHOULD keep parsing deterministic and suitable for coverage-guided fuzzing.
## Exceptions
Unbounded constructs require a standards necessity analysis and mitigation review.
## Verification
Use fuzzers, corpus regression tests, sanitizers, malformed-input suites, and resource-exhaustion tests.