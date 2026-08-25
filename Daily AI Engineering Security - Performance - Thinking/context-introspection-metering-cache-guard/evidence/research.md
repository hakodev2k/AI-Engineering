# Research — Context Introspection Metering Cache Guard

## Topic
Detect and bound hidden token-count/context-introspection API cost in agent runtimes.

## Category
Token

## Problem
Methods that look like local context inspection can fan out into real model/token-count API calls, sometimes once per tool, skill, memory file, agent, or context item. When those calls are uncached or omitted from normal run telemetry, a UI context gauge or per-turn introspection step can generate substantial invisible token usage, latency, and cost.

## Why it matters now
Fresh August 2026 reports show this exact failure in Claude Agent SDK/Claude Code on Bedrock: context usage calls can trigger many billed inference requests and large uncached input-token volumes per invocation. Other current usage-accounting reports show local telemetry materially undercounting provider-side API usage, demonstrating that cost controls based only on the normal agent message stream are incomplete.

## Affected users
- Agent SDK users rendering context/token gauges every turn.
- Bedrock or other provider deployments where token counting may fall back to billable inference.
- Platforms with large tool/skill/MCP catalogs.
- FinOps/platform teams relying on SDK-reported usage for budgets.
- Multi-agent systems that repeat introspection independently per worker.

## Current public evidence

### Observed evidence
1. `anthropics/claude-agent-sdk-python` issue #1159, opened 2026-08-03, reports `get_context_usage()` making non-streaming requests per registered item, uncached, with calls absent from the SDK message stream/usage blocks. The reporter discovered them via provider invocation logs. https://github.com/anthropics/claude-agent-sdk-python/issues/1159
2. `anthropics/claude-code` issue #86628, opened August 2026, reports `getContextUsage()` on Bedrock application inference profiles fanning out one billed Haiku inference per context item; a single call reportedly produced 26–40 billed inferences and roughly 110k–170k uncached input tokens, repeating when clients render a context bar each turn. https://github.com/anthropics/claude-code/issues/86628
3. `NousResearch/hermes-agent` issue #87450, opened 2026-08-16, reports local token usage tracking covering only 44% of provider-side billed cost in the examined period, with lost/background/asynchronous usage paths among cited causes. https://github.com/NousResearch/hermes-agent/issues/87450
4. Anthropic's token-counting documentation explicitly exposes token counting as a request endpoint for structured messages/tools, confirming that counting may be a remote operation rather than free local tokenization. https://platform.claude.com/docs/en/build-with-claude/token-counting
5. OpenAI Agents SDK usage documentation emphasizes request-level usage aggregation and notes that usage can be missing depending on adapter/provider paths; this reinforces the need to reconcile auxiliary requests rather than assuming one telemetry surface is exhaustive. https://openai.github.io/openai-agents-python/usage/

### Interpretation
The core problem is control-plane opacity: context introspection is treated as metadata but may be implemented using billable data-plane requests. Fixed context items multiply the cost, repeated UI polling multiplies it again, and stream-only accounting hides the effect.

## Existing approaches
- Provider token-count endpoints.
- SDK context-usage helpers.
- Prompt caching and provider-side cache metrics.
- Per-run SDK usage objects.
- Provider billing/invocation logs.
- Manual reduction of tools/context items.

## Remaining limitations
- Callers cannot assume introspection is local, free, cached, or represented in normal run usage.
- Static context items can be recounted every turn despite unchanged content.
- Per-item fan-out grows linearly with tool/skill catalog size.
- Stream/run usage can omit auxiliary requests, making budgets and cost dashboards optimistic.
- Disabling context inspection entirely removes useful safety signals about context pressure.

## Root-cause analysis
1. Context usage APIs expose a cheap-looking read abstraction while provider adapters may implement it with remote inference/token-count requests.
2. Counting happens per context component rather than over a stable aggregated fingerprint.
3. Memoization/cache keys are missing or disabled for unchanged context definitions.
4. Auxiliary introspection calls use a telemetry path separate from normal model-turn events.
5. UI/polling layers invoke introspection by time/turn rather than on context-definition change.

## Improvement opportunity
Wrap introspection behind an observable metering/cache layer. Fingerprint static context definitions, cache counts by provider/model/fingerprint, invalidate only on context-definition changes, instrument auxiliary request count/tokens/latency, and enforce per-turn/session introspection budgets. Reconcile wrapper telemetry against provider logs during verification.

## Proposed solution
The package supplies deterministic JSONL analysis and cache-policy scripts, enforceable token rules, a measurement/optimization skill, a bounded benchmark workflow, a preflight hook, an independent verifier, and tests.

## Goal
Reduce auxiliary context-introspection calls and tokens without removing correctness-critical context-pressure visibility.

## Metrics
- `introspection_requests_per_turn`
- `introspection_input_tokens_per_turn`
- `introspection_cost_per_task`
- `introspection_latency_ms`
- `cache_hit_rate`
- `context_definition_changes`
- `provider_vs_local_request_delta`
- `provider_vs_local_cost_delta_percent`
- result-quality/context-overflow regression rate

## Trigger
Before enabling per-turn context gauges, after tool/skill catalog changes, when provider billing exceeds local telemetry, or when an SDK upgrade changes token/context counting behavior.

## Inputs
Auxiliary-call JSONL trace, provider/model identifiers, context-item fingerprints, optional before/after benchmark traces.

## Outputs
Measured overhead report, cache/budget verdict, top repeated fingerprints, and regression status.

## Relevant sources
- https://github.com/anthropics/claude-agent-sdk-python/issues/1159
- https://github.com/anthropics/claude-code/issues/86628
- https://github.com/NousResearch/hermes-agent/issues/87450
- https://platform.claude.com/docs/en/build-with-claude/token-counting
- https://openai.github.io/openai-agents-python/usage/

## Verification target
The package is verified only when unchanged context definitions produce cache hits, auxiliary request/token totals decrease in measured before/after traces, context-pressure correctness remains intact, and provider-vs-local reconciliation no longer hides the measured introspection path.