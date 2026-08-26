# Skill: Progress Diagnosis
## Purpose
Distinguish productive iteration from activity-only loops using observable state change.
## Trigger
Repeated tool calls, rising token usage without artifacts, or stalled long-running tasks.
## Inputs
Task goal, tool trace, token counts, externally observable state deltas.
## Preconditions
A measurable goal and non-secret trace are available.
## Required context
Facts, acceptance criteria, tool results, and state changes only; hidden chain-of-thought is neither requested nor required.
## Allowed tools
Read-only logs, tests, counters, repository inspection.
## Constraints
Do not infer progress from model claims alone. Do not weaken permissions to escape a loop.
## Procedure
1. Define a goal-relevant progress event.
2. Baseline normal call diversity and progress interval.
3. Canonicalize tool calls and compute fingerprints.
4. Mark progress only from independently observable state change.
5. Detect identical/cyclic no-progress streaks and token burn.
6. Form one recovery hypothesis, execute once, and remeasure.
7. Repeat at most once; then stop and escalate.
## Decision points
Continue on verified progress; recover on threshold breach; stop after recovery budget exhaustion.
## Expected output
Facts, Evidence, Hypothesis, Decision, Risks, Verification status.
## Metrics
No-progress streak, tokens since progress, recoveries, task completion and false-stop rate.
## Verification
Independent tests must include productive long traces and pathological loops.
## Failure handling
Fail closed on malformed traces; preserve evidence.
## Stop conditions
At most two recovery attempts; stop immediately on unsafe or irreversible action requests.
