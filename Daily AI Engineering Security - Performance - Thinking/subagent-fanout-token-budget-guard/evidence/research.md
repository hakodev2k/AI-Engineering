# Research — Subagent Fan-out Token Budget Guard

**Category:** Token  
**Research date:** 2026-08-27 (UTC+7)

## Topic
Multi-agent/subagent fan-out can multiply fixed context overhead and retry cost, consuming more tokens, money, latency, and shared inference capacity than a single or grouped agent path.

## Problem
Agent orchestrators often decide to spawn subagents from task shape without measuring the fixed bootstrap context each child must load. Every child may pay for instructions, repository guidance, tools, skills, inherited history, retrieval, and subsequent retries. Small delegated tasks can therefore have poor useful-work-to-bootstrap ratios, while unattended forks can repeatedly resend large inherited context.

## Why it matters now
Recent August 2026 reports independently document fixed per-subagent overhead, million-token unattended review loops, and requests for cumulative session token caps. The recurring gap is not merely provider pricing; it is missing orchestration-level admission control based on measured token economics.

## Affected users
Developers using multi-agent coding/research workflows, platform builders, teams with provider quotas, local-model operators sharing GPU capacity, and agent-framework maintainers.

## Current public evidence

### Observed evidence
1. OpenAI Codex issue #39808, opened August 20, 2026, reports that subagent fan-out can increase usage because each child pays fixed system/developer instructions, repository instructions, tool schemas, skills, environment context, delegated task context, inherited history, and tool-result overhead. It requests per-agent usage visibility and warnings when fan-out is likely to cost more than staying in one thread.  
   https://github.com/openai/codex/issues/39808
2. Hermes Agent issue #90446, opened August 20, 2026, documents a background review fork that inherited roughly 130K tokens and retried an unwinnable tool-refusal loop: 11 API calls, 1,405,754 input tokens, 11,604 output tokens, and no result. The issue proposes a circuit breaker and token budget.  
   https://github.com/NousResearch/hermes-agent/issues/90446
3. Hermes Agent issue #91713, opened August 21, 2026, reports a single session burning 18.7M tokens over five hours and 106 API calls, motivating a cumulative per-session token budget because context/window limits do not catch many small calls whose aggregate cost is large.  
   https://github.com/NousResearch/hermes-agent/issues/91713

### Interpretation
The practical root problem is missing budget-aware spawn admission. Provider quotas and context-window limits are coarse backstops; they do not tell an orchestrator whether another subagent is economically justified for this specific task, nor do they stop aggregate small-call runaway behavior early.

## Existing approaches
- Smaller/cheaper models for subagents.
- Prompt caching.
- Context compaction.
- Global provider quotas/rate limits.
- Fixed maximum iteration counts.
- Manual guidance to avoid excessive fan-out.

## Remaining limitations
- Cheaper models still pay repeated bootstrap/context overhead.
- Prompt caching does not eliminate user-visible allowance usage in all systems and does not guarantee low latency.
- Max iterations bound count, not aggregate token cost.
- Context-window limits catch prompt size, not cumulative session burn.
- Manual fan-out decisions lack measured break-even thresholds.
- A child can inherit far more context than its task's expected useful work justifies.

## Root-cause analysis
1. Spawn decisions are usually task-semantic rather than token-economic.
2. Fixed per-agent bootstrap cost is invisible or unmeasured.
3. Orchestrators do not compare projected child cost with serial/grouped alternatives.
4. Cumulative parent+child budget accounting is incomplete.
5. Retry loops can repeatedly resend inherited context.
6. No minimum useful-work-to-bootstrap ratio is enforced.

## Improvement opportunity
Add a deterministic pre-spawn budget gate fed by measured historical bootstrap/input/output tokens. It computes a conservative projected cost for proposed children, checks remaining session budget, evaluates useful-work-to-bootstrap ratio, and recommends `fanout`, `group`, `serial`, or `block`. Pair it with a cumulative session budget and bounded retry policy. The gate never removes correctness-critical context; it changes orchestration topology instead.

## Goal
Reduce tokens/task, cost/task, and latency without reducing task quality or dropping required context.

## Metrics
- Total tokens/task and tokens/subagent.
- Fixed bootstrap tokens/subagent.
- Useful-work-to-bootstrap ratio.
- Parent+child cumulative tokens.
- Spawned-vs-rejected child count.
- Cost/task and latency/task.
- Quality/regression rate.

## Trigger
Before spawning one or more subagents, and after each child completion/retry when cumulative budget changes materially.

## Inputs
Historical usage records, proposed child tasks, estimated useful-work tokens, inherited-context tokens, remaining session budget, retry allowance.

## Outputs
Measured bootstrap baseline, projected fan-out cost, remaining budget, topology recommendation, reason codes, and verification report.

## Relevant sources
- OpenAI Codex #39808: https://github.com/openai/codex/issues/39808
- Hermes Agent #90446: https://github.com/NousResearch/hermes-agent/issues/90446
- Hermes Agent #91713: https://github.com/NousResearch/hermes-agent/issues/91713
