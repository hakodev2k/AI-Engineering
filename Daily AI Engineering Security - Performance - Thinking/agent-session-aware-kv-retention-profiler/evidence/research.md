# Research

## Topic
Agent Session-Aware KV Retention Profiler

## Category
Performance

## Problem
Long-running and multi-agent workloads repeatedly reuse enormous prompt prefixes, but inference engines do not always know which idle prefixes will be needed again after a tool wait, subagent pause or checkpoint. Generic replacement can evict high-value session state, forcing expensive re-prefill and increasing time-to-first-token (TTFT), GPU work and cost.

## Why it matters now
Agentic traces now commonly contain tens to hundreds of thousands of input tokens with small per-turn deltas. Recent vLLM engineering work shows both the scale of the opportunity and a remaining information gap between agent runtimes and inference cache managers.

## Affected users
Self-hosted LLM platform teams, coding-agent builders, multi-agent orchestrators, inference engineers and teams serving long-context tool-using agents.

## Current public evidence
### Observed evidence
1. vLLM/Mooncake, 2026-05-06: on 610 Codex/GPT-5.4 SWE-bench Pro traces, median sessions had 33 turns; context grew from about 12K to 80K tokens, average input:output ratio was about 131:1 and measured cache hit rate was 94.2%. Their distributed KV-cache integration reported 3.8x throughput, 46x lower TTFT and 8.6x lower end-to-end latency on realistic agentic traces.
2. vLLM RFC #52113, opened 2026-08-13: agent applications know lifecycle facts the inference engine does not—for example a child is waiting for a tool and likely to resume, a branch has completed, or a suspended branch will return. The RFC proposes session-aware cache hints because ordinary replacement cannot distinguish temporarily idle valuable context from dead prefixes.
3. vLLM, 2026-07-27: Kimi K3 support added interval-based and Marconi-style selective retention. The post explains that caching every state is prohibitively expensive while caching too sparsely causes large suffix recomputation; prompt boundaries and second-hit evidence are used to balance retention.
4. vLLM, 2026-08-07: long-context agent traces range from 64K to 1M tokens; duplicated KV cache under standard tensor parallelism limits concurrency, motivating Decode Context Parallelism.
5. Anthropic, 2026-04-30: Claude Code describes prompt caching as fundamental to long-running agents and treats low cache-hit rate seriously enough to alert/declare incidents.

### Interpretation
Prefix caching is established, but lifecycle-aware retention is still emerging. The practical engineering gap is measurement and policy selection: teams need to identify avoidable cache misses around agent lifecycle transitions and determine whether TTL/protect/offload/release hints improve TTFT and throughput without exhausting cache capacity.

## Existing approaches
Automatic Prefix Caching uses content hashes and replacement policies. Distributed KV stores extend capacity. vLLM supports retention policies for hybrid/linear-attention models, DCP reduces KV duplication, and RFC #52113 proposes optional agent lifecycle hints. Application frameworks also structure stable prompt prefixes to maximize cache reuse.

## Remaining limitations
- Generic cache managers lack semantic knowledge of agent lifecycle.
- Protecting everything wastes cache capacity and can harm other requests.
- Fixed TTLs can retain dead branches or expire active ones.
- Cache-hit rate alone can hide whether misses happen at expensive lifecycle boundaries.
- Application teams may not correlate agent events, reused-prefix size and TTFT in one trace.
- Improvements must be workload-specific and measured; published gains from one deployment cannot be assumed elsewhere.

## Root-cause analysis
1. Information is split: orchestrator knows future reuse probability; inference engine knows cache pressure.
2. Lifecycle events are often absent from serving telemetry.
3. Cache metrics are aggregated rather than correlated per session/turn.
4. Retention policies optimize recency/frequency without explicit business value such as recompute tokens avoided.
5. Teams tune cache policy without a repeatable before/after benchmark.

## Improvement opportunity
Create a provider-neutral profiler that joins per-turn session/lifecycle events with prefix-cache observations, quantifies avoidable recomputation, identifies high-value wait/resume boundaries, proposes bounded retention hints, and compares baseline versus candidate traces. The package does not claim automatic speedup; it requires measured before/after evidence.

## Relevant sources
- vLLM, "Serving Agentic Workloads at Scale with vLLM x Mooncake", 2026-05-06: https://vllm.ai/blog/2026-05-06-mooncake-store
- vLLM RFC #52113, "Session-Aware KV Cache Hints for Agentic Workloads", 2026-08-13: https://github.com/vllm-project/vllm/issues/52113
- vLLM, "Kimi K3 Is Here: Efficient Day-0 Support on vLLM", 2026-07-27: https://vllm-project.github.io/2026/07/27/k3.html
- vLLM, "Efficient Decode Context Parallelism with vLLM for Long Context Workloads", 2026-08-07: https://vllm.ai/blog/2026-08-07-decode-context-parallelism
- Anthropic, "Lessons from building Claude Code: Prompt caching is everything", 2026-04-30: https://claude.com/blog/lessons-from-building-claude-code-prompt-caching-is-everything
