# Research — Token Burn Circuit Breaker

## Topic
Token Burn Circuit Breaker with per-source attribution.

## Category
Token

## Problem
Long-running AI agents can consume extreme amounts of tokens when retries, subagents, hooks, workflow restarts, or repeated tool calls continue without a hard runtime budget. Warnings and UI counters are insufficient because they do not stop an unattended loop.

## Why it matters now
Recent 2026 reports show this is not theoretical. A Claude Code workflow issue reported repeated watchdog restarts that burned roughly 580k tokens with zero progress. A separate Claude Code feature request asks for runtime-enforced spend caps with per-source attribution because existing visibility does not stop runaway usage. OpenAI Codex issue #36503 documented an unbounded blocked-state retry loop that ran for about 8 hours and recorded hundreds of millions of session tokens, mostly cached.

## Affected users
Developers running coding agents, autonomous workflows, CI agents, multi-agent systems, and platform teams paying per token or operating under rate/session limits.

## Current public evidence
### Observed evidence
1. Anthropic Claude Code issue #85206 (opened 2026-08-09) reports a workflow watchdog repeatedly killing an actively working subagent and restarting from scratch, with about 580k tokens burned and no progress: https://github.com/anthropics/claude-code/issues/85206
2. Anthropic Claude Code issue #85422 (opened 2026-08-10) requests a runtime token-burn circuit breaker with source attribution, explicitly noting that visibility does not enforce a ceiling: https://github.com/anthropics/claude-code/issues/85422
3. OpenAI Codex issue #36503 (August 2026) reports an unattended blocked-state retry loop lasting roughly 8 hours with 2,514 repeated update attempts and an extremely large session-token total: https://github.com/openai/codex/issues/36503
4. Claude Code issue #84750 (opened 2026-08-07) reports abnormal token-consumption regression and faster session exhaustion across routine workflows: https://github.com/anthropics/claude-code/issues/84750

## Existing approaches
- Provider/session usage limits.
- UI token counters and cost dashboards.
- Per-tool or per-turn retry caps.
- Context compaction.
- Manual cancellation.
- Agent-specific loop guardrails.

## Remaining limitations
Provider limits are usually account/session-level, not task-level. UI counters are observational rather than preventive. Retry caps can exist independently in many components and still combine into expensive cross-component loops. Compaction reduces context size but does not stop repeated work. Manual cancellation fails for unattended jobs.

## Root-cause analysis
- No shared budget spanning parent agent, subagents, hooks, retries, and tool-driven model calls.
- Cost attribution is often aggregated after execution rather than emitted at each consumption event.
- Progress and spending are tracked separately, so systems cannot detect high spend with low progress.
- Retry logic is distributed across orchestration layers.
- Cached tokens may be discounted but can still hide enormous repeated-work volume.

## Improvement opportunity
Add a runtime-enforced hierarchical budget ledger. Every model call records input, output, cached, estimated cost, source, task, retry lineage, and progress checkpoint. The guard checks hard ceilings before new calls and trips when absolute, velocity, retry, or no-progress thresholds are crossed. Child budgets are reserved from parents so parallel subagents cannot oversubscribe the parent budget.

## Interpretation
The issues demonstrate recurring real-world failure modes across multiple agent implementations. They do not imply a specific provider's token accounting is always wrong; the reusable engineering gap is lack of deterministic task-level enforcement and attribution.

## Proposed solution
A provider-neutral budget policy, event schema, deterministic watchdog, workflow rules, and verification harness that can be integrated into any agent runtime.

## Goal
Prevent runaway token spend without removing context needed for correctness.

## Metrics
- tokens/task and estimated cost/task
- token velocity per minute
- retry tokens / total tokens
- no-progress tokens
- budget utilization by source
- hard-cap violations after enforcement: 0
- quality/regression score compared with baseline

## Trigger
Before every model call, after every model response, on retry/subagent spawn, and at progress checkpoints.

## Inputs
Usage events, provider/model pricing config, task budget, source/lineage identifiers, retry counters, progress markers.

## Outputs
allow/warn/stop decision, remaining budget, attribution summary, reason code, audit event.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/85206
- https://github.com/anthropics/claude-code/issues/85422
- https://github.com/anthropics/claude-code/issues/84750
- https://github.com/openai/codex/issues/36503
