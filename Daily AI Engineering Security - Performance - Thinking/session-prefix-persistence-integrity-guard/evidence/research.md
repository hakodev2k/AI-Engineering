# Research — Session Prefix Persistence Integrity Guard

## Topic
Persisted agent sessions can lose or reconstruct cacheable prompt-prefix state incorrectly, causing avoidable full prompt reprocessing after continuation/resume.

## Category
Token

## Problem
Prompt caching depends on stable model-visible prefix bytes. Agent runtimes often persist a session and later rebuild or restore its system prompt/history. If the persisted canonical prefix is missing, stale, reordered, or reconstructed differently from the bytes previously sent, the next request loses cache reuse and may reprocess tens or hundreds of thousands of tokens. The failure can look like a normal slow first token rather than an explicit cache-state defect.

## Why it matters now
Long-context coding agents routinely persist and resume sessions across desktop, CLI, gateway, and group-chat surfaces. Recent 2026 reports show both missing persisted system prompts and replay byte drift causing permanent or repeated prefix-cache misses. Large contexts turn these integrity defects into material cost, latency, and rate-limit problems.

## Affected users
AI coding-agent users, agent runtime/platform builders, local-model operators, gateway/desktop clients, and teams paying for long-context model input.

## Current public evidence
### Observed evidence 1 — Hermes Agent group chat, 2026-08-27
Hermes Agent issue #96570 reports group-chat runs whose stored `system_prompt` remains `null`; every turn rebuilds the prompt and therefore misses the prefix cache. The issue specifically identifies the `update_system_prompt` persistence path and asks for a regression assertion that the stored prompt becomes non-null after the first turn.

Source: https://github.com/NousResearch/hermes-agent/issues/96570

### Observed evidence 2 — Claude Code session resume, 2026-04-02
Claude Code issue #42338 reports that `--continue`/`/resume` invalidated the prompt cache for large sessions, causing 400–500k cache-creation tokens on resume and rapid rate-limit consumption. This shows the user impact when a persisted conversation cannot preserve effective provider cache reuse across a resume boundary.

Source: https://github.com/anthropics/claude-code/issues/42338

### Observed evidence 3 — Hermes Agent WebUI replay, 2026-08-03
Hermes Agent issue #77320 reports that historical user messages were replayed without the exact `api_content` bytes originally sent to the model. The persisted sidecar existed, but reconstruction used different bytes for historical turns, breaking the cache prefix at the first conversation message and forcing full re-prefill on every new turn.

Source: https://github.com/NousResearch/hermes-agent/issues/77320

## Existing approaches
Providers offer implicit or explicit prompt/prefix caching. Agent runtimes commonly keep a cached system prompt, persisted session row, conversation history, and sometimes a sidecar containing the exact API representation. Existing cache profilers can detect hit-rate regressions after requests have already been sent.

## Remaining limitations
A cache hit metric alone does not identify whether the persistence boundary corrupted the canonical prefix. Rebuilding a semantically equivalent prompt is insufficient because caches can require exact byte/token prefix stability. Persisting a non-empty prompt is also insufficient if replay serializes historical messages differently. Model/provider/toolset changes can legitimately require a new baseline, so a guard must distinguish intentional runtime-identity changes from accidental persistence drift.

## Root-cause analysis
1. Persisted session state stores semantic conversation data but not the exact cache-sensitive representation sent to the provider.
2. Write ordering can create or leave session rows before the canonical prefix is available.
3. Resume/replay paths use different prompt assembly logic than the original turn.
4. Sidecar/exact API representations may be discarded or applied only to the current message.
5. Cache regressions are observed downstream as cost/latency, not checked as a persistence invariant before the request.

## Interpretation
These reports support a reusable persistence-integrity control: record a non-secret fingerprint and length/segment manifest of the exact stable prefix at a known-good request, persist it with runtime identity, reconstruct the resume prefix, and compare before issuing a costly model call. A changed runtime identity should require explicit rebaselining rather than being misclassified as corruption.

## Improvement opportunity
Add a deterministic preflight at session continuation/resume boundaries. Fail or warn before the model call when a same-runtime session has missing persisted prefix state, segment loss/reordering, or byte drift. Record only hashes/lengths by default. Pair the preflight with provider usage metrics to verify lower cache-creation/input tokens and resume latency without dropping required context.

## Goal
Preserve exact cache-sensitive prefix integrity across persistence/resume while retaining all correctness-critical context.

## Metrics
- cache creation/input tokens on first resumed call
- cache read/hit tokens and hit ratio
- resume time-to-first-token
- persisted-prefix hash match rate
- missing-prefix-state rate
- first-difference byte/segment distribution
- tokens/task and cost/task
- quality/regression rate after fixes

## Trigger
Session continuation, process restart, desktop/CLI/gateway handoff, group-chat turn reconstruction, or any restore from durable conversation state.

## Inputs
Known-good baseline prefix manifest, reconstructed resumed prefix manifest, runtime identity, provider usage metrics, and package policy.

## Outputs
Match/rebaseline/block verdict, hashes, lengths, first differing byte/segment, and a before/after cache-performance record.

## Relevant sources
- https://github.com/NousResearch/hermes-agent/issues/96570
- https://github.com/anthropics/claude-code/issues/42338
- https://github.com/NousResearch/hermes-agent/issues/77320
