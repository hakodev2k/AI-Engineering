# Workflow: Regression Verification

## Trigger
After changing interrupt collection, subgraph resume handling, checkpoint serialization, or resume validation.

## Goal
Prove addressability across single, multiple, partial, unknown-ID, duplicate-ID, top-level, and nested cases.

## Inputs
Gate script, tests, host fixtures, pre/post durable state.

## Baseline
Capture the known failure if available: two pending IDs plus scalar resume accepted or consumed by one branch.

## Stages
1. Run package unit tests.
2. Single pending interrupt + scalar resume: verify accepted according to host semantics.
3. Multiple pending interrupts + scalar resume: verify rejected before dispatch.
4. Multiple pending interrupts + complete ID map: verify intended consumption.
5. Multiple pending interrupts + partial known-ID map: verify unresolved IDs remain pending when policy allows partial resume.
6. Unknown ID: verify rejection.
7. Duplicate pending IDs: verify rejection.
8. Repeat the matrix with interrupts nested inside one subgraph task.

## Responsible agent
Resume Verification Agent.

## Tools
Python standard library, deterministic fixtures, host test framework.

## Outputs
Case matrix and exact pre/post interrupt sets.

## Checkpoints
After package tests and after nested-host cases.

## Metrics
100% expected decisions for deterministic tests; zero unintended branch consumption; exact remaining-set match.

## Retry policy
Maximum 2 retries after a code or fixture correction.

## Stop conditions
Any scalar multi-interrupt case reaches dispatch, any addressed value reaches the wrong ID, or post-resume pending state cannot be reconciled.

## Failure path
Mark verification failed and retain the checkpoint without further resume attempts.

## Verification
The verifying agent must not rely on execution order as evidence of correct addressing.

## Definition of Done
Implemented, Measured, and Verified states are separated; all deterministic and nested integration cases pass.
