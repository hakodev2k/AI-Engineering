# Workflow: Measure → Select → Verify

## Trigger
Tool registry reaches configured count/schema-token thresholds, registry changes, or telemetry shows tool definitions dominate input.

## Goal
Reduce schema context/cost while retaining tool availability required for successful tasks.

## Inputs
Full tool definitions, representative tasks, recent usage, core tools, budget configuration, provider telemetry.

## Baseline
Run representative tasks with all enabled tool schemas. Record schema tokens/request, total tokens/task, latency, cost, task success, used tools, and cache behavior.

## Stages
1. **Observe** — attribute current input tokens and identify schema share.
2. **Measure baseline** — freeze benchmark/task set and provider settings.
3. **Diagnose** — identify largest schemas, rarely used tools, cache misses, and unavoidable core tools.
4. **Hypothesize** — a compact catalog plus bounded relevant full schemas can reduce overhead without dropping required tools.
5. **Implement selection** — run `scripts/select_tool_schemas.py`; pin core tools; enforce budget.
6. **Measure again** — run identical tasks with selected schemas and record extra selection/tool-discovery turns.
7. **Improved?** — require token/latency improvement plus configured quality gates.
8. **No** — tune selection/budget once; maximum two total tuning attempts, then revert/fallback.
9. **Yes** — independent Context Benchmark Verifier checks measurements and task regressions.
10. **Complete** — enable only for toolsets above validated thresholds.

## Responsible agent
Context optimizer implements; Context Benchmark Verifier independently verifies.

## Tools
Usage telemetry, tokenizer/provider counts, selector script, benchmark runner, logs.

## Outputs
Activation decision, selected schemas, before/after metrics, regression report, fallback configuration.

## Checkpoints
After baseline, after selector generation, after each benchmark pass, before rollout.

## Metrics
Schema tokens/request, total tokens/task, cost/task, latency, selected-tool recall/precision, extra-round-trip rate, task success/regression, cache hit rate.

## Retry policy
At most two selector/budget tuning iterations. No infinite adaptive loop.

## Stop conditions
Quality gate failure after two iterations, core-tool budget violation, no material token benefit, or independent verification success.

## Failure path
Revert to all-tools mode or static explicit toolsets; preserve baseline and failed benchmark evidence.

## Definition of Done
Baseline captured; optimization implemented; before/after metrics collected; selected-tool recall meets configured floor; task regression stays below configured maximum; core tools preserved; verifier approves; fallback tested.