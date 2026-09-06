# Testing Rules

## Purpose
Prove schema evolution, serialization, policy, and operational behavior before production use.

## Scope
Unit tests, compatibility tests, cross-version tests, integration tests, failure tests, and retained-data decoding.

## MUST
- Schema changes MUST include compatibility tests for the policy applied to the subject.
- Critical contracts MUST test representative old-reader/new-writer and new-reader/old-writer behavior where relevant.
- Serialization round trips MUST validate logical types, defaults, nulls, enums, unions, and references used by the contract.
- Registry integration tests MUST cover registration, lookup, authorization, and expected failure responses.
- Confirmed production schema failures MUST result in regression tests where practical.

## MUST NOT
- MUST NOT rely only on parser success as schema test coverage.
- MUST NOT ignore flaky compatibility or integration tests; they MUST be investigated or explicitly quarantined with ownership.
- MUST NOT use only happy-path payloads when malformed or historical data is realistic.

## SHOULD
- Preserve representative historical payload fixtures for critical contracts.
- Test client behavior during registry unavailability and stale-cache conditions.

## Exceptions
Manual verification requires documented evidence, reviewer ownership, and reason automation is impractical.

## Verification
Inspect CI results, fixtures, cross-version matrices, integration tests, and regression coverage.