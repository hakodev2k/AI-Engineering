# Temporal Logic Properties

## Purpose
Express safety, liveness, fairness, ordering, and eventuality requirements precisely using temporal logic so dynamic behavior can be checked over execution traces.

## When to use
Use for concurrent protocols, distributed systems, schedulers, reactive systems, and any requirement containing terms such as always, eventually, until, before, or infinitely often.

## Inputs
Behavioral requirements, state predicates, events, fairness assumptions, traces, and system model.

## Preconditions
The model must define the propositions and transitions referenced by each property.

## Context to inspect
Scheduling assumptions, retry semantics, timeouts, crash/recovery behavior, message delivery guarantees, and whether fairness is environmental or system-controlled.

## Core knowledge
Safety means bad things never happen; liveness means desired progress eventually occurs. Linear-time and branching-time logics answer different classes of questions. Fairness assumptions can make impossible systems appear correct if introduced casually.

## Procedure
1. Rewrite each natural-language requirement into an unambiguous behavioral statement.
2. Identify state and event predicates.
3. Classify the property as safety, liveness, response, precedence, persistence, or fairness-related.
4. Select appropriate temporal operators and logic.
5. Encode scope explicitly: global, before, after, between, or until.
6. Add fairness only when justified by the execution environment.
7. Check negated properties to ensure the tool can produce meaningful counterexamples.
8. Test boundary traces including starvation, repeated retries, and crash recovery.
9. Review whether the property is too weak, too strong, or vacuous.
10. Trace formal properties back to source requirements.

## Decision points
Use simpler invariants when temporal ordering is unnecessary. Prefer bounded temporal checks for finite operational windows only when boundedness matches the requirement.

## Common failure patterns
Accidental vacuity, hidden fairness assumptions, confusing eventual with immediate behavior, omitting scope, and expressing implementation detail instead of required behavior.

## Verification
Run model checking or trace evaluation, mutation-test predicates and antecedents, inspect counterexamples, and confirm representative valid and invalid traces are classified correctly.

## Expected output
A reviewed temporal property set with definitions, assumptions, traceability, and verification evidence.

## Stop conditions
Stop when fairness cannot be justified, propositions are undefined, or timing semantics are too ambiguous to formalize reliably.