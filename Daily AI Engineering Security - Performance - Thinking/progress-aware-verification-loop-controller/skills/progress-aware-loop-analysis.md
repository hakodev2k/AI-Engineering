# Skill: Progress-Aware Loop Analysis

## Purpose
Determine whether repeated agent activity is productive progress, redundant verification, or a true stagnant loop using observable state.

## Trigger
A loop detector fires, verification repeats, an unattended job stalls, or a reviewer/implementer cycle exceeds expected iterations.

## Inputs
Ordered event trace, deterministic `state_id`, fresh verification result, task status, retry budgets.

## Preconditions
The state identifier must be derived from external task state, not model narration.

## Required context
Only task requirements, state transitions, verification outputs, and tool events needed to classify progress.

## Allowed tools
Read-only repository inspection, test runner, telemetry reader, `scripts/progress_loop_guard.py`.

## Constraints
MUST NOT request hidden chain-of-thought. MUST NOT mark progress merely because the agent says it is progressing. MUST NOT skip a required security/correctness check after state changes.

## Procedure
1. Define the task's terminal states.
2. Choose a deterministic state fingerprint.
3. Capture a baseline trace before changing loop controls.
4. Label each verification with the exact state it verified and whether the result is fresh.
5. Run the deterministic guard on the trace.
6. For a false positive, identify which state transition the current detector ignored.
7. For redundant verification, identify why a fresh result was not reused for the unchanged state.
8. Adjust only the smallest relevant budget or state-binding rule.
9. Re-run the same fixtures and one independent real trace.

## Decision points
- State advances: permit repeated action class.
- State unchanged beyond budget: stop stagnant loop.
- Fresh green verification exists for unchanged state and verification budget is exhausted: stop redundant verification.
- Terminal lifecycle state: stop immediately.

## Expected output
Facts, Evidence, State transitions, Decision, Risks, Verification status.

## Metrics
False-stop rate, redundant verification count, stagnant repeats, completion rate.

## Verification
An independent reviewer reproduces both a productive-cycle allow case and a stagnant-loop stop case.

## Failure handling
If state identity is ambiguous, block automatic tuning and escalate. Maximum diagnosis revisions: 2.

## Stop conditions
Stop when the decision is reproducible, retries are exhausted, or required state evidence is unavailable.
