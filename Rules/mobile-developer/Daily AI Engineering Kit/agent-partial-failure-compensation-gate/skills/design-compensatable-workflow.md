# Skill: Design a Compensatable Workflow

## Purpose
Turn a multi-step side-effecting task into an explicit plan that can stop, reconcile, resume, or compensate without relying on chat memory.

## Use when
A task touches two or more external mutable systems, remote APIs, repositories, tickets, deployments, databases, files, or provider operations and partial success is possible.

## Inputs
- Requested business outcome.
- Repository revision.
- Systems/tools touched.
- Side effects and provider guarantees.
- Available read-back/reconciliation APIs.
- Human approval boundaries.

## Preconditions
- Relevant repository/tool context has been inspected.
- Secrets are not copied into plan artifacts.
- Each side effect can be uniquely identified by an operation key or equivalent provider idempotency key.

## Allowed tools
Read-only repository inspection, official provider documentation, dry-run/simulation tools, test environments, schema validators, and least-privilege metadata queries.

## Constraints
Do not authorize production mutation. Do not claim an action is compensatable unless its inverse and verification are known. `none` compensation is allowed only when forward recovery is the documented strategy.

## Procedure
1. List side effects in actual dependency order.
2. Assign stable step ids and operation keys.
3. Define the precondition that must hold immediately before each mutation.
4. Define postcondition evidence proving success independently of command exit status.
5. Classify provider response semantics: definite success, definite failure, or possible unknown outcome.
6. For each step define compensation mode: `automatic`, `manual`, or `none`.
7. For compensatable steps define inverse action and verification query/check.
8. For non-compensatable steps define forward-recovery evidence and stop boundary.
9. Mark approval-required actions using `config/compensation-policy.json`.
10. Order steps to minimize irreversible work before reversible work where business semantics permit.
11. Run `python scripts/validate-plan.py --plan <plan> --policy config/compensation-policy.json`.
12. Fingerprint the final plan before execution/review.

## Output
A plan matching `schemas/workflow-plan.schema.json` plus a fingerprint artifact.

## Verification
Every step has a unique operation key, explicit precondition, success evidence, compensation contract, and approval classification; validator exits 0.

## Failure handling
Unknown provider semantics, missing read-back evidence, or ambiguous compensation block planning. Do not guess.

## Stop conditions
Stop before execution when validation fails, an irreversible step lacks approval controls, or an unknown outcome cannot be reconciled.
