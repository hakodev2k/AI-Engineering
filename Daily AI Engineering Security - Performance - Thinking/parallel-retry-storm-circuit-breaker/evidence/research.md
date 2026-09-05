# Research Evidence

## Topic
Parallel Retry Storm Circuit Breaker

## Category
Performance

## Problem
Parallel agent fan-out can amplify transient 429/5xx failures into retry storms, while other frameworks fail too aggressively. A useful orchestration layer needs bounded, provider-aware retry plus adaptive concurrency and partial-result preservation rather than either unlimited retry or immediate total failure.

## Why it matters now
Current 2026 issue reports show expensive and reproducible failures. Claude Code issue #72672 reports a Workflow `parallel()` run that hit a 1000-agent cap, consumed 8,641,786 subagent tokens in 226 seconds, and returned zero usable output after external API rate limiting. Claude Code #68968 reports 5–6-way fan-out triggering server-side 429s, losing an entire run after roughly 234K tokens and 53 tool uses; sequential execution avoided the 429s. OpenCode #37076 reports an infinite Azure 429 retry loop caused by `Retry-After: 0`, producing roughly 700 API calls in about five seconds. TradingAgents #1091 shows the opposite failure: a fixed SDK retry budget can abort long multi-agent runs on transient 429s when frameworks do not expose retry configuration.

## Affected users
Multi-agent platform builders, coding-agent users, workflow authors, teams using rate-limited model/API providers, and systems that parallelize MCP/tool/API work.

## Current public evidence

### Observed evidence
1. anthropics/claude-code #72672: parallel fan-out plus rate limits produced a runaway retry storm, 1000-agent cap, 8.6M tokens, zero output, and no visible adaptive backoff/circuit breaker.
2. anthropics/claude-code #68968: burst fan-out repeatedly hit account-level 429s; the same task succeeded sequentially, implicating concurrency rather than total account quota; partial work was not preserved.
3. anomalyco/opencode #37076: session retry had no maximum and honored zero-delay retry headers, causing an extremely tight retry loop.
4. TauricResearch/TradingAgents #1091: transient 429s abort long runs because provider retry budget is not configurable through the framework, demonstrating that simply lowering retries is also insufficient.

### Interpretation
Retry correctness is a control-system problem: retryability, delay, global attempt budget, concurrency, shared provider pressure, and salvageable partial results must be coordinated. Per-call exponential backoff alone cannot stop synchronized parallel retries, and a fixed small retry budget may under-recover from transient throttling.

### Proposed solution
Use a workflow-level circuit breaker with bounded global retry budget, minimum jittered delay, `Retry-After` handling with a nonzero floor, adaptive concurrency reduction, shared provider cooldown, and partial-result checkpoints. Reopen concurrency only after successful probes.

## Existing approaches
SDK exponential backoff; per-request retry counts; `Retry-After`; provider cooldown; sequential fallback; global iteration caps; hard agent caps; queueing; manual rerun.

## Remaining limitations
Retry controls are often isolated per call, concurrency is not reduced after shared throttling, zero-delay headers can create hot loops, retry budgets are hidden or fixed, and failed fan-outs may discard successful partial work. Hard total-agent caps limit damage but can still permit very high waste before termination.

## Root-cause analysis
- No shared retry budget across parallel branches.
- Retry state is scoped to individual calls instead of provider/workflow pressure.
- Concurrency remains unchanged after correlated 429s.
- Delay logic lacks a minimum floor and jitter.
- No circuit state (closed/open/half-open) for external dependencies.
- Partial successful outputs are not checkpointed before aggregate failure.
- Framework retry configuration does not consistently expose provider knobs.

## Improvement opportunity
Make retry behavior observable and deterministic at orchestration level: classify retryable errors, enforce total budgets, adapt concurrency, checkpoint partial results, and measure useful output per token/tool call. Success is fewer wasted calls/tokens and higher recovered-run rate without materially increasing latency for healthy providers.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/72672
- https://github.com/anthropics/claude-code/issues/68968
- https://github.com/anomalyco/opencode/issues/37076
- https://github.com/TauricResearch/TradingAgents/issues/1091
- https://github.com/NousResearch/hermes-agent/issues/49031
