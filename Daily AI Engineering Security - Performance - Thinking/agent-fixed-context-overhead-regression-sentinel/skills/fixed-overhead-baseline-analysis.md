# Skill: Fixed Overhead Baseline Analysis

## Purpose
Measure and attribute non-task token overhead in a fresh agent session, compare it with an approved baseline, and identify regressions before optimization.

## Trigger
Harness release, model/context-tier change, tool/skill/MCP/subagent configuration change, unexpected quota burn, context-fit failure, or multi-agent scale-up.

## Inputs
Fresh-session measurements containing harness/model identity, context limit, total fixed tokens, and component token counts; approved baseline; token budget policy.

## Preconditions
Measure before meaningful conversation history is added. Baseline and candidate must use comparable tokenizer/accounting semantics or explicitly document the difference.

## Required context
Enabled system prompt, rules, tools, skills, MCP servers, subagent definitions, memory/attachments, model/context tier, and harness version.

## Allowed tools
Provider usage logs, local token counters when provider counts are unavailable, `scripts/fixed_overhead_sentinel.py`, version/config diff tools, and quality test suite.

## Constraints
Never remove safety, permission, trust-boundary, or correctness-critical context just to reduce tokens. Do not compare incompatible tokenizers as if counts were exact equivalents.

## Procedure
1. Capture an empty/fresh-session measurement at the API/harness boundary.
2. Attribute fixed tokens into stable components: system, tools, rules, skills, MCP, subagents, memory/attachments, other.
3. Record context limit and compute fixed utilization percentage.
4. Compare candidate total and components to the approved baseline.
5. Rank largest absolute contributors and largest regressions.
6. Form a hypothesis tied to a concrete version/configuration change.
7. Optimize only the implicated component: lazy loading, deduplication, narrower schemas/descriptions, or configuration gating.
8. Re-measure with identical conditions.
9. Run task-quality/security regression checks before accepting savings.

## Decision points
- Block if the candidate cannot fit before user/task input.
- Block when policy thresholds are exceeded without an approved exception.
- If attribution is incomplete, diagnose before optimizing.
- If token reduction lowers quality or removes required context, revert the reduction.

## Expected output
Baseline/candidate report, threshold decision, component deltas, optimization hypothesis, measured result, and verification status.

## Metrics
Fixed tokens, fixed/context percentage, absolute/relative delta, largest contributor, fan-out multiplied cost, tokens/task, cost/task, latency/task, and quality regression rate.

## Verification
A reduction is verified only after repeated comparable measurements and task-quality/security checks show no critical regression.

## Failure handling
On missing or incompatible measurements, fail the comparison and request new evidence rather than estimating silently.

## Stop conditions
Stop when budget passes and quality is preserved, or when two bounded optimization attempts fail to improve the targeted metric without regression.