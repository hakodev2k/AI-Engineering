# Skill: Acceptance Contract Engineering

## Purpose
Translate a task into observable completion predicates and required-call coverage without requesting hidden reasoning.

## Trigger
Before an autonomous or multi-step agent begins implementation, or immediately after a task is recovered from an unstructured loop.

## Inputs
User goal, explicit requirements, repository/runtime state, allowed tools, risk level, and known acceptance tests.

## Preconditions
Task scope and current environment can be inspected through observable evidence.

## Required context
Facts, assumptions, acceptance criteria, safety boundaries, required actions, forbidden actions, and current state.

## Allowed tools
Read-only repository inspection, test discovery, schemas, APIs for current state, and deterministic validators.

## Constraints
- MUST NOT encode hidden chain-of-thought.
- MUST distinguish facts from assumptions.
- MUST prefer machine-checkable predicates where feasible.
- MUST record required calls only when their execution is necessary evidence, not as arbitrary ceremony.

## Procedure
1. Restate the target state as externally observable outcomes.
2. Determine whether the target state is already satisfied.
3. Create predicate IDs with check method and expected value.
4. Identify required tool/test calls needed to prove completion.
5. Mark predicates that are safety- or data-integrity-critical.
6. Define forbidden actions and approval boundaries.
7. Validate that the contract is sufficient to reject a false completion claim.

## Decision points
If the environment already satisfies all predicates, terminate as `already-satisfied` without unnecessary mutation. If a requirement is not machine-checkable, mark it semantic and require independent evidence review rather than inventing a deterministic check.

## Expected output
Acceptance contract containing predicate IDs, expected observations, check commands/functions, required calls, safety boundaries, and current-state status.

## Metrics
Predicate coverage, deterministic-check coverage, required-call coverage, and already-satisfied detections.

## Verification
An independent verifier reviews the contract before high-risk execution.

## Failure handling
If critical requirements cannot be represented or verified, stop autonomous execution and escalate instead of weakening the contract.

## Stop conditions
Contract validated, or execution blocked because completion cannot be verified safely.