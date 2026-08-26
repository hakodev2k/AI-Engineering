# Skill: Observable Convergence Analysis

## Purpose
Distinguish productive long-running agent work from repetition, no-progress loops, and scope runaway using observable evidence.

## Trigger
High token spend, repeated tool calls, multi-hour tasks, watchdog retries, or work that expands without closing acceptance criteria.

## Inputs
Step trace, tool name/arguments, task acceptance items, progress keys, open/completed counts, token/cost and latency metrics.

## Preconditions
Acceptance criteria are represented externally; trace collection excludes secrets.

## Required context
Task goal, observable state, retry history, and tool metadata. Hidden chain-of-thought is neither required nor requested.

## Allowed tools
Trace analyzers, unit tests, task-state stores, read-only observability queries.

## Constraints
MUST judge progress from observable actions/state. MUST NOT infer private reasoning. MUST preserve safety/approval boundaries when recovering.

## Procedure
1. Capture a baseline trace and cost-to-outcome.
2. Normalize each tool name + arguments into a deterministic signature.
3. Record acceptance-state changes as progress keys or completed/open counts.
4. Measure repeated signatures, consecutive no-progress steps, and scope growth without completion.
5. Form one falsifiable hypothesis for the loop cause.
6. Run the convergence guard.
7. On warning, require a changed hypothesis, input, or action; repeating the same call is not a recovery.
8. On stop, choose verified completion, self-contained clarification, or escalation with evidence.
9. Re-run on a healthy long trace to measure false stops.

## Decision points
Continue when task state changes. Warn when repetition/no-progress reaches warning thresholds. Stop autonomous execution at stop thresholds or when recovery budget is exhausted.

## Expected output
Facts, Evidence, Assumptions, Hypothesis, Decision, Risks, Metrics, Verification status.

## Metrics
Identical-call streak, no-progress streak, completion delta/100 steps, scope-growth streak, tokens/outcome, false-stop rate.

## Verification
Independent reviewer replays both stuck and healthy traces.

## Failure handling
Maximum 2 recovery cycles. Each must alter the causal hypothesis or execution path.

## Stop conditions
Any guard stop, dangerous action without approval, or exhausted recovery cycles.