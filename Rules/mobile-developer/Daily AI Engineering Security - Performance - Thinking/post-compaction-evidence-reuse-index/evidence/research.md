# Research — Post-Compaction Evidence Reuse Index

## Topic
Long-running coding agents can enter a compact → forget → re-read/re-run → refill loop because compaction removes durable knowledge that an unchanged file or command result was already inspected.

## Category
Token

## Problem
After context compaction, an agent often needs to recover facts it previously obtained from large source files, tests, logs, or tool outputs. Without a durable, freshness-aware evidence index, the safest-looking action is to read or execute the same expensive artifact again. Large results then refill context and can trigger another compaction, multiplying input/cached tokens and latency.

## Why it matters now
OpenAI Codex issue #36664 (2026-08-03) reported a 5.9-hour session with 74 compactions, where 70/74 compactions were followed within two minutes by re-reading a previously read file or re-running a previous test. The session accumulated 9.47M ordinary tokens plus 183.9M cached-input tokens. Issue #37090 reported multi-task abnormal token usage and explicitly asked whether repeated compaction/file rereading contributed. Issue #37135 identified a separate post-compaction token-accounting problem where a bytes/4 estimate can replace measured token usage, showing that compaction state and token control remain fragile.

## Affected users
Developers using long-lived coding agents in large repositories, teams running expensive test/log workflows, and agent-platform builders managing context compaction and session persistence.

## Current public evidence
### Observed evidence
1. OpenAI Codex #36664: 74 compactions in 5.9 hours; 95% followed within two minutes by a previously read file or previously run test; several large files were fetched many times; 119 command outputs reached a ~40k-character truncation ceiling. https://github.com/openai/codex/issues/36664
2. OpenAI Codex #37090: reported 3.17B tokens over roughly 62 hours across many tasks and specifically raised repeated context reconstruction, compaction/file rereading, background loops, and polling as possible contributors. https://github.com/openai/codex/issues/37090
3. OpenAI Codex #37135: reported post-compaction token-state estimation replacing measured usage for non-ASCII sessions, affecting when future compaction triggers. https://github.com/openai/codex/issues/37135
4. Anthropic Claude Code #29890 documents a related correctness failure: compaction can lose previously established working knowledge and cause retries of approaches already known to fail. https://github.com/anthropics/claude-code/issues/29890

### Interpretation
Compaction is not only a summarization problem. It is an evidence-addressability problem: after a large artifact leaves active context, the agent lacks a cheap, deterministic way to know whether a previously observed result is still fresh. Re-reading everything is correct but expensive; trusting a summary without freshness evidence is cheap but unsafe.

### Proposed solution
Persist a small evidence index outside model context. Each inspected file is keyed by normalized path and SHA-256. Each expensive command result is keyed by normalized command plus a caller-supplied state fingerprint (for example Git HEAD + relevant input hashes) and references an artifact file containing the exact result. After compaction, query the index first. Reuse only when freshness checks pass; otherwise re-read/re-run. Return compact metadata/reference rather than automatically injecting the full artifact.

## Existing approaches
- Compaction summaries.
- Agent memory/checkpoint files.
- Re-read files and re-run tests after compaction.
- Prompt caching of repeated context.

## Remaining limitations
- Summary text does not prove source freshness.
- Blind reuse can hide source/test changes.
- Prompt caching still processes/re-meters repeated context and does not prevent tool execution.
- Command results require a meaningful state fingerprint; command string alone is insufficient.
- Some evidence must be reloaded for correctness, so optimization must be conservative.

## Root-cause analysis
1. Evidence identity is implicit in transient conversation state.
2. Compaction preserves prose but not reliable content hashes/provenance for every artifact.
3. Re-fetch is the default verification mechanism after memory loss.
4. Large outputs increase the probability of the next compaction.
5. Existing caches often optimize transport/model prefix reuse, not semantic evidence freshness.

## Improvement opportunity
A small durable index can let agents distinguish “already observed and unchanged” from “must refresh” without storing full artifacts in the prompt. It provides an explicit correctness gate before token-saving reuse.

## Goal
Reduce redundant post-compaction reads/runs and tokens while preserving correctness through freshness checks.

## Metrics
- duplicate file reads/session;
- duplicate command runs/session;
- bytes/tokens reinjected after compaction;
- compactions/hour;
- cache/index hit rate;
- stale-hit rejection rate;
- task latency;
- quality/regression rate versus baseline.

## Trigger
After compaction/session resume and before reading a large previously seen file or repeating an expensive command.

## Inputs
Evidence index path, file path or command key, current content hash/state fingerprint, and optional exact-result artifact path.

## Outputs
`fresh-reference`, `stale-refresh-required`, `missing`, or `invalid`, with evidence metadata.

## Status
**Implemented:** index script, policy, workflow, hook, verifier, tests.

**Measured:** only after baseline/post-adoption telemetry.

**Verified:** only when token/read/run counts fall without stale evidence reuse or correctness regression.
