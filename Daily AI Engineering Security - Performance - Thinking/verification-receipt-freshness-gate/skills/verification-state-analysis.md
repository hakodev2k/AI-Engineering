# Skill: Verification State Analysis

## Purpose
Determine whether a coding task requires fresh verification or already has valid evidence for the current repository state.

## Trigger
Before running tests after a prior successful run, after a reviewer requests re-verification, or before final completion.

## Inputs
Repository HEAD, relevant changed paths, verification command, latest receipt, reviewer finding scope.

## Preconditions
Repository state is readable and the intended verification command is known.

## Required context
Task acceptance criteria, relevant file scope, current HEAD, prior receipt. Hidden chain-of-thought is neither required nor requested.

## Allowed tools
Read-only Git inspection, deterministic receipt script, test runner.

## Constraints
- MUST NOT mark a receipt fresh when HEAD differs.
- MUST NOT ignore changed relevant paths.
- MUST NOT rerun identical verification more than twice without state change.
- MUST NOT allow out-of-scope reviewer findings to silently expand the task.

## Procedure
1. Normalize task-relevant paths.
2. Record current HEAD.
3. Build the verification key from HEAD + path set + command.
4. Compare it with the newest successful receipt.
5. If key matches and freshness TTL is valid, classify `satisfied`.
6. If HEAD, scope, command, or TTL differs, classify `stale` and run verification once.
7. If a reviewer finding is outside the declared task scope, classify `out_of_scope` and request explicit scope expansion rather than looping.
8. After a successful run, write a new receipt and immediately re-evaluate.

## Decision points
`satisfied`, `stale`, `failed`, `out_of_scope`, `orchestrator_loop`.

## Expected output
Facts, receipt key, freshness decision, reason codes, verification status.

## Metrics
Duplicate verification rate; successful runs per unique verification key; time after first green run; false stale classifications.

## Verification
An independent reviewer confirms that a fresh receipt maps exactly to current HEAD, paths and command.

## Failure handling
Fail closed on unreadable Git state or malformed receipt. Maximum 2 identical reruns.

## Stop conditions
Stop on two fresh green receipts for the same key, on explicit test failure, or when scope ambiguity requires human decision.
