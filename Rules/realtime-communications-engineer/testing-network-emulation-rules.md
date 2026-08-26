# Testing and Network Emulation Rules

## Purpose
Validate realtime behavior under deterministic adverse conditions.

## Scope
Unit, integration, end-to-end, interoperability, soak, and network impairment testing.

## MUST
- Critical session state machines MUST have deterministic automated tests.
- End-to-end tests MUST cover representative loss, latency, jitter, reordering, bandwidth constraints, and disconnects.
- Supported browser/device interoperability MUST be regression-tested.
- Tests MUST distinguish product failures from test-infrastructure instability.

## MUST NOT
- MUST NOT mask flaky RTC tests with unbounded retries.
- MUST NOT rely exclusively on pristine LAN conditions.
- MUST NOT use nondeterministic impairment profiles without recording seeds/parameters when reproducibility is required.

## SHOULD
- Maintain a compact critical-path suite plus broader scheduled compatibility and soak suites.

## Exceptions
Unautomatable scenarios require documented manual procedure and evidence retention.

## Verification
Review CI results, impairment profiles, flake rates, device matrices, reproducibility, and failure artifacts.