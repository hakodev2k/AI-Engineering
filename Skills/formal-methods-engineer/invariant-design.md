# Invariant Design

## Purpose
Identify, formalize, and validate invariants that must hold across all reachable system states. Invariants provide the backbone for proofs, model checking, runtime assertions, and architecture reviews.

## When to use
Use when a system must preserve safety properties across concurrent operations, failures, retries, migrations, or adversarial inputs. Do not use an invariant to encode a property that is actually eventual or liveness-oriented.

## Inputs
State model, transition rules, domain constraints, failure modes, concurrency semantics, security requirements, and known incidents.

## Preconditions
The relevant state and transition boundaries must be defined well enough to reason about reachability.

## Context to inspect
Database constraints, protocol rules, authorization boundaries, transaction semantics, recovery paths, caches, replicas, and compensating actions.

## Core knowledge
An invariant is a property true in the initial state and preserved by every valid transition. Strong invariants improve assurance but may over-constrain implementations. Inductive strengthening is often required because a desirable property may not itself be inductive.

## Procedure
1. Enumerate unacceptable states and irreversible failures.
2. Translate each into a candidate invariant.
3. Separate local invariants from cross-component invariants.
4. Check the initial state against each candidate.
5. Evaluate every transition for preservation.
6. Introduce strengthening lemmas when direct induction fails.
7. Model retries, duplicate delivery, crash recovery, and concurrent interleavings.
8. Remove redundant properties that add no independent assurance.
9. Trace invariants to requirements and operational controls.
10. Convert critical invariants into executable checks where practical.

## Decision points
Prefer smaller compositional invariants when component boundaries are stable. Use stronger global invariants when cross-system safety cannot be decomposed safely.

## Common failure patterns
Confusing invariants with postconditions; ignoring initialization; proving only happy paths; omitting recovery transitions; and strengthening invariants until legitimate behavior becomes impossible.

## Verification
Use induction, model checking, mutation of transitions, and targeted counterexample search. Confirm invariant violations are observable in intentionally faulty models.

## Expected output
A reviewed invariant set with rationale, proof or checking evidence, traceability, and operational enforcement notes.

## Stop conditions
Stop when transition semantics are incomplete, critical state is hidden from the model, or an invariant conflicts with an approved requirement.