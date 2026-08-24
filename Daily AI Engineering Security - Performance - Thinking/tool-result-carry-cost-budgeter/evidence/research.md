# Research — Tool Result Carry-Cost Budgeter

## Topic
Position-weighted cumulative token cost of tool results retained across later model turns.

## Category
Token

## Problem
Agent teams often measure a tool result once—its immediate token size—while the same result remains in conversation history and is resent on later model calls. A moderate payload inserted early can therefore cost more than a much larger payload inserted near task completion. Per-result truncation and total-context snapshots do not expose this cumulative 'carry cost.'

## Why it matters now
Long-running agents increasingly combine many tools, large API responses and repeated model turns. Current platform guidance explicitly recommends context editing because old `tool_result` blocks otherwise remain in history. Public framework issues report unbounded session growth and exploding token cost, while recent cost-analysis work highlights that early tool payloads are repeatedly repaid on subsequent turns.

## Affected users
- AI-agent platform builders and orchestration teams.
- Developers operating tool-heavy coding/research agents.
- FinOps/performance teams tracking tokens/task and latency.
- Teams using MCP/API tools that return verbose JSON, logs, schemas or documents.

## Current public evidence

### Observed evidence
1. **Anthropic — Manage tool context, current documentation accessed 2026-08-24.** The docs state that accumulated `tool_result` blocks consume context; context editing removes old tool results, while programmatic tool calling avoids intermediate results entering conversation history. Source: https://platform.claude.com/docs/en/agents-and-tools/tool-use/manage-tool-context
2. **OpenClaw issue #6650, opened 2026-02-01.** The report describes session files growing unbounded, entire schemas/tool outputs being persisted, context filling, token costs exploding, and model performance degrading. Source: https://github.com/openclaw/openclaw/issues/6650
3. **Capsera — Tool result bloat, current 2026 guidance.** The analysis describes the multiplier explicitly: a tool payload entering history is paid again on later turns, so its effective cost depends on size and position in the session. Source: https://www.capsera.ai/cost-defects/tool-result-bloat
4. **Production Notes — Prompt Caching for AI Agents Is an Architecture Problem, 2026-08-02.** Reports production agent cache misses caused by moving tool definitions, copied observations and inherited investigation context, reinforcing that conversation shape—not just raw per-call tokens—drives effective cost. Source: https://productionnotes.dev/blog/prompt-caching-ai-agents/

## Interpretation
The actionable unit is not only `tool_result_tokens`. It is approximately `tool_result_tokens × number of later model requests that still carry the result`, adjusted for explicit eviction/compaction and provider cache economics. This position-weighted metric identifies which payloads should be summarized, sliced, referenced out-of-band or evicted first.

## Existing approaches
- Per-tool output size caps and truncation.
- Total context-window monitoring.
- Context editing/compaction.
- Prompt caching.
- Programmatic tool calling.
- Returning selected API fields rather than complete payloads.

## Remaining limitations
- A fixed per-result cap treats early and late results as equally expensive.
- Context-window snapshots show occupancy but not cumulative re-send cost across the task.
- Compaction may happen after a payload has already been paid for many times.
- Prompt caching reduces billed cost when it hits but does not remove context occupancy and can fail when prefixes change.
- Teams often lack a trace-level ranking that shows which historical tool result created the most downstream token burden.

## Root-cause analysis
1. Tool adapters return program-oriented payloads rather than model-oriented evidence slices.
2. Orchestrators append results to durable message history by default.
3. Observability records request token totals but not provenance from individual historical tool results.
4. Token budgets are usually enforced per request, not over a task's cumulative lifetime.
5. Eviction decisions are based on age/size rather than measured future carry cost and task relevance.

## Improvement opportunity
Add trace-level carry-cost attribution before changing prompts or tools. Rank each tool result by cumulative retained-turn cost, then apply relevance-preserving field selection, out-of-band artifact references, programmatic tool chaining or earlier eviction to the highest contributors. Compare before/after traces while holding task quality constant.

## Proposed solution
This package provides an executable profiler that consumes model-turn/tool-result trace events, calculates direct tokens and cumulative carry tokens until eviction/end-of-trace, reports the highest contributors, and enforces configurable task budgets. The workflow requires baseline measurement and quality regression checks before claiming savings.

## Goal
Reduce tokens/task, cost/task and latency by removing repeated historical payload carriage without deleting context required for correctness.

## Metrics
- direct tool-result tokens/task;
- cumulative carry tokens/task;
- carry amplification ratio (`carry/direct`);
- top-result share of carry tokens;
- model turns carrying stale tool results;
- tokens/task, latency/task and result-quality regression rate.

## Trigger
Tool-heavy agent sessions with rising input tokens, context pressure, cost regressions, slow long-running tasks, or large early API/tool responses.

## Inputs
JSONL trace containing `model_turn`, `tool_result`, and optional `evict` events; budget config; task-quality evidence.

## Outputs
Ranked carry-cost report, budget pass/fail, optimization candidates and before/after comparison evidence.

## Relevant sources
- https://platform.claude.com/docs/en/agents-and-tools/tool-use/manage-tool-context
- https://github.com/openclaw/openclaw/issues/6650
- https://www.capsera.ai/cost-defects/tool-result-bloat
- https://productionnotes.dev/blog/prompt-caching-ai-agents/

## Verification
**Implemented** means trace attribution and budgets are wired in. **Measured** means baseline and optimized traces were captured. **Verified** means cumulative carry tokens decrease while task-quality checks and required-context tests remain equal or better.