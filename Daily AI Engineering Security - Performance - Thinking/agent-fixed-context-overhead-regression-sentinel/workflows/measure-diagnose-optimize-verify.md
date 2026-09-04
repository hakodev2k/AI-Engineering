# Workflow: Measure, Diagnose, Optimize, Verify Fixed Context Overhead

## Trigger
Agent harness release, model/context migration, tool/skill/MCP/subagent change, or unexpected token/context usage.

## Goal
Reduce avoidable fixed context overhead only when measurement identifies a concrete regression, while preserving correctness and security.

## Inputs
Approved baseline, candidate fresh-session measurement, policy, config/version diff, quality/security test suite.

## Baseline
Capture at least one fresh-session reference under the same model/token-accounting conditions. Prefer repeated samples when the provider's reported counts vary.

## Context
Fixed overhead includes context present before meaningful task history: system, tools, rules, skills, MCP, subagent definitions, memory/attachments, and other harness scaffolding.

## Stages
1. **Observe** — capture candidate component counts and context limit.
2. **Measure baseline** — validate baseline identity and accounting compatibility.
3. **Diagnose** — run the sentinel and rank total/component deltas.
4. **Form hypothesis** — map the dominant regression to an explicit release/configuration change.
5. **Implement improvement** — prefer lazy loading, deduplication, narrower descriptions/schemas, or profile-specific loading; do not delete required safety/correctness context.
6. **Measure again** — repeat the fresh-session measurement under matching conditions.
7. **Improved?** — if no, re-evaluate at most twice; if yes, continue.
8. **Verify** — run task-quality, security, and context-fit checks with an independent verifier.
9. **Complete** — promote the candidate as the new approved baseline only after verification.

## Responsible agent
Platform/implementation agent performs optimization; `subagents/context-budget-verifier.md` independently verifies.

## Tools
Provider usage logs/tokenizer, configuration diff, `scripts/fixed_overhead_sentinel.py`, test suite.

## Outputs
Before/after measurements, regression report, optimization record, quality results, approved or blocked decision.

## Checkpoints
Before optimization; after each measurement; before replacing the approved baseline.

## Metrics
Fixed tokens, utilization percentage, absolute/relative delta, per-component delta, fan-out multiplier, tokens/task, cost/task, latency/task, quality pass rate.

## Retry policy
Maximum two optimization iterations per regression diagnosis. Measurements may be repeated for variance; do not loop indefinitely.

## Stop conditions
Stop if measurements are incomparable, required context would need removal, quality/security regresses, or the budget still fails after two iterations.

## Failure path
Keep the prior approved profile/baseline, document the blocking regression, and escalate the specific component owner.

## Verification
Sentinel passes, context fits, quality/security tests pass, and verifier confirms no critical context loss.

## Definition of Done
Evidence documented; baseline captured; regression attributed; improvement measured; before/after comparison complete; tests pass; risk documented; independent verification complete; no blocking issue remains.