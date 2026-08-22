# Research — Runtime Agent Spend Circuit Breaker

## Topic
Runtime Agent Spend Circuit Breaker

## Category
Token

## Problem
Agent runtimes can exceed intended token or monetary budgets because model calls, retries, tool-result ingestion, hooks, plugins, background work, and subagents accumulate spend across multiple layers. Existing dashboards often explain spend after the fact but do not enforce a hard runtime ceiling before another expensive action starts.

## Why it matters now
Current 2026 agent systems are increasingly long-running and multi-agent. Recent public requests across Claude Code, Microsoft Agent Framework, and Buzz independently ask for runtime-enforced token or monetary budgets rather than visibility alone. This is especially important for scheduled and unattended agents where a retry loop can consume a large usage window before a human notices.

## Affected users
Developers running coding agents, teams operating scheduled or background agents, platform builders, FinOps owners, multi-agent framework users, and organizations with shared provider accounts.

## Current public evidence
### Observed evidence
1. **Claude Code issue #85422, opened August 10, 2026** requests a “token-burn circuit breaker” with runtime-enforced spend caps and per-source attribution because warnings do not stop runaway usage. The report explicitly calls out hooks, plugins, and subagents as spend sources. Source: https://github.com/anthropics/claude-code/issues/85422
2. **Buzz issue #5652, opened August 12, 2026** asks for enforceable per-agent API budgets plus owner-wide spend visibility, stating that dashboards alone cannot prevent unexpectedly large bills. Source: https://github.com/block/buzz/issues/5652
3. **Microsoft Agent Framework issue #6397, opened June 8, 2026** requests stopping agent execution after a token-consumption limit. Source: https://github.com/microsoft/agent-framework/issues/6397
4. **Microsoft Agent Framework issue #6934, opened July 6, 2026** proposes a first-class task budget spanning thinking, tool calls, tool results, and output, with graceful wrap-up when the budget is exhausted. Source: https://github.com/microsoft/agent-framework/issues/6934
5. Gartner analysis reported in August 2026 describes an “inference paradox”: lower per-token costs do not guarantee lower total costs as agentic workflows consume more inference. Secondary source: https://www.techradar.com/pro/there-is-no-reliable-economical-one-size-fits-all-model-on-the-horizon-experts-claim-ai-costs-will-grow-fivefold-by-2028-as-demand-continues-to-soar

## Existing approaches
- Provider billing dashboards and usage pages.
- Per-call `max_tokens` or output-token caps.
- Model-side advisory prompts such as “stay within budget.”
- Post-run tracing and cost attribution.
- Manual kill switches when a user notices unexpected usage.
- Framework-specific turn limits or retry limits.

## Remaining limitations
- A per-call output cap does not bound cumulative multi-turn spend.
- Dashboards are retrospective and may lag behind execution.
- Advisory prompts are not deterministic enforcement.
- Turn limits do not account for different model prices, cache behavior, tool-result input size, or subagent fan-out.
- Provider usage can arrive after a request completes, so a guard must reserve expected cost before dispatch and reconcile afterward.
- Shared-account spend limits can be too coarse for a single task or agent.

## Root-cause analysis
1. **Distributed accounting:** usage is produced by parent and child model calls, retries, hooks, and delegated work.
2. **Late accounting:** exact usage is often known only after a call completes.
3. **No reservation model:** runtimes dispatch a request based on current spend without reserving worst-case or expected incremental spend.
4. **Mixed units:** tokens, dollars, requests, and provider-specific cached-token categories are not normalized.
5. **Retry amplification:** an error path can consume more budget than the successful path.
6. **No graceful exhaustion state:** systems often either continue or hard-fail, losing useful partial work.

## Improvement opportunity
Use a deterministic two-phase budget gate:

1. **Reserve before dispatch** using a conservative estimate for input, output, and model price.
2. **Reconcile after completion** against actual provider usage.
3. Attribute spend to `task`, `agent`, `source`, `model`, and `attempt`.
4. Enforce hard limits at task and agent scopes.
5. Trigger a bounded graceful-wrap-up state before the hard ceiling when configured.
6. Block new model calls when the hard budget is exhausted; never silently raise limits.

## Goal
Prevent unattended agent tasks from exceeding configured cumulative token or monetary ceilings while retaining auditable attribution and a safe path to return partial results.

## Metrics
- Actual input/output/cache tokens per task.
- Estimated vs actual cost error percentage.
- Reserved cost and outstanding reservations.
- Cost per completed task.
- Budget-exhaustion count.
- Spend attributed to parent, subagent, retry, hook, and plugin sources.
- Percentage of runs stopped before hard budget breach.
- Quality/regression rate after budget controls are enabled.

## Trigger
Before every model call, subagent delegation, retry, or other operation that can create model spend; and after every provider response carrying usage data.

## Inputs
Budget policy, cumulative ledger, model pricing table, estimated input/output tokens, source identity, task/agent IDs, and actual provider usage after completion.

## Outputs
`allow`, `wrap_up`, or `block` decision; reservation amount; reconciled spend; remaining budget; reason codes; and an append-only audit event.

## Interpretation
The evidence shows a recurring operational gap across multiple agent projects: teams can observe usage but still lack reliable runtime enforcement. It does not imply every framework lacks all limits; rather, cumulative cost governance across heterogeneous spend sources remains an active engineering problem.

## Proposed solution
A reusable reservation-and-reconciliation budget guard that runs outside the model, uses explicit policy and pricing configuration, blocks overspend deterministically, and produces verifiable before/after accounting.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/85422
- https://github.com/block/buzz/issues/5652
- https://github.com/microsoft/agent-framework/issues/6397
- https://github.com/microsoft/agent-framework/issues/6934
- https://www.techradar.com/pro/there-is-no-reliable-economical-one-size-fits-all-model-on-the-horizon-experts-claim-ai-costs-will-grow-fivefold-by-2028-as-demand-continues-to-soar
