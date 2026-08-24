# Skill: Verify Compaction Durability

## Purpose
Prove that source conversation evidence remains recoverable across compaction and session rotation.

## Trigger
Before destructive pruning and immediately after compaction/archive creation.

## Inputs
Source transcript JSONL, ledger path, optional archive JSONL.

## Preconditions
The source transcript is quiescent for the precommit measurement or the host provides a stable snapshot.

## Required context
Session identifier, compaction attempt id, source/archive paths, persistence boundary.

## Allowed tools
Read/hash files, write ledger records, run deterministic validator, inspect non-secret metadata.

## Constraints
Do not infer durability from a model-generated summary. Do not delete or rewrite source evidence.

## Procedure
1. Capture source record count and SHA-256 digest using `scripts/compaction_durability.py precommit`.
2. Persist the ledger before compaction mutates session state.
3. Run compaction/archive logic in the host.
4. Verify the source transcript still matches the ledger, or verify an archive matches the same count/hash.
5. If verification succeeds, mark the attempt committed externally and permit pruning.
6. If verification fails, block destructive finalization and preserve all evidence.
7. Independently inspect failure evidence before retrying.

## Decision points
Source matches: pass. Source missing but archive matches: pass. Any mismatch/missing evidence: block.

## Expected output
Machine-readable decision with count, digest, matched path, and failure reason.

## Metrics
Verified-durable compaction rate, hash/count mismatch rate, recovery success, validation overhead.

## Verification
Tests must cover unchanged source, valid archive fallback, truncation, mutation, missing files, and malformed JSONL.

## Failure handling
Preserve ledger/source/archive. Retry validation at most twice only when storage visibility is eventually consistent. Otherwise escalate.

## Stop conditions
Stop on deterministic mismatch, parse failure, or exhausted retries. Do not weaken the invariant to complete compaction.
