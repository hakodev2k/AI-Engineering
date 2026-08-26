# Testing Rules

## Purpose
Prove supported flag states and transitions behave correctly before production exposure.

## Scope
Unit, integration, end-to-end, contract, and failure testing.

## MUST
- Both enabled and disabled paths MUST be tested for flags that can be toggled in production.
- Critical state transitions MUST have regression coverage.
- Tests MUST use deterministic flag fixtures rather than live mutable production configuration.
- Failure behavior for unavailable or malformed flag data MUST be tested.

## MUST NOT
- Tests MUST NOT depend on uncontrolled remote flag state.
- A rollout MUST NOT rely solely on happy-path testing when rollback or disabled paths are safety mechanisms.
- Retired branches MUST NOT remain indefinitely just to satisfy obsolete tests.

## SHOULD
- Integration tests SHOULD cover representative combinations without attempting an unbounded Cartesian product.

## Exceptions
Untested states require documented evidence that they are unreachable or explicitly unsupported.

## Verification
Review test matrices, fixtures, CI results, mutation/state-transition tests, and coverage of failure modes.