# Workflow: Measure, Diagnose, Optimize

**Trigger:** tool-heavy agent turn, compaction thrash, overflow error, or high context cost.  
**Goal:** reduce aggregate tool-context consumption while preserving task-critical evidence.

## Inputs
Representative trace, model context limit, output reserve, tool result sizes/priorities, task acceptance criteria.

## Baseline
Capture input/output tokens, tool-output tokens/turn, context utilization, compaction count, overflow retries, latency, and task result quality.

## Stages
1. Observe the failing/expensive trace.
2. Measure baseline with exact provider counts when available, conservative estimate otherwise.
3. Diagnose individual versus aggregate contributors.
4. Form one explicit hypothesis about externalization, chunking, filtering, or summarization.
5. Implement the smallest safe policy change.
6. Measure the same trace again.
7. If not improved, revise at most twice; do not repeat unchanged overflow retries.
8. Independently verify retained evidence and result quality.

## Responsible agent
Implementation owner; Token Budget Verifier independently verifies.

## Tools
Guard script, provider usage data/tokenizer, trace replay, task tests.

## Outputs
Before/after metrics, selected context, external references, quality result, final decision.

## Checkpoints
Baseline captured; before context removal; after new measurement; before completion.

## Metrics
Tokens/task, tool-output tokens/turn, p50/p95 latency where repeatable, compaction count, overflow retries, quality regression rate.

## Retry policy
Maximum two optimization revisions; identical overflow request maximum one retry.

## Stop conditions
Critical evidence would be lost, quality regresses beyond task threshold, overflow persists after two revisions, or safety instructions would be removed.

## Failure path
Reduce tool fanout, request narrower data, start a controlled fresh context with explicit handoff evidence, or escalate to platform owner.

## Verification
Replay baseline and optimized traces with the same acceptance criteria.

## Definition of Done
Measured improvement with no overflow, no critical context loss, bounded retries, and independent verification.
