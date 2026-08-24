# Workflow: Transactional Compaction

## Trigger
Context threshold, manual compact request, provider-native compaction, or session rotation.

## Goal
Reduce active context without losing recoverable source evidence.

## Inputs
Stable source transcript, ledger, archive destination.

## Baseline
Measure current source count/hash and reproduce whether the host can lose history on compaction/interruption.

## Context
The summary is derived evidence only; the source transcript/archive is authoritative for recovery.

## Stages
1. **Observe** — identify compaction trigger and persistence boundaries.
2. **Measure baseline** — record source count/hash and current recovery behavior.
3. **Diagnose** — locate destructive operations preceding durable archive/session commit.
4. **Form hypothesis** — precommit + post-verify should eliminate silent source loss.
5. **Implement** — write ledger precommit; create/archive/rotate without deleting source.
6. **Measure again** — run deterministic postcheck against source or archive.
7. **Improved?** — if no, retry validation at most twice only for transient storage visibility; otherwise stop.
8. **Verify** — independent Durability Verifier tests interruption and mutation fixtures.
9. **Complete** — only after durability proof may host prune source according to retention policy.

## Responsible agent
Session/compaction implementer for stages 1–7; `subagents/durability-verifier.md` for stage 8.

## Tools
`scripts/compaction_durability.py`, filesystem/session-store inspection, unit tests.

## Outputs
Precommit ledger, postcheck result, baseline/after evidence, verifier record.

## Checkpoints
Precommit ledger must exist before mutation. Destructive prune is blocked until postcheck succeeds.

## Metrics
Verified-durable rate, mismatches, interrupted recovery success, overhead milliseconds.

## Retry policy
At most 2 postcheck retries for explicitly transient storage visibility. No retries for deterministic hash/count mismatch.

## Stop conditions
Missing ledger, malformed transcript, mismatch, missing archive/source, or verifier failure.

## Failure path
Preserve all artifacts, abort pruning/rotation finalization, escalate to session owner with evidence.

## Verification
Pass source-preserved, archive-fallback, mutation, truncation, missing-file, and malformed-input fixtures.

## Definition of Done
Implemented: precommit/postcheck boundary integrated. Measured: baseline and post-change evidence captured. Verified: every completed compaction retains a matching recoverable source/archive and all destructive paths are gated.
