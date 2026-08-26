# Research — Agent Idle-Poll Context Remeter Guard

**Topic:** repeated model-visible control polling re-meters large agent context  
**Category:** Token  
**Research date:** 2026-08-26 (UTC+7)

## Problem
Agent orchestrators often turn `wait`, `wait_agent`, `list_agents`, or status checks into model turns. When the thread already contains a large context, even a tiny control result can cause the entire prompt prefix to be processed or cache-read again. Tool outputs retained in history and lost deduplication state after compaction can amplify this further.

## Why it matters now
Current August 2026 issue reports show extreme token amplification in real long-running agent sessions, including thousands of no-op wait-family turns and repeated file/tool outputs.

## Affected users
Developers using long-running coding agents, multi-agent workflows, agent-platform teams, users with token/usage caps, and operators paying for cache reads or uncached prefix rebuilds.

## Current public evidence
### Observed evidence
1. **OpenAI Codex issue #37299**, opened August 6, 2026, reports long-running Desktop orchestration where 75% of model-visible tool calls were `wait`/`wait_agent`/`list_agents`, 83% of `wait_agent` calls timed out, and each small poll re-metered about 137–141k input tokens with 97–98% cached context. One reported workload consumed about 290M tokens in a day while stale subagent state kept polling alive.  
   https://github.com/openai/codex/issues/37299
2. **Hermes Agent issue #84857**, opened August 12, 2026, reports tool outputs being re-sent every turn and `read_file` deduplication state being lost across context compaction. The report measured cache-read/input ratios around 15–18× across sessions and repeated reinjection of large files.  
   https://github.com/NousResearch/hermes-agent/issues/84857
3. **VS Code issue #321551**, opened June 16, 2026, reports prompt-cache expiration during active long-running agent operations when gaps exceed roughly five minutes, making the next turn pay for the full accumulated context. The issue specifically cites long builds/tests and terminal waits.  
   https://github.com/microsoft/vscode/issues/321551
4. **Anthropic prompt caching documentation** states the default cache lifetime is five minutes and that the full prefix up to the cache breakpoint is reused; cached tool results and prior messages still count as cache reads. This explains why cache hits reduce cost/latency but do not make repeated no-op model turns free.  
   https://platform.claude.com/docs/en/build-with-claude/prompt-caching

### Interpretation
The recurring issue is an orchestration/context-accounting mismatch: control-plane events are represented as expensive model-plane turns. Prompt caching addresses recomputation cost, not the number of turns. Context compression helps size but can break dedup state if lifecycle metadata is not durable.

## Existing approaches
- Prompt/prefix caching.
- Context compression/compaction.
- Tool-output truncation and eviction.
- Fixed polling intervals and timeouts.
- Agent lifecycle/status APIs.
- Deduplication of file reads and repeated tool outputs.

## Remaining limitations
- Cached tokens are still processed/metered and can dominate usage at high poll frequency.
- Fixed short polling intervals ignore context size and expected task duration.
- A timed-out `wait` conveys no new state but may still trigger a full model turn.
- Stale `running` state can sustain loops indefinitely.
- Dedup state stored only in transient agent objects can disappear after compaction/reconstruction.
- Long gaps can expire provider caches, causing a full prefix rebuild on the next turn.

## Root-cause analysis
1. Control-plane polling is coupled to model inference.
2. Poll interval is not proportional to context/token cost or expected work duration.
3. Stale-agent detection lacks bounded lifecycle rules.
4. Tool-output identity/dedup state is not durable across compaction.
5. Systems optimize cache hit rate but do not optimize tokens per useful state transition.

## Improvement opportunity
Add a deterministic trace profiler and pre-poll gate. Measure baseline token amplification, classify no-op control turns, use backoff based on consecutive no-change polls, cap model-visible polls per task, terminate only provably stale agents, and maintain durable hashes for tool-output dedup. Require quality-equivalent before/after workloads.

## Relevant sources
- Codex #37299: https://github.com/openai/codex/issues/37299
- Hermes Agent #84857: https://github.com/NousResearch/hermes-agent/issues/84857
- VS Code #321551: https://github.com/microsoft/vscode/issues/321551
- Anthropic prompt caching: https://platform.claude.com/docs/en/build-with-claude/prompt-caching
