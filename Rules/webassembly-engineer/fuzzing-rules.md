# Fuzzing Rules

## Purpose
Discover malformed-input, parser, memory-boundary, and state-machine failures before production.

## Scope
Applies to module loading, binary parsing, interface decoding, host calls, serialization, and guest-controlled inputs.

## MUST
- Security-sensitive parsers and raw memory adapters MUST have fuzz coverage where practical.
- Fuzz harnesses MUST bound memory, time, and external side effects.
- Every confirmed crash, trap, hang, or invariant violation MUST be minimized and retained as a regression case.
- Fuzz targets MUST exercise release-relevant code paths rather than disconnected replicas.
- Findings with security implications MUST follow the project's vulnerability handling process.

## MUST NOT
- Fuzzing MUST NOT target production systems or uncontrolled external services.
- A high execution count MUST NOT be treated as evidence of meaningful coverage without inspecting target reachability or coverage signals.
- Known reproducible crashes MUST NOT remain silently suppressed in the corpus.

## SHOULD
- Seed corpora with valid representative artifacts plus malformed edge cases.
- Use structure-aware generation for interface and binary formats when available.
- Run continuous fuzzing for high-risk boundary code.

## Exceptions
When fuzz infrastructure is unavailable, property-based malformed-input testing may temporarily substitute if risk is documented.

## Verification
Inspect harnesses, corpora, coverage reports, crash triage records, and regression tests. Confirm resource controls prevent fuzz inputs from affecting unrelated systems.