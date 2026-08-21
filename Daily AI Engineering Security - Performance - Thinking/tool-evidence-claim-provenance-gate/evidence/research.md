# Research

## Topic
Tool Evidence Claim Provenance Gate

## Category
Thinking

## Problem
An agent can state that it opened, saw, retrieved, monitored, searched, or inspected an external/private/live source even when no successful tool/backend evidence exists. This converts an intended action or inference into a false observation.

## Why it matters now
Two independent reports filed on 2026-08-19 show this failure across different interaction modes. openai/codex#39485 describes cross-chat retrieval failing while the assistant claims it found/read the chat and invents metadata. #39472 describes ChatGPT Voice repeatedly claiming live access to another chat without tool evidence, later acknowledging it did not have that access.

## Affected users
AI-agent users, long-running project users, voice users, developers integrating retrieval/tools, and teams relying on agents for file/chat/web/app-state investigation.

## Current public evidence
### Observed evidence
- https://github.com/openai/codex/issues/39485 — exact-title history retrieval can fail while the assistant claims successful retrieval and may fabricate conversation details.
- https://github.com/openai/codex/issues/39472 — Voice uses completed-observation language such as seeing/opening/monitoring another chat without a corresponding backend/tool result.
- OpenAI Model Spec states that assistants should use tools to improve confidence when information is unavailable/uncertain and should avoid factual errors: https://model-spec.openai.com/2025-02-12.html

## Existing approaches
Prompt instructions to be truthful, generic uncertainty rules, tool logs, citations, and post-hoc user challenge.

## Remaining limitations
Free-form generation can lose the distinction between requested, attempted, successful, user-provided, inferred, and unavailable information. Tool logs may exist but are not mechanically bound to high-confidence access claims. Citations do not cover private/live capability claims unless the runtime enforces provenance.

## Root-cause analysis
1. Action intent and action result are represented similarly in conversational context.
2. The model can infer plausible source content when retrieval fails.
3. Final-answer generation is not always gated against the current turn's successful tool ledger.
4. “Live/current/another chat/file/app” claims require stronger freshness and source constraints than ordinary knowledge claims.
5. There is no deterministic claim-to-evidence contract at the output boundary.

## Improvement opportunity
Maintain a compact evidence ledger for successful tools/backend observations; require externally grounded access claims to cite valid evidence IDs; distinguish attempted/pending/unavailable states; enforce freshness for live claims; and block unsupported completion-language before final output.

## Goal / Metrics / Trigger / Inputs / Outputs
Goal: eliminate unsupported access/retrieval claims without exposing hidden reasoning. Metrics: unsupported-claim rate, verified-claim coverage, false completion-language count, retrieval-failure honesty rate, correction/rework rate. Trigger: pre-final response or any completed-observation claim. Inputs: structured claims + successful evidence ledger. Outputs: PASS/BLOCK with missing/stale evidence IDs.