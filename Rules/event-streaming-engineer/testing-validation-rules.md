# Testing and Validation Rules

## Purpose
Detect semantic, compatibility, temporal, and failure defects before they reach production.

## Scope
Applies to unit, contract, integration, topology, replay, performance, and failure testing.

## MUST
- Critical transformations MUST have deterministic tests for representative valid, invalid, duplicate, out-of-order, and boundary events.
- Producer/consumer contracts MUST be validated independently of a shared implementation model.
- Stateful processors MUST test restart, restoration, and topology/state migration behavior.
- Integration tests MUST exercise the actual serialization format and broker/client semantics where those affect correctness.
- Regression tests MUST be added for production defects with reproducible failure conditions when practical.

## MUST NOT
- MUST NOT rely only on mocked broker tests for delivery, rebalance, offset, or transaction semantics.
- MUST NOT make tests pass by adding arbitrary sleeps when deterministic synchronization is possible.
- MUST NOT ignore flaky stream-processing tests; flakiness MUST be investigated or quarantined with ownership and expiry.

## SHOULD
- Golden historical event fixtures SHOULD be maintained for compatibility and replay testing.
- Property-based testing SHOULD be considered for serialization and transformation invariants.

## Exceptions
A test gap requires documented risk, alternative verification evidence, owner, and remediation plan for critical paths.

## Verification
Review CI results, test determinism, coverage of failure modes, contract fixtures, broker integration environments, and regression linkage.