# Explicit Prompt Cache Breakpoint Profiler

**Category:** Token

## Problem
Large agent prompts often contain a valuable reusable prefix, but dynamic blocks, inline files, generated tool schemas, or provider adapters can make prompt-cache reuse inconsistent. Teams can see rising input tokens/cost or low cached-token ratios without knowing which block first changed.

## Evidence
See `evidence/research.md`. Current signals include GPT-5.6 explicit cache-breakpoint support in OpenAI Agents SDK documentation, a developer report of cache-hit collapse when introducing inline base64 file input, and provider-routing reports where cache-control support materially changed cached-token usage.

## Existing approach
Rely on implicit caching, inspect aggregate `cached_tokens`, add cache keys/control settings, place static instructions first, and manually test files or provider routes.

## Existing limitations
Aggregate usage does not identify the first unstable block. Provider adapters can transform content. Mixed file/text input can change effective request structure. Cache optimization can also damage correctness if required context is removed just to save tokens.

## Proposed improvement
Profile ordered provider-facing request blocks, hash each block, measure the stable common prefix across comparable requests, calculate actual cache-hit ratios, identify first divergence, and recommend explicit breakpoints only where required content is demonstrably stable. Every optimization is quality-regression gated.

## Architecture
- `evidence/research.md` — public evidence and root-cause analysis.
- `config/policy.json` — cache and quality thresholds.
- `skills/cache-prefix-analysis.md` — evidence-driven analysis procedure.
- `rules/cache-budget-rules.md` — enforceable token/cache rules.
- `subagents/cache-verifier.md` — independent verification role.
- `workflows/profile-optimize-verify.md` — bounded optimization workflow.
- `hooks/pre-benchmark-cache-check.md` — evidence gate before benchmark claims.
- `scripts/cache_prefix_profiler.py` — deterministic block-fingerprint profiler.
- `examples/manifests.example.json` — runnable sanitized example.

## Installation
Requires Python 3.10+ and no third-party packages. Copy the package into the agent repository.

## Configuration
Edit `config/policy.json` for minimum comparable request count, acceptable quality regression, cache ratio targets, and block labels. Do not loosen quality controls solely to meet a token target.

## Usage
Run the included example:

`python scripts/cache_prefix_profiler.py examples/manifests.example.json --policy config/policy.json`

For production analysis, capture the ordered application/provider-facing request as named blocks. Use sanitized content: the script emits only hashes and byte sizes, but the input manifest itself should also avoid secrets.

The profiler groups requests by logical request class and reports stable-prefix block count, stable-prefix bytes, first divergence versus the first request, changed-block frequency, measured mean cache-hit ratio when usage is supplied, and a candidate breakpoint only when the final stable block is labeled `static-required`.

## Workflow
Follow `workflows/profile-optimize-verify.md`: Observe → Measure baseline → Diagnose → Form one structural hypothesis → Implement → Measure again → quality check → independent verification. At most two unproductive structural hypotheses are attempted before stopping for re-diagnosis.

## Metrics
- Cached-token ratio.
- Stable-prefix size.
- Input tokens/task.
- Output tokens/task.
- Latency/task.
- Cost/task when provider pricing/usage is available.
- Quality regression rate.
- Cache observability coverage.

## Verification
Use the same request classes and benchmark corpus before and after. Capture at least the configured number of comparable requests. A claimed cache improvement must use actual cached-token usage when available. Verify that the chosen breakpoint contains only stable required content and that fixed quality tests stay within policy.

## Safety
Never persist raw secrets or authorization data in manifests. Do not remove required system/developer instructions, safety controls, user intent, tool constraints, or evidence merely to reduce input tokens. Provider/router changes require remeasurement.

## Failure handling
Detection: insufficient comparable requests, missing usage metrics, no stable prefix, cache ratio below target, or quality regression. Evidence: profiler hashes, first-divergence report, usage records, and fixed evaluation results. Retry: one alternative structural hypothesis after the first fails. Maximum retries: two hypotheses total. Fallback: retain the original prompt structure. Escalation: investigate adapter/provider transformations when a stable prefix exists but cache metrics remain low. Stop: verified improvement, quality block, missing observability, or two failed hypotheses.

## Definition of Done
**Implemented:** request manifests are profiled and the chosen breakpoint/structural change is applied.

**Measured:** comparable before/after requests record cached tokens, input tokens, latency/cost where available, stable-prefix data, and quality results.

**Verified:** independent verifier confirms a measurable cache/token/latency improvement, no critical context loss, quality regression within policy, and no sensitive data in artifacts.

## Customization
Extend manifest generation for your SDK/provider, add tokenizers for more exact per-block token estimates, or integrate request tracing. Keep block hashing deterministic and preserve the provider-facing order. For OpenAI GPT-5.6+, map verified candidates to `prompt_cache_breakpoint`/`prompt_cache_options` according to current SDK documentation; for other providers, validate their exact cache-control semantics instead of assuming compatibility.
