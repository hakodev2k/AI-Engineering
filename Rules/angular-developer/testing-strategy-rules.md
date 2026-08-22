# Testing Strategy Rules

## Purpose
Create reliable regression evidence at the cheapest layer that proves important Angular behavior.

## Scope
Unit, component, integration, contract, and end-to-end testing.

## MUST
- Cover critical business behavior, authorization-sensitive UI states, error paths, and regression-prone integration boundaries.
- Test observable behavior rather than private implementation details unless the detail itself is a contract.
- Keep tests deterministic by controlling time, network, randomness, and external state where relevant.
- Use integration/E2E coverage for risks that unit tests cannot prove.

## MUST NOT
- Treat high test count or line coverage as proof of risk coverage.
- Depend on arbitrary sleeps for asynchronous correctness.
- Mock away the exact integration behavior a test is intended to verify.

## SHOULD
- Maintain a balanced test portfolio with fast feedback and focused critical-path E2E coverage.

## Exceptions
A knowingly untested material risk requires documented rationale, compensating verification, owner, and approval.

## Verification
Review test mapping to risks, flaky-test history, CI results, mutation/regression evidence where useful, and critical-path execution.