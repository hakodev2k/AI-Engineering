# Research — Subagent Budget Exhaustion Checkpoint Contract

**Topic:** Preserve useful partial work when subagents approach token/spend/iteration limits  
**Category:** Token  
**Research date:** 2026-08-27 (UTC+7)

## Problem
Subagents can consume most or all of a token/spend/iteration budget and then terminate without a durable partial-result handoff. The parent cannot reliably distinguish budget exhaustion from normal completion, and retries often rediscover the same repository/context and re-spend tokens.

## Why it matters now
Recent public issues across Claude Code, Kimi CLI, Hermes Agent, and Codex-adjacent workflows report quota-cutoff state loss, resumed work repeating expensive exploration, and missing pre-call budget boundaries.

## Affected users
Developers using background agents, swarms, deep-research workflows, long-running coding agents, CI agents, and platform builders implementing per-run budgets.

## Current public evidence
### Observed evidence
1. Claude Code issue #83412 (2026-08-02) reports subagents dying on spend/usage limits without partial output or recoverable handoff. https://github.com/anthropics/claude-code/issues/83412
2. Kimi CLI issue #2578 (2026-08-02) reports quota/timeout failures leaving partial workspace state while resume repeats repository discovery and verification, re-spending tokens. https://github.com/MoonshotAI/kimi-cli/issues/2578
3. Claude Code issue #79958 (2026-07-21) reports deep-research runs losing verified claims after spend-limit interruption and restarting fan-out from zero. https://github.com/anthropics/claude-code/issues/79958
4. Hermes Agent issue #54153 proposes a save-state-and-yield warning before max iterations because workers otherwise hit the wall without recoverable checkpoints. https://github.com/NousResearch/hermes-agent/issues/54153
5. OpenAI Codex discussion #40148 (2026-08-22) demonstrates a pre-call invariant: serialized request plus response allowance must fit remaining budget, reserving enough budget for deterministic exhaustion reporting. https://github.com/openai/codex/discussions/40148
6. GitHub Copilot budget documentation describes hard stops when user-level budgets are exhausted, showing that upstream budget enforcement can legitimately terminate agent work. https://docs.github.com/en/copilot/concepts/billing/budgets-for-usage-based-billing

### Interpretation
The core engineering gap is not simply insufficient budget. It is missing lifecycle semantics around budget pressure. A robust agent needs (a) pre-call admission, (b) a protected checkpoint reserve, (c) durable structured partial state, and (d) a terminal state distinct from `completed`.

## Existing approaches
Provider/account hard limits, per-session token caps, max iterations, warning thresholds, dashboards, stop-usage budget controls, manual summaries, and session resume.

## Remaining limitations
- Hard limits can fire after useful work has accumulated but before it is serialized into a handoff.
- Iteration counts do not bound the size/cost of the next request.
- Session-only resume state is lost across process/session boundaries.
- A natural-language partial summary may be mistaken for completion.
- Retrying without durable checkpoints repeats retrieval, repository scans, tool calls, and verification.
- Cost telemetry can be delayed or provider-specific.

## Root-cause analysis
1. No reserve is protected for checkpoint serialization.
2. Next-call cost is not estimated before dispatch.
3. Partial progress is transcript-local rather than durable/task-scoped.
4. Terminal status lacks an explicit `partial_budget_exhausted` state.
5. Parent orchestration cannot distinguish budget failure from tool/model failure.
6. Resume logic lacks an idempotent checkpoint key and restarts discovery.

## Improvement opportunity
Introduce a deterministic pre-call budget gate with soft and hard pressure thresholds. At soft pressure, require a durable checkpoint before further work. Reserve enough tokens for checkpoint/final status. If the next call would violate the reserve, stop before provider dispatch and emit `partial_budget_exhausted` with goal, facts, completed steps, next step, verification status, and resumable state.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/83412
- https://github.com/MoonshotAI/kimi-cli/issues/2578
- https://github.com/anthropics/claude-code/issues/79958
- https://github.com/NousResearch/hermes-agent/issues/54153
- https://github.com/openai/codex/discussions/40148
- https://docs.github.com/en/copilot/concepts/billing/budgets-for-usage-based-billing
