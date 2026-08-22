# Research — Retry Episode Lifecycle Isolation Guard

## Topic
Retry Episode Lifecycle Isolation Guard

## Category
Thinking

## Problem
Agent runtimes often share retry counters across logically separate failure episodes. A successful recovery, tool-call round, or state transition may not reset the correct counter, causing later unrelated failures to inherit exhausted retry budget and terminate prematurely. The inverse failure also occurs: retries may restart without preserving failure identity, creating loops.

## Why it matters now
Hermes Agent issue #79100, opened 2026-08-05, reports that the length-continuation counter is not reset after successful tool-call recovery, so non-consecutive truncation events accumulate and a later episode terminates early. Hermes issue #20975 documents repeated truncated tool-call retries where an unchanged retry provides no new information and tends to fail the same way. Azure's current transient-fault guidance says retry strategy must track attempts, bound retries, distinguish persistent failure, and adapt behavior by operation.

## Affected users
Agent-runtime developers, users of long tool-using sessions, coding agents generating large tool arguments, workflow orchestrators, and platform teams implementing recovery state machines.

## Current public evidence
1. Hermes Agent #79100 (2026-08-05): successful tool-call recovery does not reset `length_continue_retries`, so later non-consecutive truncations consume stale budget: https://github.com/NousResearch/hermes-agent/issues/79100
2. Hermes Agent #20975 (2026-05-07): truncated tool calls receive an identical first retry, which often reproduces the same failure; proposal adds a changed strategy before giving up: https://github.com/NousResearch/hermes-agent/issues/20975
3. Azure transient fault handling guidance (updated 2026): retry policies should track retries, use operation-appropriate limits, avoid excessive retries, and handle continually failing operations explicitly: https://learn.microsoft.com/en-us/azure/architecture/best-practices/transient-faults
4. AWS Well-Architected guidance: control and limit retries, use backoff, and decide when to stop based on the operation: https://docs.aws.amazon.com/wellarchitected/2022-03-31/framework/rel_mitigate_interaction_failure_limit_retries.html

## Existing approaches
Global/per-turn retry counters, generic maximum retry counts, exponential backoff, continuation prompts, and provider retries.

## Remaining limitations
A bounded counter is insufficient if its lifecycle is wrong. Counters can leak across recovered episodes or reset too aggressively and enable loops. Generic retry logic may also retry an unchanged failure without a new hypothesis. Agent runtimes commonly have multiple overlapping counters for truncation, tool errors, provider errors, schema repair, and continuation.

## Root-cause analysis
- Retry budgets are keyed to a broad turn/session instead of a stable failure-episode identity.
- Success transitions do not define explicit reset semantics for every counter.
- Recovery state machines lack an observable episode ledger.
- Retry attempts are counted without requiring a changed recovery action after repeated failure.
- Terminal errors report counters rather than the actual episode history, making diagnosis difficult.

## Improvement opportunity
Model retries as explicit episodes keyed by failure class + operation identity + relevant state fingerprint. Reset only when a verified recovery boundary is crossed. Require a changed recovery strategy after repeated identical failure. Persist a compact episode ledger and enforce bounded attempts per episode and per turn.

## Goal
Prevent stale retry-budget poisoning and unbounded retry cycles while improving recovery diagnostics.

## Metrics
Premature terminations caused by stale counters, retries per failure episode, repeated-identical-retry rate, recovered episodes, terminal error accuracy, and extra token/tool-call cost from recovery.

## Trigger
Any retryable agent event: output truncation, malformed tool call, tool failure, schema repair, provider transient error, or continuation recovery.

## Inputs
Failure class, operation/tool identity, state fingerprint, prior episode ledger, retry policy, attempt result, and verified recovery event.

## Outputs
Episode ID, retry/transform/stop decision, attempt count, reset decision, changed-strategy requirement, and audit ledger.

## Observed evidence
The Hermes reports show both stale retry accounting and ineffective repeated retry behavior in a current agent runtime. Cloud reliability guidance independently supports operation-scoped bounded retry semantics.

## Interpretation
The generalizable defect is not a specific Hermes counter. It is lifecycle ambiguity: a retry budget must belong to a defined failure episode and have explicit reset/terminal transitions.

## Proposed solution
Provide an episode-state machine, deterministic ledger validator, enforceable retry rules, and bounded recovery workflow. No hidden reasoning is required; only observable failure facts, hypotheses, actions, and outcomes are recorded.
