# Research

## Topic
Deterministic Tool Failure Circuit Breaker

## Category
Performance

## Problem
Agent harnesses can repeatedly retry the same tool call after deterministic failures or dead permission streams. Identical retries consume tokens, latency, API/tool capacity, and may stall unattended workflows without increasing the probability of success.

## Why it matters now
Long-running and multi-agent systems magnify retry amplification. Recent reports show identical tool errors repeated many times and permission failures retried on dead streams.

## Affected users
Coding-agent users, CI/headless runners, multi-agent orchestrators, platform teams, and developers paying per-token/per-call.

## Current public evidence
### Observed evidence
- OpenAI Codex issue #34735 reports deterministic tool errors retried repeatedly with identical arguments and no effective usage guard; the report explicitly calls for deduplication and bounded retry.
- Anthropic Claude Code issue #75510 reports a broken permission-request stream retried about 128 times with no visible backoff.
- Anthropic issue #70422 reports a false no-visible-output condition producing repeated retries and duplicate user-visible responses.
- OpenAI's current model guidance for tool-heavy programmatic workflows recommends explicit concurrency, retry, and stopping limits; transient failures should have bounded retries and completed calls should not be repeated.

## Existing approaches
Generic exponential backoff, provider SDK retries, model self-correction, global max-turn limits, manual cancellation, and tool-specific error handling.

## Remaining limitations
Backoff alone wastes time on deterministic failures. Global turn limits do not prevent a single broken call from consuming most of the budget. Model-directed retries may repeat identical arguments. Permission and transport failures need different treatment from validation/not-found/policy errors.

## Root-cause analysis
1. Errors are not classified as transient vs deterministic before retry.
2. Retry keys do not include normalized tool name + canonical arguments + stable error fingerprint.
3. Retry budgets are global rather than per incident/tool signature.
4. Progress is not required between retries.
5. Telemetry does not always group repeated failures into one incident.

## Improvement opportunity
Introduce a deterministic circuit breaker that fingerprints tool calls and failures, permits bounded retry only for transient classes, requires changed evidence/arguments after a deterministic failure, tracks per-incident budgets, and emits a structured fallback/escalation result.

## Relevant sources
- https://github.com/openai/codex/issues/34735
- https://github.com/anthropics/claude-code/issues/75510
- https://github.com/anthropics/claude-code/issues/70422
- https://developers.openai.com/api/docs/guides/latest-model
