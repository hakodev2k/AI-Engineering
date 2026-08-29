# Feedback and Quality Loop

## Purpose
Turn production feedback, failures, and user corrections into prioritized product improvements and stronger evaluations.

## When to use
Use after launch, during quality investigations, or when support and usage signals reveal recurring AI failures.

## Inputs
User feedback, support tickets, flagged outputs, corrections, eval failures, usage telemetry, model and prompt versions.

## Context to inspect
Feedback collection UX, event schemas, failure taxonomy, routing rules, issue backlog, eval datasets, and release history.

## Core knowledge
Raw thumbs-up/down signals are weak without task context. The highest-value feedback is attributable to a concrete failure mode, user segment, system version, and desired outcome.

## Procedure
1. Define a practical taxonomy for quality failures.
2. Capture feedback with enough context to reproduce behavior.
3. Cluster recurring issues by user impact and frequency.
4. Separate model, retrieval, tool, data, UX, and policy causes.
5. Add confirmed failures to regression evals.
6. Prioritize fixes by severity, frequency, strategic importance, and effort.
7. Measure whether fixes improve both offline evals and online outcomes.
8. Close the loop with support or affected users when appropriate.
9. Review taxonomy and collection quality periodically.

## Decision points
Prioritize systemic failures over isolated oddities unless a rare failure has severe consequences. Do not retrain or reprompt before identifying the actual failing layer.

## Common failure patterns
Collecting feedback without context, treating all negative feedback as model failure, fixing anecdotes without regression tests, and allowing feedback queues to become unowned archives.

## Verification
Reproduce sampled failures, confirm they are represented in evals, and demonstrate that implemented fixes reduce recurrence.

## Expected output
A governed feedback pipeline, failure taxonomy, prioritized quality backlog, and regression-learning process.

## Stop conditions
Stop when feedback cannot be attributed to a reproducible system state or when required evidence is unavailable.