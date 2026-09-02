# Skill: Investigate Pytest Order Dependence

## Purpose

Produce evidence that a pytest failure is or is not dependent on execution order within a bounded search.

## When to use

Use when a test passes alone but fails in a suite, shard, selective rerun, or after unrelated tests.

## Inputs

- Repository root.
- Failing test/node ID when known.
- CI/local failure output.
- Optional suspect predecessor tests.
- `config/gate-config.json`.

## Preconditions

- Tests can run in a non-production environment.
- External dependencies required by the test suite are available or intentionally mocked.
- No destructive cleanup is necessary to run the suite.

## Required context

Inspect repository structure, pytest configuration, relevant fixtures/conftest files, victim test, and nearby state-owning code. Expand context only when evidence points to it.

## Allowed tools

Read-only repository inspection, pytest execution, Git diff/status, and `scripts/order_gate.py`.

## Process

1. Identify the exact victim node ID from CI output or `pytest --collect-only -q`.
2. Run the victim alone. If it fails alone, classify as a baseline defect rather than order dependence.
3. Inspect fixtures and global state directly used by the victim.
4. Run `scripts/order_gate.py` on the narrowest relevant test scope.
5. Preserve any failing permutation exactly as emitted.
6. If likely predecessors are known, rerun each predecessor immediately before the victim.
7. If a combined sequence reproduces but single predecessors do not, bisect the predecessor list manually by halves; preserve each tested sequence.
8. Identify state changed by the predecessor and observed by the victim.
9. Separate facts, hypotheses, and open questions. Do not label a suspected shared cache/global as root cause until a targeted rerun validates it.
10. Hand the smallest reproducing sequence and state evidence to the Implementation Agent.

## Expected output

- Exact victim node ID.
- Baseline result.
- Reproducing order if found.
- Suspected state owner with file/fixture evidence.
- Confidence and remaining uncertainty.
- Report path from `order_gate.py`.

## Verification

A hypothesis is validated only when manipulating or cleaning the suspected state changes the outcome of the exact reproducing order.

## Failure handling

Collection errors stop investigation. Timeout may be retried once after confirming no ambiguous external side effect. Search scope may be expanded once within project bounds if no reproduction is found.

## Stop conditions

Stop on production-only reproduction requirements, destructive data access, unavailable mandatory dependencies, or after configured bounded search finds no reproducer.