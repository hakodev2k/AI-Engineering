# Skill: Repair Test Isolation

## Purpose

Remove the shared-state dependency that caused an evidence-backed order-dependent pytest failure.

## Inputs

- Exact failing predecessor+victim sequence.
- State-leak evidence.
- Relevant fixtures and implementation files.
- Parent task acceptance criteria.

## Preconditions

The failure is reproduced or the state leak is independently proven. The repair can be made without production mutation.

## Process

1. Locate the code or fixture that owns creation of the leaked state.
2. Determine whether isolation belongs in setup, teardown/finalizer, dependency injection, cache reset, transaction rollback, or explicit local test fixture.
3. Implement the smallest fix at the state owner rather than compensating in unrelated victim tests.
4. Ensure cleanup runs even if fixture setup or test execution raises.
5. Do not enforce test order or add retries/sleeps.
6. Add or update a regression test that exercises the leak boundary when practical.
7. Run the victim alone.
8. Run the exact predecessor+victim reproducer.
9. Run the baseline relevant suite.
10. Run the configured permutation gate.
11. Inspect Git diff for unintended API, dependency, configuration, or production-facing changes.
12. Hand all evidence to the Verification Agent.

## Expected output

A minimal repair plus test evidence proving the original reproducer no longer fails.

## Verification

All four levels must pass: victim-alone, original reproducer, baseline relevant suite, deterministic permutations.

## Failure handling

Maximum two repair/retest cycles. Preserve each failed attempt's diff and test evidence before revising the hypothesis.

## Stop conditions

Stop before schema changes, destructive SQL, broad dependency upgrades, production configuration changes, deletion outside test-owned paths, or any security weakening without human approval.