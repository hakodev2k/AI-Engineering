# Research — Reasoning-Only Truncation Retry Budget Guard

## Topic
Stop deterministic retry waste when reasoning consumes the entire model output budget before visible content or tool calls appear.

## Category
Performance

## Problem
Agent runtimes can interpret a reasoning-only truncated response as a generic empty response and retry it with the same budget. If the task consistently requires more reasoning tokens than the cap, each retry repeats the same failure.

## Why it matters now
Reasoning models are increasingly used inside multi-step agents. The distinction between visible output tokens and internal/reasoning tokens creates failure modes that older “empty content means retry” policies did not model.

## Affected users
Agent-framework maintainers, self-hosted inference operators, developers running reasoning models, teams paying per-token/per-second model costs.

## Current public evidence

### Observed evidence
1. **Hermes Agent issue #83915**, opened August 11, 2026, reports four continuation attempts after an initial reasoning-only truncation, totaling five full-budget generations and 77 minutes of GPU time with no partial visible answer. The report argues the continuation cannot converge when there is no visible content to continue and the budget remains unchanged.  
   https://github.com/NousResearch/hermes-agent/issues/83915
2. **Haystack issue #12300**, opened August 11, 2026, reports that an Agent can loop to `max_agent_steps` when a reasoning model returns no text because it exhausted `max_output_tokens`; identical retries are wasted when the budget is systematically too small.  
   https://github.com/deepset-ai/haystack/issues/12300
3. **pi issue #8233**, opened August 17, 2026, describes a different empty-response failure in which a provider can return HTTP 200 with no content and zero usage, causing silent agent-loop retries. This supports separating transient/provider-empty responses from output-budget truncation rather than using one generic retry rule.  
   https://github.com/earendil-works/pi/issues/8233
4. **oh-my-pi issue #7372**, opened August 2, 2026, reports persistent empty stops after an aborted turn/model switch, where nested retry layers can multiply API calls before the retry cap is exhausted.  
   https://github.com/can1357/oh-my-pi/issues/7372

### Interpretation
“Empty assistant response” is not one failure class. At minimum, deterministic reasoning-only truncation, transient zero-usage provider empties, and state-corruption/model-switch empties need different retry policies. A single fixed retry counter wastes compute and obscures root cause.

## Existing approaches
Global max-agent-step limits; hardcoded empty-response retry counts; exponential backoff; length-continuation prompts; output-budget escalation in selected code paths; provider retries.

## Remaining limitations
Generic retries do not prove progress. Layered retries can multiply. Same-budget continuation is ineffective for deterministic budget exhaustion. Provider-empty responses need bounded transient retries, while reasoning-only truncation needs immediate budget/policy change.

## Root-cause analysis
1. Retry logic keys on empty visible content instead of finish reason plus usage metadata.
2. Reasoning-token consumption is not included in no-progress classification.
3. Provider and agent retry layers are independently bounded but multiplicative.
4. Continuation logic may not have any visible text to continue from.
5. Output-budget escalation is inconsistent across response branches.

## Improvement opportunity
Introduce a post-response classifier that maps observable telemetry to `stop_and_adjust_budget`, `retry_transient`, `continue_partial`, `success`, or `fail`. Enforce one shared retry budget and record cost/latency per failure class.

## Relevant sources
- https://github.com/NousResearch/hermes-agent/issues/83915
- https://github.com/deepset-ai/haystack/issues/12300
- https://github.com/earendil-works/pi/issues/8233
- https://github.com/can1357/oh-my-pi/issues/7372
