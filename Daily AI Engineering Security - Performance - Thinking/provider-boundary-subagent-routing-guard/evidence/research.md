# Research Evidence

## Topic
Provider Boundary Subagent Routing Guard

## Category
Security

## Problem
Privileged AI subsystems such as approval reviewers, memory writers, and multi-agent helpers can cross a model-provider boundary using assumptions that are valid only for first-party OpenAI backends. This can cause permission-review failures, unsupported proprietary request shapes, or silent use of models the user did not select on a third-party provider.

## Why it matters now
Recent Codex reports show current provider abstractions still allow first-party request/model assumptions to leak into custom provider execution paths. Because approval and memory subsystems handle sensitive context and security-relevant decisions, incorrect routing is more than ordinary compatibility breakage.

## Affected users
Developers using OpenAI-compatible gateways, Azure, Ollama/OpenRouter-like providers, custom model providers, Guardian/auto-review, memories, and multi-agent features.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #39532, reported 2026-08-19, shows Guardian/auto-review sending a proprietary `additional_tools` input item on Responses-Lite to an OpenAI-compatible provider. The provider returns HTTP 400. A controlled A/B removed only that item and restored HTTP 200. The report notes this can make escalated permission reviews unusable.
2. Codex issue #37009 reports the memory writer using hardcoded `gpt-5.6-luna` and `gpt-5.6-terra` against non-OpenAI custom providers instead of the user's selected model. The calls can succeed silently and send prior thread content to models the user did not choose.
3. Codex issue #31870 documents GPT-5.6 Sol requests through Azure failing every turn because an internal Responses-Lite contract is sent where the provider does not support it.
4. Codex issue #37858 documents similar provider/product mismatch for server-side multi-agent parameters on regular API-key providers.

### Interpretation
These are independent manifestations of the same boundary defect: a provider marked “Responses compatible” is being treated as supporting internal first-party capabilities and preferred model IDs. Compatibility at the transport endpoint is not capability equivalence.

## Existing approaches
- Provider configuration fields such as `requires_openai_auth`, `wire_api`, and capability flags.
- Explicit model overrides for memories/reviewers.
- Provider-specific workarounds that remove unsupported request fields.
- Failing at the upstream HTTP boundary when unsupported parameters are rejected.

## Remaining limitations
- Capability checks may occur too late, after a security-relevant subagent request has already been assembled.
- Provider-neutral configuration does not guarantee first-party extension support.
- Some wrong-model routes do not fail; they silently bill or disclose context to a different model.
- A transport capability and a privileged-subsystem capability are often conflated.

## Root-cause analysis
1. First-party default model IDs are inherited by generic providers.
2. Internal request extensions are selected from model metadata without verifying the actual provider contract.
3. Security-sensitive subagents lack an explicit routing contract binding provider, model, feature, and allowed request extensions.
4. Validation is reactive HTTP error handling rather than pre-dispatch fail-closed validation.
5. No deterministic policy asserts that the effective provider/model remains within user-authorized boundaries.

## Improvement opportunity
Add a reusable provider-boundary guard that computes an explicit effective route for every privileged subagent call, validates provider capabilities and model selection before request construction, blocks proprietary extensions unless positively declared, requires explicit authorization for cross-provider model substitution, and emits deterministic audit evidence.

## Relevant sources
- https://github.com/openai/codex/issues/39532
- https://github.com/openai/codex/issues/37009
- https://github.com/openai/codex/issues/31870
- https://github.com/openai/codex/issues/37858
