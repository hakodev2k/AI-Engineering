# Research — Provider Signature History Budget Guard

**Category:** Token  
**Research date:** 2026-08-28 (UTC+7)

## Topic
Opaque provider reasoning-signature metadata can accumulate into large hidden context overhead, yet removing it indiscriminately can break tool-call replay or degrade multi-turn reasoning continuity.

## Problem
Agent runtimes often persist provider-specific metadata such as Gemini `thoughtSignature`/`textSignature` alongside ordinary conversation history. These opaque fields can be kilobytes per turn and may be resent repeatedly. Long sessions can therefore exceed context limits even when user-visible text appears small. The naive fix—strip all signatures from old history—is unsafe because some signatures are mandatory for Gemini 3 function-calling continuations and recommended for reasoning continuity.

## Why it matters now
The problem is independently reproduced in Gemini CLI and OpenClaw. Gemini CLI issue #20933 reports hundreds of accumulated `thoughtSignature` fields pushing requests over a 1,048,576-token limit while the visible context meter showed roughly 13% usage. OpenClaw issue #48709 reports ~15 KB `textSignature` values per response and a session reaching 416K tokens with timeouts. At the same time, Gemini CLI issue #25808 shows that dropping signatures from history can silently degrade multi-turn continuity, and Google's current thought-signature documentation requires exact replay for Gemini 3 function-calling steps.

## Affected users
Agent-framework maintainers, Gemini API/REST clients, provider adapters, multi-model orchestrators, subagent systems, long-running chat/automation users, and teams measuring token/cost/latency from user-visible content only.

## Current public evidence

### Observed evidence
1. Gemini CLI issue #20933, opened 2026-03-03, reports an `INVALID_ARGUMENT` maximum-input-token failure caused by hundreds of persisted `thoughtSignature` fields. The reporter states visible context was about 13% of a 1M-token window while internal metadata pushed the request over the hard limit. The proposed fix selectively strips signatures from older curated history while preserving the active loop and adds a token safety buffer.  
   https://github.com/google-gemini/gemini-cli/issues/20933
2. OpenClaw issue #48709, opened 2026-03-17, reports `textSignature` fields around 15 KB per assistant turn, 150 KB+ after roughly ten exchanges, and an observed session at 416K tokens with API timeouts/aborts.  
   https://github.com/openclaw/openclaw/issues/48709
3. Gemini CLI issue #25808, opened 2026-04-22, reports the opposite failure: signatures on non-function-call parts are silently dropped from in-memory history, which can degrade reasoning continuity in later turns even though the API may not return a blocking error.  
   https://github.com/google-gemini/gemini-cli/issues/25808
4. Google's current Gemini thought-signature documentation states that signatures should generally be replayed exactly as received. Gemini 3 function-calling signatures are required within the active function-calling flow; signatures on non-function-call final parts are optional but recommended for quality. Official SDKs handle this automatically when callers append full response objects, while manual history transformation requires explicit care.  
   https://ai.google.dev/gemini-api/docs/generate-content/thought-signatures

### Interpretation
The engineering problem is lifecycle-aware metadata retention, not simple compression. Signature value depends on role, model/provider, whether the turn belongs to the currently active function-calling loop, and whether the API validates the signature on replay. A single global policy such as "keep all provider metadata" wastes context; "strip all opaque metadata" can make requests invalid or reduce quality.

## Existing approaches
- Persist and replay full provider response objects.
- Curate/compress old chat history.
- Strip thought/signature metadata from historical turns.
- Add context safety buffers before summarization.
- Let official provider SDKs manage signatures automatically.

## Remaining limitations
- Frameworks with normalized cross-provider histories cannot always retain full provider response objects.
- User-visible token meters may omit opaque serialized metadata or count it differently from provider validation.
- Fixed age-based stripping does not know whether a signature is still required by an active function-calling step.
- Full retention multiplies storage, request size, latency, and token usage.
- Cross-model/provider handoffs can change replay requirements.
- Quality impact from dropping optional historical signatures may be silent rather than a hard API failure.

## Root-cause analysis
1. Provider-specific control metadata is mixed into generic conversation persistence.
2. Retention decisions are based on message age/size rather than protocol lifecycle.
3. Token accounting often measures visible text or provider-reported usage, not exact outbound serialized payload composition.
4. Normalization layers lose whether a signature is required, recommended, or archival.
5. Compression runs too late, after metadata overhead has already consumed the headroom needed to compress safely.

## Improvement opportunity
Introduce a deterministic metadata ledger and budget gate. Classify each opaque signature as `required_active`, `recommended_recent`, or `archival`; preserve required active function-call signatures byte-for-byte; keep recent recommended signatures only inside an explicit budget; strip archival signatures from outbound model context while optionally retaining hashes/metadata for diagnostics. Measure serialized signature bytes separately from text tokens and block compaction/replay when mandatory signature retention would exceed the reserved context budget.

## Relevant sources
- Gemini CLI #20933 — metadata bloat can exceed context despite low visible usage: https://github.com/google-gemini/gemini-cli/issues/20933
- OpenClaw #48709 — ~15 KB signature per turn and session bloat/timeouts: https://github.com/openclaw/openclaw/issues/48709
- Gemini CLI #25808 — dropping signatures can silently reduce continuity: https://github.com/google-gemini/gemini-cli/issues/25808
- Google Gemini thought-signature documentation: https://ai.google.dev/gemini-api/docs/generate-content/thought-signatures
