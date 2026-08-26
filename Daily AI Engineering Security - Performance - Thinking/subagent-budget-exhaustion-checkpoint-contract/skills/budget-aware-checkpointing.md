# Skill: Budget-Aware Checkpointing

## Purpose
Prevent useful subagent work from disappearing when token, spend, iteration, or rate limits approach exhaustion.

## Trigger
Before every model/provider dispatch in a bounded agent run, and immediately after a budget/rate-limit error.

## Inputs
Task budget, used tokens/cost proxy, estimated next-call size, reserve policy, current goal, facts, completed steps, next step, verification status.

## Preconditions
The runtime can estimate request size conservatively and persist a task-scoped checkpoint outside ephemeral model context.

## Required context
Current goal, durable task identifier, verified facts, current workspace state, remaining budget. Hidden chain-of-thought is neither required nor requested.

## Allowed tools
Token counters/estimators, deterministic budget guard, durable file/task storage, read-only usage telemetry.

## Constraints
The checkpoint reserve MUST NOT be spent on optional research. A partial result MUST NOT be labeled completed. Resume MUST use the durable checkpoint before rediscovering context.

## Procedure
1. Measure baseline token/cost consumption per step and per subagent.
2. Before each provider call, estimate serialized input plus response allowance.
3. Run `scripts/budget_checkpoint_guard.py`.
4. Below soft pressure, continue normally.
5. At soft pressure, persist goal, facts, completed steps, next step, verification status, workspace identity, and unresolved risks.
6. If the next call would consume the checkpoint reserve or hard pressure is reached, do not dispatch the provider call.
7. Emit terminal state `partial_budget_exhausted`, pointing to the durable checkpoint.
8. On resume, load the checkpoint and revalidate only mutable external state; do not repeat settled discovery without evidence of drift.

## Decision points
Continue, checkpoint-then-continue, checkpoint-and-yield, or block invalid accounting.

## Expected output
Machine-readable budget decision plus durable resumable checkpoint.

## Metrics
Tokens/task, tokens repeated after resume, checkpoint completion rate, useful-output-before-cutoff rate, rediscovery calls after resume, recovery latency.

## Verification
Simulate soft pressure, hard pressure, oversized next call, restart/resume, and stale workspace state.

## Failure handling
Fail closed on invalid accounting. Preserve existing checkpoint. Retry resume at most twice; then escalate rather than burning another full budget.

## Stop conditions
Task completed with verification, checkpoint-and-yield emitted, invalid budget state, or maximum resume attempts exhausted.
