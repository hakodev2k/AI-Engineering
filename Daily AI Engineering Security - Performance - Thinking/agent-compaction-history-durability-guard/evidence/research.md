# Research — Agent Compaction History Durability Guard

## Topic
Preserve source history and transactional durability across context compaction/session rotation.

## Category
Thinking

## Problem
Context compaction can preserve a generated summary while deleting or failing to persist the source turns it summarized. Long-running agents then lose the audit trail needed to verify assumptions, reconstruct decisions, recover from summary errors, or safely resume after interruption.

## Why it matters now
Fresh August 2026 reports show compaction/session-rotation bugs that permanently lose conversation history or prompts. These failures are operationally distinct from normal lossy summarization: the original evidence disappears, making later verification and recovery impossible.

## Affected users
Developers running long coding sessions, autonomous agent operators, teams relying on resumable sessions, audit/review workflows, platforms implementing context compaction.

## Current public evidence

### Observed evidence
1. Hermes Agent issue #92080, opened 2026-08-22: compaction ends the current session with reason `compression` and creates a child, but parent messages are serialized only on clean session end; the parent can therefore export `messages: []` while the generated summary survives. https://github.com/NousResearch/hermes-agent/issues/92080
2. Hermes Agent issue #79391, opened 2026-08-05: interrupting auto-compaction could permanently delete pre-compaction session history with no summary/archive and visible message-ID gaps. https://github.com/NousResearch/hermes-agent/issues/79391
3. DeepSeek harness discussion #1768, 2026-08-15: a user prompt could be lost when a turn was aborted during auto-compaction, while the UI exposed no distinct compaction state. https://github.com/deepseek-ai/deepseek-harness/discussions/1768
4. Hermes Agent issue #90975, opened 2026-08-20: native pruning could discard locally generated compression summaries before checkpoint processing, showing that multiple compaction layers can invalidate each other's durability assumptions. https://github.com/NousResearch/hermes-agent/issues/90975

### Interpretation
A compaction summary must be treated as a derived artifact, not the sole durable record. Correctness requires an atomic boundary: persist source history or an immutable archive before committing a summary/session rotation, and never acknowledge compaction as complete when the source evidence is not recoverable.

## Existing approaches
- Automatic threshold-based summarization.
- Child-session handoffs and synthetic summaries.
- Session databases/transcript exports.
- Native provider checkpoints plus local pruning.
- Manual `/compact` or equivalent commands.

## Remaining limitations
- Session rotation and transcript persistence may occur in different transactions.
- Compaction can be interrupted after destructive mutation but before archive/summary commit.
- Synthetic summaries are not sufficient evidence for audits or recovery.
- Multiple compaction/pruning layers can delete each other's metadata/artifacts.
- Many systems lack deterministic pre/post invariants proving source-history durability.

## Root-cause analysis
1. Compaction is modeled as prompt optimization rather than a state transition with transactional guarantees.
2. Source turns, summary, archive metadata, and child-session creation are committed independently.
3. Recovery paths assume successful clean shutdown/serialization.
4. Destructive pruning can happen before durable evidence is confirmed.
5. Verification checks focus on token reduction, not recoverability and provenance.

## Improvement opportunity
Add a deterministic durability ledger around compaction. Before compaction, hash and count source records and write a precommit snapshot/manifest. After compaction, verify that either the source transcript remains durable or an immutable archive exists and matches the precommit hash/count. Only then mark compaction committed and permit destructive pruning/session rotation.

## Goal
Make every compaction recoverable and auditable without requiring the model's hidden reasoning.

## Metrics
- compactions with verified durable source / total compactions
- source-message count before vs archived count
- hash mismatches
- interrupted-compaction recovery success rate
- unrecoverable-history incidents
- verification latency overhead

## Trigger
Before and after automatic/manual compaction, provider-native pruning, or session rotation caused by context pressure.

## Inputs
Source transcript JSONL, optional archive path, compaction ledger path.

## Outputs
Precommit manifest, committed/blocked durability decision, source hash/count, archive verification report.

## Relevant sources
See the four public sources above. Claims are summarized rather than reproduced.
