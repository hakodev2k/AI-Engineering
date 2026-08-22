# Research Evidence

## Topic
Provider Capability Contract Preflight

## Category
Performance

## Problem
AI coding agents increasingly target OpenAI-compatible Responses endpoints, Azure gateways, LiteLLM, OpenRouter, Ollama, and other compatibility layers. The wire API may be nominally compatible while proprietary or newer tool shapes are not. When the client assumes capability parity, requests can fail before inference, trigger repeated retries, or disable critical review/tool paths.

## Why it matters now
On 2026-08-19/20, fresh Codex reports show provider-specific request-shape failures around Responses Lite, `additional_tools`, namespace tools, and Guardian/auto-review. These failures can make escalated review or all model turns unusable despite valid provider connectivity.

## Affected users
Developers using custom Responses providers, Azure OpenAI/Foundry, LiteLLM gateways, OpenRouter/Ollama-compatible endpoints, and agent platforms that route the same orchestration layer across multiple providers.

## Current public evidence
### Observed evidence
1. openai/codex #39532 reports Guardian requests on Codex 0.146–0.148 failing with HTTP 400 when Responses Lite injects `additional_tools` into a generic OpenAI-compatible provider. The reporter traced 149 review turns and performed an A/B where removing exactly that item changed failure to HTTP 200.
2. openai/codex #37380 and #37952 independently report Azure rejecting the new `functions` namespace because Codex emitted an empty required description. A one-field A/B correction returned HTTP 200.
3. openai/codex #32318 and #23186 document custom providers rejecting or silently dropping proprietary `namespace` tool shapes even though they support Responses/function calling.
4. OpenAI's public Responses API reference documents ordinary function tools using `type: function` with name, parameters, strictness, and description. Provider compatibility must therefore be treated as a concrete capability contract rather than inferred solely from selecting `wire_api = responses`.

### Interpretation
The recurring defect is capability inference. “Speaks Responses” does not prove support for every internal extension, namespace representation, tool-search mode, or review request shape. Retry layers then amplify deterministic 400-class incompatibilities into wasted latency and tokens.

## Existing approaches
- Provider-specific configuration and feature flags.
- Manual proxy rewriting or stripping unsupported fields.
- Downgrading client versions.
- Retry-on-stream/request failure.
- Disabling Responses Lite or collaboration features with full model-catalog overrides.

## Remaining limitations
- Workarounds are reactive and often discovered only after a production failure.
- Generic retries cannot fix deterministic schema incompatibility.
- Feature flags may not remove every serialized extension.
- Users cannot easily inspect the effective outbound capability set before a long task begins.
- A full catalog override is brittle and can drift from upstream model metadata.

## Root-cause analysis
1. Protocol selection is conflated with feature capability negotiation.
2. Request construction lacks a provider-scoped allowlist for extension types.
3. Capability assumptions are often model-name or transport driven rather than probed/declared.
4. Deterministic validation errors are not classified early enough to suppress useless retries.
5. Guardian/subagent request shapes can differ from primary-model requests and are not always preflighted separately.

## Improvement opportunity
Add a reusable preflight that computes the exact feature contract needed by primary turns, Guardian/review turns, MCP/tool search, and collaboration; compares it to declared or probed provider capabilities; generates a minimal safe request profile; and blocks unsupported extensions before execution. Cache successful capability probes by provider endpoint + API version + model + client version with bounded TTL.

## Relevant sources
- https://github.com/openai/codex/issues/39532
- https://github.com/openai/codex/issues/37380
- https://github.com/openai/codex/issues/37952
- https://github.com/openai/codex/issues/32318
- https://github.com/openai/codex/issues/23186
- https://platform.openai.com/docs/api-reference/responses
