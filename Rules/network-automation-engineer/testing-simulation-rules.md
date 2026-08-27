# Testing and Simulation Rules

## Purpose
Require representative evidence before automation can alter production networks.

## Scope
Unit tests, integration tests, virtual labs, digital twins, emulators, parsers, and regression suites.

## MUST
- Critical transformation and policy logic MUST have deterministic automated tests.
- Platform-specific behavior MUST be tested against supported versions or faithful fixtures/interfaces.
- Risky topology or routing changes MUST be exercised in simulation, lab, canary, or equivalent evidence-producing environment when feasible.
- Regression tests MUST be added for defects that could recur materially.
- Tests MUST include failure paths, malformed data, partial reachability, and retry behavior where relevant.

## MUST NOT
- MUST NOT treat template rendering success as sufficient proof of network correctness.
- MUST NOT make tests pass by broadly suppressing validation or expected failures.
- MUST NOT rely exclusively on mocks for protocol/device behaviors that mocks cannot faithfully represent.

## SHOULD
- Test fixtures SHOULD model realistic scale boundaries and heterogeneous platforms.
- Property or invariant tests SHOULD protect addressing, policy, and topology constraints.

## Exceptions
When realistic simulation is unavailable, document the gap, use the strongest available static/lab/canary evidence, reduce blast radius, and obtain appropriate approval.

## Verification
Inspect CI coverage of critical paths, failure tests, supported-platform matrices, lab evidence, regression cases, and production canary criteria.