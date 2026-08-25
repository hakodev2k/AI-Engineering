# Research

## Topic
Browser-agent observation yield and latency attribution

## Category
Performance

## Problem
Browser-capable coding agents may repeatedly observe page state, screenshots, DOM or browser metadata while making little useful progress. The result is high end-to-end latency, large context growth and many model/tool turns even when individual browser operations are functional.

## Why it matters now
Three recent Codex signals converge on the same observability gap. On **2026-08-17**, Codex issue #39066 reported browser tasks that were laggy and token-heavy across Medium and xhigh reasoning effort, with many browser interactions but low progress. On **2026-08-08**, issue #37606 reported a fresh normal development thread reaching 232k/258k context and triggering compaction while repeated tool outputs accumulated. On **2026-08-22**, issue #40087 requested per-tool timing that separates model/inference, tool execution and Codex overhead because a command can finish quickly while the end-to-end turn remains slow.

## Affected users
Developers using browser-assisted coding/research agents, QA automation teams, agent-platform builders, and teams paying for tool-heavy model loops.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #39066, opened 2026-08-17: browser/Chrome tasks are described as extremely laggy and token-heavy, with repeated browser/tool interactions and little proportional progress. https://github.com/openai/codex/issues/39066
2. OpenAI Codex issue #37606, opened 2026-08-08: fresh GPT-5.6 Sol development session reached 232k/258k context with early compaction; report explicitly asks for component-level context attribution including browser data, screenshots and tool outputs. https://github.com/openai/codex/issues/37606
3. OpenAI Codex issue #40087, opened 2026-08-22: requests per-tool timing and separation of model/inference, actual tool execution, and Codex overhead/waiting. https://github.com/openai/codex/issues/40087

### Interpretation
The practical bottleneck is not always browser RPC latency. A browser loop can be inefficient because unchanged state is re-observed, model turns are re-entered too often, rich state is retained in context, or orchestration adds delay between a tool completing and the next useful action. Existing total latency and total token counters cannot identify which mechanism dominates.

### Proposed solution
Use progress-normalized browser telemetry: fingerprint normalized observation state; mark meaningful progress separately; attribute latency by model/tool/other components; calculate repeated-state observations and tokens per progress event; then optimize against a fixed workload.

## Existing approaches
- Automatic context compaction and tool-output truncation.
- Lower reasoning effort or manual instruction to reduce browsing.
- Generic tool timers and browser automation traces.
- Caching or avoiding repeated reads when manually recognized.
- Browser screenshots/DOM snapshots for correctness.

## Remaining limitations
- Total tool-call count does not distinguish productive from repeated calls.
- Tool timing alone cannot identify post-tool/model overhead.
- Compaction can reduce current context while triggering later re-observation.
- Screenshots and page snapshots may be necessary for correctness, so blindly dropping them is unsafe.
- Browser state may be dynamic, making naive byte equality too strict or too noisy.

## Root-cause analysis
1. Observation is treated as inherently useful rather than measured by information/progress yield.
2. Stable browser state lacks a compact fingerprint usable for deduplication.
3. Model, tool and orchestration latency are aggregated.
4. Context pressure and browser interaction metrics are tracked separately.
5. Stop/re-observe policies are not tied to measurable state change.

## Improvement opportunity
Measure observation yield before changing behavior. Suppress or summarize only demonstrably duplicate stable-state observations; preserve required correctness checks and security prompts.

## Goal
Reduce browser-assisted end-to-end latency and tool/model interactions per completed task while maintaining equivalent task success and verification coverage.

## Metrics
Duplicate-state observation rate; observations/progress event; tokens/progress event; model latency; tool latency; unattributed latency; compactions/run; post-compaction repeated observations; task success rate.

## Trigger
Browser-assisted task exceeds latency/token budget, repeats page observations, or compacts unexpectedly early.

## Inputs
Timestamped JSONL trace with event type, normalized state hash, latency and token values where available, plus explicit progress markers.

## Outputs
Machine-readable performance summary and threshold pass/fail exit status.

## Relevant sources
- https://github.com/openai/codex/issues/39066
- https://github.com/openai/codex/issues/37606
- https://github.com/openai/codex/issues/40087
