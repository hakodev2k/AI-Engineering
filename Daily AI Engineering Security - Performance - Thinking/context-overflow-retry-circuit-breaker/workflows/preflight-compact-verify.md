# Workflow: Preflight → Compact → Verify

## Trigger
Large prompt assembly, provider context error, zero-output near model limit, or repeated model-call retry.

## Goal
Convert context overflow from an unbounded retry condition into a measurable, bounded recovery path.

## Inputs
Token estimates, model context limit, reserved output, immutable/evictable breakdown, provider error, prior attempt metrics.

## Baseline
Capture input tokens/task, retries/task, latency, cost, overflow success/failure mode, and representative quality score.

## Stages
1. Observe assembled context and classify immutable versus evictable segments.
2. Measure preflight budget.
3. Diagnose whether failure is deterministic capacity or transient provider behavior.
4. Form hypothesis: removing a specified evictable segment will reduce input below usable capacity without critical context loss.
5. Compact once and measure token delta.
6. If minimum progress is not met, fail fast; otherwise recheck budget.
7. A second compaction is allowed only if policy permits and required context remains intact.
8. Run the same representative task/quality fixture.
9. Independent verification.

## Responsible agent
Context optimizer implements; Token Verifier independently checks.

## Tools
Circuit-breaker script, tokenizer/provider estimate, trace inspection, regression fixtures.

## Outputs
Budget table, failure classification, compaction delta, before/after cost and latency, quality status, final decision.

## Checkpoints
Before first request; after every compaction; before any repeated signature; before completion.

## Metrics
Tokens/task, retries/task, compaction attempts, latency, cost/task, overflow recovery rate, quality regression rate.

## Retry policy
Maximum two compactions and one repeated-signature retry; never infinite.

## Stop conditions
Immutable context exceeds usable capacity; compaction lacks minimum progress; quality-critical context would be removed; configured attempts exhausted.

## Failure path
Return deterministic fail-fast evidence and recommend capacity/model routing or task decomposition rather than blind retry.

## Verification
Independent verifier checks both token reduction and quality fixture.

## Definition of Done
Overflow classification is deterministic, loops are bounded, before/after metrics exist, tests pass, and no critical context loss is detected.
