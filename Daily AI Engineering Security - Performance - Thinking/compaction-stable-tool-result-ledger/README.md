# Compaction-Stable Tool Result Ledger

**Category:** Token  
**Research date:** 2026-08-26 (UTC+7)

## Problem
Long agent sessions repeatedly resend large historical tool outputs and can lose deduplication state during context compaction. This inflates tokens, causes repeated file/resource reads, and can destroy prompt-cache locality.

## Evidence
See `evidence/research.md`. Recent August 2026 Hermes Agent reports cover repeated tool outputs, dedup state loss after compaction, and replay-byte changes that break provider prompt caching. Vercel AI users also report dynamic tool activation invalidating prompt caches.

## Existing approach
Byte caps, summarization, context compaction, retrieval, prompt caching, and in-memory dedup maps.

## Existing limitations
Compaction may discard the fingerprints needed to avoid re-reading; summaries can drift; byte caps still resend duplicate content; prompt caches require stable prefixes; in-memory state disappears after restart.

## Proposed improvement
Maintain a compact durable ledger of tool-result fingerprints, provenance, safe summaries, freshness and relevance metadata outside the transcript. Project only unique relevant entries and rehydrate raw data on demand.

## Architecture
- `evidence/research.md`
- `skills/context-budget-analysis.md`
- `rules/context-ledger.md`
- `subagents/token-verifier.md`
- `workflows/profile-compact-verify.md`
- `scripts/context_ledger.py`
- `tests/test_context_ledger.py`

## Installation
Python 3.10+; standard library only.

## Usage
`python scripts/context_ledger.py ingest --ledger state/ledger.jsonl --event tool-result.json`  
`python scripts/context_ledger.py project --ledger state/ledger.jsonl --max-chars 6000`

## Metrics
Input tokens/task, duplicate raw bytes projected, cache-hit behavior, raw re-injections, latency/task, result quality, regression rate.

## Verification
Run `python -m unittest tests/test_context_ledger.py` and compare baseline/post-change tasks.

## Safety
Critical context MUST NOT be removed merely to save tokens. Events marked `secret=true` are rejected from plaintext ledger persistence.

## Failure handling
On invalid ledger state, stop the optimization and use safe source-grounded context. Repair once; escalate if required source data is unavailable.

## Definition of Done
**Implemented:** ledger/projection integrated.  
**Measured:** baseline and post-change token metrics captured.  
**Verified:** duplicate projection decreases with equivalent task quality and no critical context loss.

## Customization
Add secure blob stores or relevance models while preserving stable fingerprints, provenance, freshness, and explicit budgets.