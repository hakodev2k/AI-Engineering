# Skill: MCP/Tool Context Budget Analysis

## Purpose
Measure tool-schema and startup overhead, then create a task-aware activation plan without removing capabilities required for correctness.

## Trigger
A session starts with many MCP/tools, first-turn latency grows, context utilization is high, or tool schemas consume a material fraction of the context window.

## Inputs
Tool inventory with measured `schema_tokens`, `startup_ms`, task tags, criticality and relevance; task-required tools/tags; budget policy.

## Preconditions
Token counts and discovery/startup timings have been measured from the actual client/runtime where possible.

## Required context
Task acceptance criteria and capabilities required to satisfy them.

## Allowed tools
Inventory export, tokenizer/trace tooling, `scripts/tool_activation_plan.py`, benchmark and acceptance tests.

## Constraints
- MUST NOT defer a correctness-critical tool merely to save tokens.
- MUST baseline current tokens and latency before optimization.
- MUST keep measurement data separate from inferred relevance.

## Procedure
1. Measure baseline schema tokens and discovery/startup latency.
2. Mark critical tools and explicit task requirements.
3. Assign task relevance using observable task tags or configured scores.
4. Run the activation planner.
5. Record active/deferred capabilities and predicted savings.
6. Execute the same task benchmark with the budgeted set.
7. Compare tokens/task, latency/task, quality, critical-tool recall and regression rate.
8. Reject the optimization if required context/capabilities were lost.

## Decision points
Block when required capabilities alone exceed budget; increase the budget or redesign schemas rather than silently dropping required tools.

## Expected output
Baseline, active/deferred inventory, before/after metrics, quality result, verification status.

## Metrics
Input/tool-schema tokens, context utilization, startup latency, task latency, cost/task, critical-tool recall, result quality, regression rate.

## Verification
Independent verifier reruns representative tasks and confirms no critical capability loss.

## Failure handling
Restore the baseline tool set if quality regresses; capture which deferred tool was needed and update task tagging/criticality.

## Stop conditions
At most two budget adjustments per benchmark cycle. Stop immediately if correctness-critical coverage drops.
