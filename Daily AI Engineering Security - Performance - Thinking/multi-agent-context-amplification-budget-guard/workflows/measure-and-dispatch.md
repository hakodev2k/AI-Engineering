# Workflow: Measure and Dispatch

## Trigger
Before spawning one or more subagents.

## Goal
Prevent avoidable context/token amplification while preserving correctness.

## Inputs
Task, parent context estimate, child plan, model limits, asset metadata.

## Baseline
Measure parent tokens, current cache-read tokens, network bytes if available, and expected fan-out.

## Context
Classify context as `required`, `task-relevant`, `referenceable`, or `evictable`.

## Stages
1. Observe current context and fan-out plan.
2. Measure child-specific baseline.
3. Diagnose duplicated/irrelevant inherited content.
4. Hypothesize a minimal safe child context.
5. Deduplicate/reference eligible assets.
6. Run budget guard.
7. If blocked, reduce context/fan-out and retry at most twice.
8. Dispatch.
9. Measure actual usage.
10. Verify result quality and required-context retention.

## Responsible agent
Coordinator proposes; context reviewer verifies.

## Tools
Token counter, digest tools, `scripts/context_amplification_guard.py`.

## Outputs
Approved dispatch plan and before/after metrics.

## Checkpoints
Before content reduction; before fan-out; after task completion.

## Metrics
Tokens/task, amplification, duplicated bytes, context utilization, quality regression.

## Retry policy
Maximum 2 budget-reduction attempts.

## Stop conditions
Unknown child limit; critical context would be removed; amplification remains over budget; quality regression.

## Failure path
Run sequentially or escalate with a smaller verified scope.

## Verification
Independent reviewer confirms required context survived optimization.

## Definition of Done
Budget passes, task result passes quality checks, and actual amplification is measured.
