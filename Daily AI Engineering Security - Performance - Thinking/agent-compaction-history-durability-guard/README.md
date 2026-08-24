# Agent Compaction History Durability Guard

## Topic
Transactional durability for source conversation history across context compaction and session rotation.

## Category
Thinking

## Problem
A compaction summary may survive while the source turns it summarizes are lost, truncated, or never serialized. That destroys the evidence needed for audit, recovery, assumption checking, and reliable long-running task continuation.

## Evidence
See `evidence/research.md` for August 2026 reports from Hermes Agent and DeepSeek harness showing source-history loss, interrupted-compaction deletion, prompt loss, and cross-layer pruning conflicts.

## Existing approach
Threshold-based summarization, child-session handoffs, transcript/session persistence, provider-native checkpoints, and local pruning.

## Existing limitations
Persistence and compaction are often separate operations. Synthetic summaries can remain even when the original transcript disappears, and destructive pruning can precede durable archive confirmation.

## Proposed improvement
Treat compaction as a transactional state transition: write a precommit count/hash ledger, preserve the source or create an exact archive, then verify post-compaction durability before any destructive pruning/finalization.

## Architecture
- `evidence/research.md` — current evidence and root-cause analysis.
- `skills/verify-compaction-durability.md` — reusable durability procedure.
- `rules/compaction-durability.md` — enforceable invariants.
- `subagents/durability-verifier.md` — independent verifier.
- `workflows/transactional-compaction.md` — bounded integration flow.
- `hooks/pre-post-compaction.md` — blocking pre/post checkpoints.
- `scripts/compaction_durability.py` — dependency-free ledger and verifier.
- `tests/test_compaction_durability.py` — source/archive/mutation/truncation tests.

## Installation
Requires Python 3.9+. Copy this directory into the host project. No third-party Python packages are required.

## Configuration
The host supplies stable transcript JSONL, ledger path, and optional archive JSONL. The tool intentionally hashes raw source bytes and validates every non-empty line as JSON.

## Usage
Precommit: `python3 scripts/compaction_durability.py precommit --source session.jsonl --ledger ledger.json`

Postcheck: `python3 scripts/compaction_durability.py postcheck --ledger ledger.json --source session.jsonl --archive archive.jsonl`

Exit 0 means precommit/verification success; exit 2 blocks due to missing/mismatched durable evidence; exit 3 indicates malformed input or ledger failure.

## Workflow
Follow `workflows/transactional-compaction.md`: measure baseline, identify destructive boundaries, add precommit, compact without deleting evidence, postcheck, independently verify, then permit pruning.

## Metrics
Verified-durable compaction rate, count/hash mismatches, interrupted recovery success, unrecoverable-history incidents, and verification overhead.

## Verification
Run `python3 -m unittest tests/test_compaction_durability.py`. Source-preserved and archive-fallback cases must pass; mutation, truncation, missing/malformed evidence must block or error deterministically.

## Safety
The validator never deletes source/history. A model-generated summary is never accepted as a replacement for source evidence. Destructive actions remain outside this package and must be gated on postcheck success.

## Failure handling
Detection: exit 2/3 or verifier failure. Evidence: ledger plus source/archive metadata. Retry: at most two postcheck retries only for known transient storage visibility. Fallback: retain source and abort destructive finalization. Escalation: session/storage owner. Stop: deterministic mismatch, malformed data, missing durable evidence, or failed independent verification.

## Definition of Done
**Implemented:** precommit/postcheck guards integrated around compaction. **Measured:** baseline recovery and post-change metrics captured. **Verified:** every finalized compaction has a recoverable source or exact matching archive, destructive pruning is blocked on failure, tests pass, and an independent verifier confirms the invariants.

## Customization
Adapters may map database/session records into stable JSONL snapshots, but MUST preserve record ordering and byte-stable evidence for the duration of an attempt or compute an equivalent canonical digest with documented semantics.
