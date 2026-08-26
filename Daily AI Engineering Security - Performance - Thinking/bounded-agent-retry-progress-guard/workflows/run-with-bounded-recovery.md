# Workflow: Run With Bounded Recovery

**Trigger:** any agent task that can retry providers, tools, tests, compaction, or recovery steps.  
**Goal:** make progress explicit and guarantee a terminal state when progress stops.

## Inputs
Task goal, acceptance criteria, policy, run trace destination, initial checkpoint.

## Baseline
Record failing tests/errors, current artifact state, token/time counters, and the first accepted progress predicate.

## Stages
1. Observe current state.
2. Measure baseline.
3. Decompose into bounded subgoals.
4. Form one current hypothesis.
5. Execute one action and emit a normalized `action_signature`.
6. Mark `progress=true` only when observable task state improves.
7. Run `scripts/retry_progress_guard.py` after each recovery/retry cluster.
8. If guard says continue, proceed to the next checkpoint.
9. If no improvement, try at most two materially different recovery hypotheses.
10. On budget exhaustion, persist checkpoint/evidence and transition to `halt_and_escalate`.

## Responsible agent
Implementation agent; Independent Progress Verifier handles final verification.

## Tools
Task-specific tools plus deterministic progress guard.

## Outputs
Trace, checkpoints, guard decisions, final status, concise failure evidence if halted.

## Checkpoints
After every verified progress event and before any dangerous/irreversible action.

## Metrics
Retries/task; same-action streak; no-progress steps; tokens/time since last progress; recovery success rate.

## Retry policy
Per `config/policy.json`; recovery hypotheses maximum 2.

## Stop conditions
Any guard budget exhaustion, two failed recovery hypotheses, dangerous repeated action, or missing observable progress definition.

## Failure path
Halt; preserve last verified checkpoint; escalate with Facts, Evidence, Attempts, Remaining unknowns.

## Verification
Independent verifier compares progress markers with actual task state.

## Definition of Done
Task acceptance criteria pass, guard never exceeded budget, final state is verified, and no unsupported success claim remains.
