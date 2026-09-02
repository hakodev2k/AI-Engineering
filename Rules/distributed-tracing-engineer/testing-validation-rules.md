# Tracing Testing and Validation Rules

## Purpose
Make instrumentation behavior verifiable before production and resistant to silent regressions.

## Scope
Applies to unit, integration, contract, load, and synthetic tests for tracing instrumentation and pipelines.

## MUST
- Critical propagation paths MUST have automated tests for trace continuity across process or protocol boundaries.
- Tests MUST validate span names, parentage or links, required attributes, status, and redaction where those semantics are contractually important.
- Instrumentation changes MUST be exercised on success and representative failure paths.
- Collector or processor changes MUST be validated with known input/output fixtures before production rollout.

## MUST NOT
- MUST NOT assert unstable trace IDs, timestamps, or ordering that are not semantic guarantees.
- MUST NOT use production secrets or unrestricted production payloads as telemetry test data.
- MUST NOT accept tests that merely verify spans exist when correctness of relationships or attributes matters.

## SHOULD
- Include end-to-end synthetic traces for critical journeys.
- Include performance tests when instrumentation volume or enrichment materially changes.

## Exceptions
Exceptions require identified testability limitations, compensating manual evidence, risk, and owner approval.

## Verification
Review CI results, instrumentation fixtures, synthetic traces, redaction tests, collector pipeline tests, and benchmark evidence before release.
