# Workflow: Measure → Budget → Verify

## Trigger
High baseline token usage, oversized MCP/tool inventory, or slow first-turn discovery.

## Goal
Reduce tool-context and startup overhead while preserving correctness-critical capabilities and measured task quality.

## Inputs
Tool inventory, `config/budget.json`, task requirements, representative benchmark corpus.

## Baseline
Measure schema/input tokens, context utilization, startup/first-turn latency, cost/task, result quality, and critical-tool recall with the current tool set.

## Stages
1. **Observe** — inventory all configured tools/servers and task dependencies.
2. **Measure baseline** — collect token and latency metrics on the same benchmark corpus.
3. **Diagnose** — identify optional high-cost, low-relevance schemas/discovery paths.
4. **Hypothesize** — state which deferrals should save tokens/latency without affecting required capability recall.
5. **Implement** — run `scripts/tool_activation_plan.py` and configure lazy/deferred activation.
6. **Measure again** — repeat the identical benchmark corpus.
7. **Improved?** — if no, revise budget/relevance at most twice; if yes, continue.
8. **Verify** — independent Token Budget Verifier checks quality, critical-tool recall and regression.

## Responsible agent
Context-budget owner implements; Token Budget Verifier independently verifies.

## Tools
Runtime traces, tokenizer/tool inventory, planner script, benchmark/acceptance tests.

## Outputs
Baseline metrics, activation plan, before/after comparison, regression evidence, verification result.

## Checkpoints
After baseline; before deferring critical-adjacent capabilities; after benchmark; before rollout.

## Metrics
Tokens/task, schema tokens, context utilization, startup latency, task latency, cost/task, critical-tool recall, result quality, regression rate.

## Retry policy
Maximum two budget/relevance adjustments.

## Stop conditions
Stop on any critical capability loss, quality regression beyond tolerance, exhausted retries, or missing baseline.

## Failure path
Restore baseline activation and record the tool/task dependency that invalidated the hypothesis.

## Verification
Independent verifier reruns the representative corpus with the exact active/deferred inventory.

## Definition of Done
Implemented activation policy is reproducible; Measured savings are positive; Verified quality and critical-tool recall meet policy with no blocking regression.
