# Fuzzing and Regression Rules
## Purpose
Turn parser, state-machine, memory, and security failures into durable regression protection.
## Scope
Fuzz targets, corpora, crash triage, minimized reproducers, and regression tests.
## MUST
- Security- or memory-relevant crashes MUST be minimized and retained as regression coverage when safe.
- Fuzz targets MUST exercise meaningful trust boundaries and reject false success caused by unreachable code.
- Fixed defects MUST include deterministic coverage at the narrowest useful layer.
## MUST NOT
- MUST NOT discard recurring crashes because exploitability is unknown.
- MUST NOT add broad suppressions that hide unrelated findings.
## SHOULD
- SHOULD seed fuzzers with valid and malformed representative inputs.
## Exceptions
A regression artifact may be withheld when it contains sensitive exploit material; equivalent safe coverage MUST be used.
## Verification
Review fuzzer coverage, sanitizer results, crash deduplication, minimized cases, and CI regression execution.