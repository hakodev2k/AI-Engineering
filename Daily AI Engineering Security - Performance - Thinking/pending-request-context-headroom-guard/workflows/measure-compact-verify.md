# Workflow: Measure, Compact, Verify

## Trigger
Before a large or long-running agent turn, after pending context changes, or after a context overflow signal.

## Goal
Admit only requests that fit measured capacity while preserving correctness-critical context.

## Inputs
Token counts, model capacity, reserves, protected context, pending additions, baseline task fixtures.

## Baseline
Capture previous policy decision, actual provider input usage when available, overflow/error rate, tokens/task, latency/task, and task success.

## Context
Use explicit Facts, Assumptions, Evidence, Decision, Risks, Verification status. Do not request hidden chain-of-thought.

## Stages
1. Observe current and pending context.
2. Measure baseline and projected next-request tokens.
3. Diagnose stale accounting, missing pending additions, or capacity mismatch.
4. Form one bounded remediation hypothesis.
5. Run admission guard.
6. If COMPACT, compact eligible context and remeasure.
7. If improved and admissible, run model call and record actual usage.
8. Compare before/after token, latency, overflow, and quality metrics.
9. Context Verifier independently reviews.

## Responsible agent
Context Analyzer for stages 1-8; Context Verifier for stage 9.

## Tools
Token counters, config readers, guard script, replay/test harness.

## Outputs
Baseline, projected ledger, admission decision, compaction evidence, before/after comparison, verification decision.

## Checkpoints
After projection; after each compaction; after actual provider usage; before completion.

## Metrics
Overflow errors; tokens/task; compactions/task; projected/actual error; cost; latency; result quality; critical-context-loss rate.

## Retry policy
Maximum two compaction cycles. Token measurement may retry once for transient tooling failure.

## Stop conditions
Projected request remains over capacity after two compactions; capacity source unresolved; protected context would need removal; quality regression exceeds tolerance.

## Failure path
Do not send unchanged overflowing input. Preserve evidence and escalate to a larger-context route or explicit context-reduction decision.

## Verification
Known overflow fixture must be intercepted before provider call; normal fixture must pass; protected-context assertions must pass.

## Definition of Done
Evidence documented, baseline measured, admission guard implemented, boundary tests pass, before/after metrics collected, no critical context loss, and independent verification passes.