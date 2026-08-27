# Testing Rules

## Purpose
Provide regression evidence across module logic, boundaries, runtimes, and failure modes.

## Scope
Applies to unit, integration, conformance, end-to-end, fuzz, and compatibility testing.

## MUST
- Critical module behavior MUST have deterministic automated regression tests.
- Boundary tests MUST cover valid, malformed, oversized, unauthorized, and unsupported inputs.
- Runtime-dependent features MUST be exercised on the declared support matrix.
- Security and resource-limit controls MUST have negative tests proving forbidden operations fail.
- Production bug fixes MUST add regression coverage when reproducible at a practical test layer.

## MUST NOT
- Tests MUST NOT depend on undeclared host capabilities.
- A single engine's test success MUST NOT establish multi-runtime compatibility.
- Flaky tests MUST NOT be normalized through unlimited retries.
- Mock-only tests MUST NOT replace integration coverage for ABI, component, WASI, or host-function boundaries.

## SHOULD
- Use property-based or fuzz testing for parsers and binary/interface boundaries.
- Keep representative release-mode tests because optimization can affect behavior.
- Separate conformance failures from workload-specific failures for diagnosis.

## Exceptions
A difficult-to-automate production condition may use documented manual verification temporarily, with risk and follow-up automation tracked.

## Verification
CI must report test layers and runtime matrix explicitly. Reviewers should inspect negative-path coverage, flaky-test history, and whether release artifacts—not only development builds—are exercised.