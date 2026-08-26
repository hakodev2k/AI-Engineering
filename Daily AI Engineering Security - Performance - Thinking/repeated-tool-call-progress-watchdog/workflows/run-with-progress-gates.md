# Workflow: Run with Progress Gates
## Trigger
Any autonomous task expected to use more than one tool step.
## Goal
Allow productive long-running work while stopping repeated no-progress behavior early.
## Inputs
Goal, acceptance criteria, tool trace, watchdog config.
## Baseline
Capture normal progress intervals, step counts and token usage for comparable successful tasks.
## Stages
1. Observe and define a measurable progress event.
2. Measure baseline.
3. Execute tool step.
4. Record tool fingerprint, token cost and verified state delta.
5. If progress occurred, reset no-progress counters.
6. If a threshold is breached, form one recovery hypothesis and execute it.
7. Remeasure. A second breach allows one final recovery; the next breach stops execution.
8. Independent verifier reviews completion evidence.
## Checkpoints
Before execution, at every recovery, and before completion.
## Metrics
No-progress steps, identical-call streak, tokens since progress, recoveries, false-stop rate.
## Retry policy
Maximum 2 recovery attempts.
## Stop conditions
Recovery budget exhausted, unsafe action requested, malformed evidence, or acceptance criteria cannot be verified.
## Failure path
Stop further tool calls and emit trace plus blocking reason for human review.
## Verification
`python -m unittest tests/test_progress_watchdog.py` plus independent trace review.
## Definition of Done
Acceptance criteria verified, no blocking loop condition, bounded recovery proven, and metrics recorded.
