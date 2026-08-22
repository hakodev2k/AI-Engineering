# Research — Hook Context Canonicalization Cache Guard

## Topic
Hook Context Canonicalization Cache Guard

## Category
Token

## Problem
Tool hooks can inject useful dynamic context into an AI-agent turn, but if the host serializes the same hook payload differently when rebuilding conversation history, the cached prompt prefix changes even though the semantic content did not. A small hook result can therefore force tens or hundreds of thousands of tokens to be re-written to the provider cache.

## Why it matters now
Recent Claude Code reports in July–August 2026 isolate prompt-cache invalidation to client-side history reconstruction and hook `additionalContext` serialization. This turns an observability/policy feature into a recurring token, cost, and latency amplifier in long sessions.

## Affected users
Developers using PreToolUse/PostToolUse hooks, agent-platform builders, teams running long Claude Code sessions, CI/headless agent users, and platform owners measuring token cost.

## Current public evidence
### Observed evidence
1. Anthropic Claude Code issue #83913 (opened 2026-08-04) reports controlled experiments where PreToolUse/PostToolUse `additionalContext` caused a previously warm ~22k-token prefix to be rewritten on the next prompt, while control hooks remained warm: https://github.com/anthropics/claude-code/issues/83913
2. Claude Code issue #81077 (opened 2026-07-25) independently reports PostToolUse `additionalContext` being re-serialized between turns, invalidating cached history after the hook point: https://github.com/anthropics/claude-code/issues/81077
3. Claude Code issue #85326 (opened 2026-08-09) reports repeated cache drops in a ~950k-token session, showing the practical scale of full-context rewrites when prefix stability is lost: https://github.com/anthropics/claude-code/issues/85326
4. Anthropic prompt-caching documentation explains that cache hits depend on an exact reusable prompt prefix and exposes `cache_read_input_tokens` and `cache_creation_input_tokens` for measurement: https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching

## Existing approaches
- Disable tool-level hooks that return `additionalContext`.
- Inspect provider usage fields manually after suspicious cost spikes.
- Keep stable prompt material near the beginning of requests.
- Depend on provider cache TTL and automatic prefix matching.

## Remaining limitations
Disabling hooks removes policy and observability value. Provider-side caching cannot repair client-side byte drift. Manual inspection is too late for CI and long-running autonomous sessions. A cache-hit percentage alone does not identify where the stable prefix was broken or whether a small hook payload caused a disproportionate rewrite.

## Root-cause analysis
- Semantically identical hook payloads can have different carriers, wrappers, whitespace, ordering, or newline normalization across live and rebuilt history.
- Dynamic hook data may be placed inside the reusable prefix rather than an intentionally volatile suffix.
- Hosts often observe total token usage but do not enforce a maximum rewrite ratio for stable history.
- Cache regressions are rarely covered by deterministic request-shape fixtures.

## Improvement opportunity
Treat prompt-prefix stability as a contract. Canonicalize hook context before persistence, record a digest for every reusable history block, compare live and rebuilt forms, and block releases when unchanged semantic content causes a large prefix rewrite. Keep genuinely volatile hook data outside the reusable prefix when the provider/harness architecture permits it.

## Goal
Reduce avoidable cache-creation tokens caused by host-side serialization drift without removing context required for correctness.

## Metrics
- cache creation tokens per task and per hook event
- cache read tokens per request
- rewrite ratio = cache_creation / max(1, previous reusable prefix tokens)
- stable-block digest mismatch count
- task latency and cost before/after
- quality/regression pass rate

## Trigger
Enable or modify tool hooks, upgrade an agent runtime, observe an unexplained cache-write spike, resume/rebuild a long session, or change history serialization.

## Inputs
Provider usage records, chronological request metadata, hook payloads, stable-block digests, runtime version, model, and session identifiers.

## Outputs
Baseline report, suspected invalidation boundaries, rewrite-ratio violations, canonicalization recommendation, and post-change verification report.

## Interpretation
The evidence supports a real class of client-side cache instability. It does not prove every cache miss is caused by hooks; TTL expiry, model/tool-set changes, compaction, or intentional prompt changes must be excluded before attributing root cause.

## Proposed solution
A reusable measurement and canonicalization package that detects cache rewrites from usage traces, requires byte-stable serialization for reusable hook context, and verifies quality before accepting token savings.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/83913
- https://github.com/anthropics/claude-code/issues/81077
- https://github.com/anthropics/claude-code/issues/85326
- https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching
