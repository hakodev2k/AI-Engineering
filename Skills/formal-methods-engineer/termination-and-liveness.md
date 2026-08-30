# Termination and Liveness

## Purpose
Establish that computations, protocols, and workflows eventually make required progress under explicitly stated assumptions.

## When to use
Use for recursive algorithms, retry loops, schedulers, concurrent protocols, distributed workflows, and systems that can deadlock, livelock, or starve.

## Inputs
Transition system or program, ranking candidates, fairness assumptions, retry policy, scheduler model, and progress requirements.

## Preconditions
The distinction between required progress and acceptable indefinite waiting must be defined.

## Context to inspect
Loops, recursion, backoff, queues, locks, resource acquisition, fairness, timeout behavior, crash recovery, and environment dependencies.

## Core knowledge
Termination often relies on a well-founded ranking function that decreases on every relevant step. Liveness in concurrent or distributed systems may require fairness or eventual synchrony; those assumptions must not be hidden inside the proof.

## Procedure
1. State the exact termination or progress property.
2. Identify cycles in control or transition graphs.
3. Classify cycles as legitimate recurring behavior, potential livelock, or termination-relevant loops.
4. Propose ranking functions or well-founded measures where applicable.
5. Prove decrease and lower bounds for each relevant transition.
6. For reactive systems, state fairness or environmental progress assumptions explicitly.
7. Model retries, starvation, resource exhaustion, and crash recovery.
8. Check that safety mechanisms do not accidentally block progress forever.
9. Test counterexamples with adversarial scheduling.
10. Document residual liveness dependencies on external systems.

## Decision points
Prove termination for bounded tasks; use temporal liveness properties for intentionally non-terminating services. Accept probabilistic progress only when the requirement permits it.

## Common failure patterns
Assuming fair scheduling, using a measure that can increase on hidden transitions, ignoring retries, proving local termination while global coordination deadlocks, and confusing absence of deadlock with guaranteed progress.

## Verification
Check ranking obligations, model-check starvation/deadlock scenarios, and ensure weakened fairness assumptions expose expected counterexamples.

## Expected output
A termination or liveness argument with assumptions, proof/checking evidence, and operational dependencies.

## Stop conditions
Stop when progress depends on an undocumented external guarantee, the ranking relation is not well-founded, or fairness assumptions are not defensible.