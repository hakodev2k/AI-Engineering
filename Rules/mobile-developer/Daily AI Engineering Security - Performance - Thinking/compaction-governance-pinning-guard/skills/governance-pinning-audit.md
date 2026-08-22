# Skill — Governance Pinning Audit

## Purpose
Verify that every active security constraint survives context compaction through authoritative storage and deterministic references rather than lossy summary text alone.

## Trigger
Before deploying a compaction strategy, after changing summarization/truncation logic, when resuming compacted sessions, or after evidence of policy drift.

## Inputs
Governance ledger, pre-compaction context, candidate compacted context, compaction metadata, policy hashes, approval records, protected tool list.

## Preconditions
Authoritative constraints are enumerable and have stable identifiers. A candidate can be generated without immediately destroying the previous state.

## Required context
Only active security constraints, their scope/version/hash, relevant compaction code, action-time authorization path, and test fixtures.

## Allowed tools
Repository inspection, deterministic scripts, test harness, structured logs, isolated agent/tool simulation.

## Constraints
Never ask the model to reveal hidden reasoning. Never treat semantic similarity as proof that a constraint survived. Never mutate production policy during verification.

## Procedure
1. Enumerate active constraints and approvals from the authoritative ledger.
2. Compute/verify canonical hashes and expected scopes.
3. Generate a compaction candidate without committing it.
4. Extract pinned constraint references from the candidate/application context.
5. Run `scripts/governance_coverage.py` to compare required vs present references.
6. For each mismatch classify: missing, stale version, hash mismatch, expired approval, revoked constraint, or scope conflict.
7. Run adversarial fixtures where conversational text pressures the summarizer to omit/relax a policy.
8. Execute protected tool decisions using the compacted context while forcing authorization to resolve the authoritative ledger.
9. Commit only if coverage is complete and protected actions preserve the expected allow/deny outcome.
10. Hand evidence to an independent verifier.

## Decision points
- Missing reference: reject candidate.
- Stale version/hash: reload current constraint and invalidate dependent stale approvals.
- Ledger unavailable: fail closed for protected actions.
- Context cannot fit while retaining required pins: reduce non-governance context, not governance requirements.

## Expected output
Coverage report, mismatch list, action-decision comparison, candidate status (`safe-to-commit`, `reject`, `blocked`), and evidence paths.

## Metrics
Constraint coverage %, stale-reference count, unauthorized actions in adversarial fixtures, compaction rollback count, policy-decision parity before/after compaction.

## Verification
100% active required constraints covered; no hash/scope mismatch; before/after protected-action decisions match expected policy; independent verifier passes.

## Failure handling
Retry candidate generation at most twice with a different compaction strategy. If required governance still cannot fit or reconcile, stop and escalate.

## Stop conditions
Stop on verified safe candidate or any unreconciled authoritative-policy failure.
