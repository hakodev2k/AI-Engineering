# Research — Prompt Cache Prefix Stability Guard

## Topic
Prompt Cache Prefix Stability Guard

## Category
Token / Performance

## Problem
Agent request builders can change ordering or insert volatile bytes into otherwise reusable prompt prefixes. Prefix-based provider caches then miss even though the semantic toolset and task context are effectively unchanged.

## Why it matters now
Large coding/agent prompts commonly contain tens of thousands of tokens of tools, instructions, history, and project context. Cache misses can sharply increase input-token cost and latency across every internal model call.

## Affected users
Coding-agent users, agent SDK authors, tool-heavy platforms, multi-agent orchestrators, and teams paying for cached-input APIs.

## Current public evidence
### Observed evidence
1. Claude Code #49038, opened April 16, 2026, reports non-deterministic sub-agent ordering in an Agent tool description causing resumed-session prompt-cache misses across a ~30–60k token static prefix: https://github.com/anthropics/claude-code/issues/49038
2. Qwen Code #6338, opened July 5, 2026, reports tool declarations generated in registration order and proposes stabilizing schema order to avoid unnecessary cache misses: https://github.com/QwenLM/qwen-code/issues/6338
3. OpenCode #18215, opened March 19, 2026, reports non-deterministic agent/skill lists breaking Anthropic prompt caching and identifies unsorted accessible-agent enumeration as root cause: https://github.com/anomalyco/opencode/issues/18215
4. Hermes Agent #27339 reports dynamic tool shuffling invalidating KV/prompt cache on follow-up messages: https://github.com/NousResearch/hermes-agent/issues/27339
5. Hermes Agent #68191 reports per-session bytes ahead of a cache breakpoint defeating shared-prefix reuse even when most tool/system bytes are identical: https://github.com/NousResearch/hermes-agent/issues/68191

### Interpretation
Caching is not only a provider feature; deterministic host serialization is an engineering invariant. Equivalent stable content should have a stable canonical representation, while truly dynamic content should be placed after reusable prefixes when provider semantics permit.

## Existing approaches
- Enable provider prompt caching/cache-control.
- Cache request/system-prompt objects inside one session.
- Add cache breakpoints to system/messages.
- Reuse previous response/session IDs.

## Remaining limitations
- Non-deterministic collection order still changes bytes.
- Dynamic session/project metadata can appear before static blocks.
- Tool schemas may be regenerated in registration order.
- Cache telemetry may be collected without identifying the first divergent host segment.

## Root-cause analysis
1. Request serialization is treated as semantically equivalent rather than byte/prefix stable.
2. Registries use insertion/hash/plugin discovery order.
3. Stable and volatile content are interleaved.
4. CI rarely tests prefix fingerprints across equivalent runs.
5. Cache-hit telemetry is observed after dispatch but not tied to request-diff evidence.

## Improvement opportunity
Define stable segments, canonicalize order and JSON serialization, fingerprint request prefixes, and gate releases when semantically equivalent fixtures unexpectedly diverge. Combine provider telemetry with host-side fingerprints.

## Goal
Reduce cache creation/miss tokens and latency without removing correctness-critical context.

## Metrics
Stable-prefix digest match rate, cache-hit tokens, cache-miss/cache-creation tokens, input cost/task, latency/task, first divergent segment, quality regression rate.

## Trigger / Inputs / Outputs
Trigger: request-builder change, tool/plugin registration change, provider migration, or cache-hit regression. Inputs: baseline/candidate request manifests and policy. Outputs: segment digests, first divergence, allow/regression decision.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/49038
- https://github.com/QwenLM/qwen-code/issues/6338
- https://github.com/anomalyco/opencode/issues/18215
- https://github.com/NousResearch/hermes-agent/issues/27339
- https://github.com/NousResearch/hermes-agent/issues/68191