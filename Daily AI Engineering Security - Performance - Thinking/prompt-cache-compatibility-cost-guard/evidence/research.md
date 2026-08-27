# Research — Prompt Cache Compatibility Cost Guard

**Topic:** Prompt-cache compatibility and cost regressions in long-running AI-agent sessions  
**Category:** Token  
**Research date:** 2026-08-28 (UTC+7)

## Problem
Agent clients can fail or become unexpectedly expensive when prompt-cache request fields, model capabilities, compaction behavior, and cache economics drift out of alignment. These failures affect token cost, latency, and reliability and are difficult to diagnose without explicit cache-read/write telemetry.

## Why it matters now
Current August 2026 reports show both hard compatibility failures and large economic penalties. GPT-5.6-family cache semantics changed, clients still emitted deprecated fields, and users reported sessions dominated by cache-write or full-price cache-miss tokens. Official OpenAI and Amazon Bedrock documentation now exposes explicit cache controls and write/read counters, making deterministic preflight and verification feasible.

## Affected users
Developers using long Codex or agent sessions, platform teams routing across OpenAI-compatible providers, BYOK/Bedrock users, and engineering teams operating multi-step agents with large stable prefixes.

## Current public evidence

### Observed evidence
1. **OpenAI Codex issue #39392**, opened August 19, 2026, reports Codex Desktop turns aborting because `prompt_cache_retention` was sent to `gpt-5.6-sol`, which rejected the field as unsupported.  
   https://github.com/openai/codex/issues/39392
2. **OpenAI Codex issue #39397**, also opened August 19, 2026, independently reports CLI 0.148.0 causing every turn to fail with the same unsupported cache-retention parameter.  
   https://github.com/openai/codex/issues/39397
3. **Hermes Agent issue #91164**, opened August 20, 2026, reports the same GPT-5.6 compatibility failure in another agent runtime and notes migration toward `prompt_cache_options.ttl`.  
   https://github.com/NousResearch/hermes-agent/issues/91164
4. **OpenAI Codex issue #35925**, opened July 29, 2026, reports a 6.5-hour session in which cache misses carried most full-price input cost while surfaced counters made the problem difficult to observe.  
   https://github.com/openai/codex/issues/35925
5. **OpenAI API reference**, current as of this run, marks `prompt_cache_retention` deprecated and documents `prompt_cache_options.ttl`, explicit `prompt_cache_breakpoint`, and a 30-minute TTL for GPT-5.6+.  
   https://developers.openai.com/api/reference/cli/resources/responses/methods/create
6. **Amazon Bedrock prompt-caching guidance** documents `cached_tokens` and `cache_write_tokens`, states cache writes for GPT-5.6 are billed above uncached input while reads are deeply discounted, and recommends explicit mode for agentic loops plus monitoring write volume.  
   https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html
7. **OpenAI builder guide for GPT-5.6**, published August 2026, recommends deterministic cache breakpoints and appropriate `prompt_cache_key` use to improve hit rate and latency.  
   https://openai.com/index/builders-guide-to-gpt-5-6/

### Interpretation
The root problem is broader than one deprecated field. Agent runtimes need a model/provider-specific cache contract that is checked before each request and an economics guard that verifies cache writes are amortized by reads. Without both, a request may either fail immediately or succeed while silently increasing cost.

## Existing approaches
- Rely on provider defaults or implicit caching.
- Place stable system instructions and tool definitions before variable content.
- Use explicit breakpoints for stable prefixes where supported.
- Monitor cached-input counters after requests.
- Compact long sessions to control context size.

## Remaining limitations
- Compatibility is often validated only after an API 400 response.
- Model aliases may map to providers with different cache option support.
- Cache-write cost can exceed uncached input cost, so "cache enabled" does not imply "cache economical."
- Compaction or small prompt mutations can invalidate large prefixes.
- Telemetry is usually diagnostic after the fact rather than a blocking preflight control.

## Root-cause analysis
1. Cache capability metadata is not centralized in the agent client.
2. Deprecated fields remain in serialized request paths after model upgrades.
3. Stable/variable prompt boundaries are not explicitly modeled.
4. Cache economics are evaluated without write/read amortization thresholds.
5. Compaction and context pruning are not tested for prefix stability.
6. Retry loops may repeat an incompatible or expensive request unchanged.

## Improvement opportunity
Create a deterministic guard that validates cache option compatibility by model family, forbids deprecated fields, checks TTL and breakpoint mode, consumes recent usage telemetry, and blocks configurations whose write/read ratio exceeds a team-defined budget. Pair the guard with a bounded measure-migrate-measure workflow and independent verification.

## Relevant sources
- https://github.com/openai/codex/issues/39392
- https://github.com/openai/codex/issues/39397
- https://github.com/NousResearch/hermes-agent/issues/91164
- https://github.com/openai/codex/issues/35925
- https://developers.openai.com/api/reference/cli/resources/responses/methods/create
- https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html
- https://openai.com/index/builders-guide-to-gpt-5-6/
