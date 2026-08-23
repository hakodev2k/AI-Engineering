# Compaction Trigger Source-of-Truth Guard

**Category:** Token

## Problem
Agent runtimes can persist cumulative run usage as if it were the current prompt/context snapshot. Compaction then fires at low real utilization, consumes extra summarization calls, and discards useful context.

## Evidence
Public OpenClaw reports in July–August 2026 show `totalTokens` becoming much larger than any single request, being marked fresh, and driving repeated or premature compaction. See `evidence/research.md`.

## Proposed improvement
Treat compaction eligibility as a typed data-integrity decision. Only an explicitly identified current-context snapshot may drive the threshold. Cumulative billing/run usage, cache accounting, historical totals, or stale post-compaction values are rejected.

## Architecture
- `skills/context-snapshot-audit.md`: investigation procedure.
- `rules/compaction-source-rules.md`: enforceable invariants.
- `subagents/token-verifier.md`: independent verifier.
- `workflows/measure-fix-verify.md`: bounded remediation flow.
- `hooks/pre-compaction-gate.md`: deterministic integration contract.
- `scripts/compaction_guard.py`: executable validator.
- `tests/test_compaction_guard.py`: regression tests.
- `evidence/research.md`: current evidence and limitations.

## Installation
Python 3.10+; no third-party dependencies.

## Usage
`python scripts/compaction_guard.py snapshot.json --context-window 1000000 --threshold 0.90`

Input JSON accepts `current_prompt_tokens`, `run_total_tokens`, `cache_read_tokens`, `cache_write_tokens`, `snapshot_fresh`, `snapshot_source`, and optional `post_compaction_prompt_tokens`.

Exit codes: `0` safe/valid, `2` invalid token snapshot, `3` compaction should run, `4` input/config error.

## Metrics
False compaction rate, compactions/task, tokens summarized unnecessarily, context utilization at compaction, summarization cost/task, and post-compaction freshness violations.

## Verification
Run `python -m unittest tests/test_compaction_guard.py`. Verification requires cumulative usage to be rejected as a context snapshot, stale metadata to block compaction decisions, valid last-call snapshots to pass, and genuine threshold pressure to request compaction.

## Safety
The guard never deletes or summarizes context. It only validates whether a compaction decision has trustworthy input.

## Failure handling
Invalid or ambiguous snapshots block automatic compaction and require recomputing current prompt occupancy from a trusted source. No retry loop exceeds two recomputations.

## Definition of Done
Evidence documented; baseline captured; source semantics explicit; guard integrated; tests pass; before/after compaction rate measured; no required context lost; independent verifier signs off.