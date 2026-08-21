# Skill: Tool Context Budget Analysis

## Purpose
Measure tool-schema overhead and decide when lazy/tiered loading is justified without sacrificing task correctness.

## Trigger
Run when tool count/schema size changes, context/cost rises, or a benchmark shows tool definitions dominate input.

## Inputs
Task, full tool registry, recent usage, core tools, budget configuration, provider token counts when available, and benchmark tasks.

## Preconditions
A baseline with all tools enabled must exist for representative tasks.

## Procedure
1. Serialize and measure every full tool definition.
2. Record total schema tokens/request, percent of total input, latency, cost/task, task success, and tools actually used.
3. If below count/token thresholds, keep all tools; do not optimize by default.
4. Build compact descriptors from names + bounded descriptions.
5. Pin core/safety-critical tools.
6. Select task-relevant/recent tools within schema budget using `scripts/select_tool_schemas.py`.
7. Execute the same benchmark tasks with lazy selection.
8. Compare token use, latency, selected-tool recall, extra-round-trip rate, and task success.
9. If needed, adjust budget/selection thresholds; maximum two tuning iterations.
10. Keep lazy loading only if savings are material and regression limits pass.

## Decision points
- Small catalog/low schema cost: keep all tools.
- Core tools cannot fit budget: block optimization and raise budget/redesign schemas.
- Selected-tool recall below configured floor: increase budget or improve retrieval.
- Task success regression exceeds configured maximum: revert optimization.

## Expected output
Baseline, selected tool set, token savings, quality/regression report, and activation decision.

## Metrics
Schema tokens/request, total tokens/task, cost/task, latency, tool recall/precision, task success, regression rate, cache hit rate.

## Verification
Use a frozen benchmark where required tools are known. Compare identical task sets before/after. Provider token-count APIs SHOULD replace the approximation for production measurement.

## Failure handling
Do not silently drop required tools. After two unsuccessful tuning iterations, revert to all-tools mode or explicit static toolsets.

## Stop conditions
Verified improvement, detected quality regression requiring rollback, core-budget violation, or maximum two tuning iterations reached.