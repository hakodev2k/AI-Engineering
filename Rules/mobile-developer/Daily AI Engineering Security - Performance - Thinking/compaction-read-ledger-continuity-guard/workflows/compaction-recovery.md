# Workflow: Compaction Read-Ledger Recovery

## Trigger
Immediately after context compaction or session-state reconstruction.

## Goal
Restore enough durable artifact identity to prevent unchanged full-content rereads while permitting changed or newly required content.

## Inputs
Durable ledger entries, compacted-summary artifact coverage, current artifact versions/hashes, and pending read request.

## Baseline
Record whether the pre-compaction runtime would perform a full read and the token size of that payload.

## Stages
1. Load the durable ledger outside model history.
2. Validate ledger format and artifact identity; invalid entries are ignored safely, not guessed.
3. For a requested artifact, resolve current content/version hash without injecting full content when the platform supports cheap metadata/hash checks.
4. If hash matches a ledger entry represented by retained context/summary, return a lightweight reference or requested delta/range.
5. If hash changed, identity is uncertain, or the required range was never captured, perform the necessary read and update the ledger.
6. Emit a trace event so replay metrics remain measurable.
7. Run the post-compaction hook. One corrective retry is allowed for a recoverable ledger serialization error.

## Responsible agent
Runtime/context implementation; Verification Agent audits behavior.

## Tools
Artifact metadata/hash API, durable session store, read tool, profiler, tests.

## Outputs
Restored ledger state, read/reference decision, trace event, and validation status.

## Checkpoints
A matching path without a matching hash is never considered unchanged. A summary reference is used only if the relevant content is actually represented.

## Metrics
Post-compaction unchanged full reads, tokens avoided, changed-artifact refresh accuracy, recovery errors.

## Retry policy
Maximum one retry for a deterministic recoverable ledger-load failure. No repeated rereads as a fallback loop.

## Stop conditions
Continue normal execution after a validated decision. If identity/version cannot be established, perform the required safe read rather than risking context loss.

## Failure path
Favor correctness: read required content, mark continuity degraded, collect evidence, and escalate recurring ledger failures. Do not fabricate reuse state.

## Verification
Changed-content tests must force a new read; unchanged-content tests after compaction must avoid a second full payload when the ledger is valid.

## Definition of Done
Ledger is restored or safely degraded, read decision is traceable, no incorrect stale reuse occurs, and replay metrics remain available.
