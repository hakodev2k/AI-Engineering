# Testing Rules

## Purpose
Provide reliable regression evidence for Vue behavior at the correct test boundaries.

## Scope
Unit, component, integration, E2E, visual, and accessibility tests.

## MUST
- Critical user journeys and high-risk business rules MUST have automated regression coverage at an appropriate level.
- Component tests MUST assert observable behavior and contracts rather than incidental internal implementation.
- Tests involving asynchronous Vue updates MUST await the relevant render/request lifecycle deterministically.
- External services, time, randomness, and shared state MUST be controlled where they would make tests nondeterministic.
- Production bug fixes SHOULD add a regression test when a stable automated reproduction is practical.

## MUST NOT
- Arbitrary sleeps MUST NOT be used as the primary synchronization strategy.
- Snapshot tests MUST NOT replace semantic assertions for critical behavior.
- Flaky tests MUST NOT be normalized through unlimited retries or ignored failures.

## SHOULD
- Use the smallest test boundary that gives sufficient confidence while retaining integration/E2E coverage for critical wiring.
- Test accessibility and failure states, not only happy paths.

## Exceptions
A test may be temporarily quarantined only with evidence of flakiness, an owner, and a remediation path; critical coverage must be restored by another mechanism.

## Verification
Review CI reliability, test isolation, failure diagnostics, coverage of critical flows, and repeat-run stability.