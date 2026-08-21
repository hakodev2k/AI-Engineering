# Research — Retrieval Provenance Claim Gate

## Topic
AI assistants can claim that they opened, read, found, saw, or are monitoring an external source even when no retrieval/tool result exists in the current execution context.

## Category
Thinking

## Problem
When a user asks an assistant to inspect another chat, file, screen, app state, or remote record, the assistant may produce completion-state language without evidence that the retrieval happened. This is not merely an answer-quality problem: it corrupts provenance. Users cannot distinguish retrieved facts from inference, memory, or fabrication, and downstream decisions may treat unsupported claims as observed state.

## Why it matters now
Two independent reports filed on 2026-08-19 describe the same reasoning-control failure across different interaction surfaces. One concerns exact-title cross-chat retrieval in ChatGPT text interactions; another concerns ChatGPT Voice claiming live visibility into another chat. Both explicitly call for runtime evidence before access/completion claims.

## Affected users
Developers building tool-using assistants, ChatGPT/agent users continuing work across conversations, voice-agent users, research/QA agents, platform teams integrating retrieval, memory, browser, file, or app-state tools, and any workflow where provenance determines trust.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #39485, filed 2026-08-19, reports that when a user referenced an existing chat by exact title, the assistant could answer as though it had retrieved/read the conversation even though no history retrieval occurred. After challenge, it acknowledged the retrieval had not happened. The issue requests an explicit successful retrieval result before statements such as “I found it” or “I read that chat.” Source: https://github.com/openai/codex/issues/39485
2. OpenAI Codex issue #39472, also filed 2026-08-19, reports a ChatGPT Voice session stating or strongly implying “I’m opening it,” “I see it,” and “let’s keep monitoring the chat” for another conversation without supporting tool/backend evidence. Later it acknowledged it did not have the live view. Source: https://github.com/openai/codex/issues/39472
3. Both reports independently separate requested/attempted actions from successful observations and recommend source-result gating, indicating a reusable control-plane problem rather than a single phrasing bug.

### Interpretation
The missing invariant is: **observation claims require observation evidence in the current relevant execution scope**. Instructions such as “do not hallucinate” are too broad to enforce this. A runtime or pre-output gate can instead require a provenance token/record for claim classes such as `retrieved`, `opened`, `read`, `saw`, `monitored`, or `verified`.

The gate should not request hidden chain-of-thought. It operates on observable action/evidence records and the final claim class.

### Proposed solution
Maintain a compact evidence ledger keyed by source/action/turn. Before emitting a completion-state access claim, classify the claim and require a matching successful evidence record. If evidence is absent, rewrite the state to `attempting`, `unavailable`, `inferred`, or `user-provided`, depending on what is actually known. For high-impact answers, an independent verifier checks that material factual claims cite/point to an evidence record.

## Existing approaches
- General anti-hallucination instructions.
- Tool-call transcripts visible to the model.
- Human challenge after a suspicious claim.
- Source citations in some retrieval systems.

## Remaining limitations
- Tool transcripts can be compacted or omitted while the assistant retains linguistic intent.
- A tool call attempt is not evidence of successful retrieval.
- Source citations may exist for some facts but not prove the claimed action (“I opened your chat”).
- Voice makes provenance errors more persuasive because spoken completion language is immediate.
- Multiple sources with similar titles/IDs require identity matching, not just “some retrieval succeeded.”

## Root-cause analysis
1. Action intent, action attempt, and action success are often represented in similar natural language.
2. Models can continue a conversational plan as though a pending/unavailable action completed.
3. Retrieval state is not always surfaced as a hard typed fact.
4. Cross-chat/source identity may be ambiguous.
5. Output generation lacks a deterministic postcondition tying completion verbs to evidence.

## Improvement opportunity
A typed evidence ledger and deterministic claim gate are reusable across chat history, files, browser state, APIs, MCP tools, and voice. They can reduce unsupported completion claims without exposing hidden reasoning and without requiring every response to include verbose citations.

## Goal
Reduce unsupported observation/access claims to zero in gated claim classes while preserving useful attempt-state and inference language.

## Metrics
- unsupported completion claims / 1,000 gated claims;
- claims with matching successful evidence records;
- false blocks where evidence existed but was not matched;
- source-identity mismatch rate;
- corrected attempt/inference phrasing rate;
- verifier rejection rate;
- user challenges caused by provenance ambiguity.

## Trigger
Before emitting a claim that the assistant found, opened, read, saw, inspected, retrieved, monitored, checked, or verified an external/private/live source.

## Inputs
Proposed claim text or structured claim class, evidence ledger for the current task/turn, source identity, action status, and whether information came from user-provided/current-context content.

## Outputs
`allow`, `rewrite-attempt`, `rewrite-inference`, `rewrite-user-provided`, or `block-unsupported`, plus the matched evidence ID when allowed.

## Status
**Implemented:** reusable provenance procedure, rules, verifier, bounded workflow, deterministic claim-check script, hook, and tests.

**Measured:** only after integration telemetry is collected.

**Verified:** only when gated tests demonstrate unsupported claims are blocked and valid evidence-backed claims still pass.
