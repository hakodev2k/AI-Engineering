# Research Evidence

## Topic
Rollout History Fidelity Gate

## Category
Thinking

## Problem
Agent session migrations and resume projections can silently omit, duplicate, or stop projecting valid history records while still appearing successful. That leaves the model operating from incomplete or distorted history even when the canonical rollout remains intact.

## Why it matters now
Recent Codex reports in July-August 2026 show multiple concrete fidelity failures: oversized valid JSONL records dropped during migration, compatibility events duplicated into canonical history, valid rollout records skipped by inconsistent decoders, and projection cursors left permanently desynchronized so resume shows only the first turn of a long thread.

## Affected users
Developers using long-running coding agents, agent-platform teams that migrate transcript formats, operators maintaining projected/indexed session stores, and users relying on resume/fork/history correctness.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #37673 reports `migrate-rollouts --apply` silently dropping valid records larger than 16 MiB while still returning a successful migrated status; dry-run did not detect the loss. The report observed 10 oversized records across three real legacy rollouts, totaling about 231 MiB.
2. Codex issue #37670 reports a different migration-fidelity failure: one logical user input materialized twice because both the canonical item and deprecated compatibility event were projected as completed user items.
3. Codex issue #35746 documents valid flattened rollout records being skipped by readers that used different decoding semantics, causing ordinal reuse and a permanently lagging SQLite projection.
4. Codex issue #38792 reports 398 corrupted projection cursors in one store. Affected resumes showed only the first turn even though the rollout was complete; full re-projection repaired the state.

### Interpretation
These reports share a boundary problem rather than one parser bug: derived history is trusted without a deterministic fidelity contract against the canonical source. Success states can be emitted even when records were omitted, duplicated, reordered, or projection cursors no longer describe the source.

## Existing approaches
- Format-specific migration tests.
- Dry-run/eligibility checks.
- SQLite integrity checks.
- Ordinal/cursor bookkeeping.
- Manual deletion and rebuild of derived projection rows.
- Backups before migration in some operator workflows.

## Remaining limitations
- Database integrity does not prove semantic parity with the canonical rollout.
- Dry-run may not scan every record or exercise the same transform as apply.
- Record-count equality alone misses duplicates replacing omitted records.
- Projection cursors can be internally valid values yet point to the wrong source boundary.
- Successful migration status may not encode skipped or synthesized records.
- Existing corrupted state may need deterministic rebuild even after the writer bug is fixed.

## Root-cause analysis
1. Multiple readers/transformers use non-identical decoding and canonicalization semantics.
2. Migration success is based on completion, not source-to-target fidelity invariants.
3. No content fingerprint ledger binds each source record or logical item to its target representation.
4. Dry-run and apply can follow different code paths.
5. Projection cursors are not always validated against the source record at the stored byte offset/ordinal.
6. Compatibility aliases are not consistently separated from canonical logical items.

## Improvement opportunity
Add a reusable fail-closed fidelity gate around migration, projection, resume repair, and format conversion. The gate captures a baseline source ledger; classifies canonical vs compatibility records; fingerprints logical items; verifies ordinal/offset monotonicity; detects omissions/duplicates; compares dry-run and apply plans; and requires a recoverable backup plus independent verification before source replacement or success status.

## Goal
No silent history loss, duplication, or projection drift across tested transformations.

## Metrics
Source records, target records, canonical logical-item count, omitted fingerprints, duplicate fingerprints, reordered ordinals, invalid cursor boundaries, dry-run/apply plan delta, repair count, verification pass rate.

## Trigger
Before any history migration, projection rebuild, resume repair, storage-format conversion, or destructive replacement of a canonical session artifact.

## Inputs
Canonical rollout JSONL, optional projected/exported JSONL, optional cursor metadata, compatibility-record policy.

## Outputs
Machine-readable fidelity report, PASS/BLOCK decision, repair/rebuild recommendation, before/after evidence.

## Relevant sources
- https://github.com/openai/codex/issues/37673
- https://github.com/openai/codex/issues/37670
- https://github.com/openai/codex/issues/35746
- https://github.com/openai/codex/issues/38792
- https://github.com/openai/codex/issues/38552
- https://github.com/openai/codex/issues/38341
