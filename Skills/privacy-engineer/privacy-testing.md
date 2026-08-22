# Privacy Testing

## Purpose
Turn privacy requirements into repeatable tests that prove controls work in real system behavior.

## When to use
Use before releases and when validating minimization, authorization, preferences, deletion, isolation, redaction, or retention.

## Inputs
Privacy requirements, architecture, test identities, data map, APIs, configuration, and expected lifecycle behavior.

## Context to inspect
Inspect happy paths, error paths, asynchronous jobs, caches, replicas, telemetry, exports, and third parties.

## Core knowledge
Privacy controls fail at boundaries and lifecycle edges. Testing should verify absence as well as presence: data not collected, unauthorized users denied, withdrawn processing stopped, and deleted data unavailable.

## Procedure
1. Convert requirements into observable invariants.
2. Create synthetic subjects and sensitive markers.
3. Test collection and payload minimization.
4. Test authorization and tenant isolation.
5. Test preference propagation.
6. Test retention and deletion across copies.
7. Search telemetry for forbidden markers.
8. Test retries, failures, and restoration scenarios.
9. Automate stable high-value checks.
10. Record evidence and regressions.

## Decision points
Use production-like environments for lifecycle and integration behavior that unit tests cannot represent, without using unnecessary real personal data.

## Common failure patterns
Testing only UI, asserting implementation rather than outcomes, ignoring async copies, and using production personal data in tests.

## Verification
Independent evidence must demonstrate each privacy invariant across representative system paths.

## Expected output
A privacy regression suite and documented test evidence.

## Stop conditions
Block release when critical privacy invariants cannot be tested or fail.