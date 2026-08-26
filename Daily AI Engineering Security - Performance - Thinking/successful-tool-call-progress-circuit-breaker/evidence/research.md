# Research — Successful Tool-Call Progress Circuit Breaker

## Topic
Repeated successful tool calls that do not add information or task progress.

## Category
Performance

## Problem
An agent can receive a successful tool result and still invoke the same tool with identical or equivalent arguments multiple times. This increases latency, model usage, tool traffic, and context growth; mutating tools can amplify operational risk.

## Why it matters now
### Observed evidence
1. **Hermes Agent #89069**, opened **2026-08-18**, reports successful terminal/tool calls repeated **3–20+ times** with identical parameters and explicitly identifies missing deduplication/circuit breaking.  
   https://github.com/NousResearch/hermes-agent/issues/89069
2. **Vercel AI #17606**, opened **2026-07-21**, requests a repeated-tool-call stop condition because step caps are blunt while unrestricted loops can run indefinitely.  
   https://github.com/vercel/ai/issues/17606
3. **AgentSysBench (arXiv:2608.15127)**, published **2026-08-15**, reports heavy redundant search/fetch work in production agent traces; tool-result caching removed **35.2%** of redundant search calls and saved **19.3%** of aggregate search latency in one exploration.  
   https://arxiv.org/abs/2608.15127

## Affected users
Agent framework maintainers, coding-agent users, tool providers, platform teams, and teams paying per model/tool request.

## Existing approaches
Step limits, model-generated stop decisions, warning prompts, result caches, manual interruption, and framework retry budgets.

## Remaining limitations
- Step limits count work rather than progress.
- Caching can avoid execution but still consume model steps/tokens.
- Argument string equality misses canonical-equivalent JSON.
- Legitimate polling may repeat intentionally.
- Mutating tools cannot be treated like read-only tools.

## Root-cause analysis
1. Loop controllers track step count rather than information gain.
2. Tool identity is not normalized.
3. Successful results are not consistently fingerprinted.
4. Tool idempotency and side-effect metadata are often absent.
5. Deterministic repetition is left to model judgment.

## Interpretation
This is an orchestration-level progress-accounting gap, not merely a prompting problem.

## Proposed solution / Improvement opportunity
Use a deterministic pre-execution gate that canonicalizes calls, fingerprints prior successful results, distinguishes read-only/idempotent/mutating tools, replays only safe cached results, and blocks repeated no-progress calls after bounded thresholds.

## Goal
Reduce redundant successful calls while preserving legitimate repeated checks.

## Metrics
Calls/task, repeated-success rate, tokens/task, latency, completion rate, false-block rate, duplicate side-effect count.

## Trigger
Repeated successful call fingerprints or abnormal tool/model-call overhead.

## Inputs
Tool trace, task goal, arguments, results, tool side-effect class.

## Outputs
Execute/replay/block decision with measurable reason codes.

## Relevant sources
- https://github.com/NousResearch/hermes-agent/issues/89069
- https://github.com/vercel/ai/issues/17606
- https://arxiv.org/abs/2608.15127
