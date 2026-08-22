# Workflow — Two-Phase Governance-Safe Compaction

## Trigger
Automatic/manual context compaction, history truncation, summary replacement, or resume from compacted state.

## Goal
Reduce active context without changing the authoritative security state or authorization outcome.

## Inputs
Current context, authoritative governance ledger, active constraints, approvals, compaction strategy, protected-tool policy.

## Baseline
Record active-context tokens/bytes, all active constraint IDs/versions/hashes, expected protected-action decisions, and last known-good context identifier.

## Context
Governance state is authoritative outside the lossy transcript. The candidate summary/context is untrusted until validated.

## Stages
1. **Snapshot** — freeze IDs/hashes for active governance state and record last known-good context.
2. **Generate candidate** — compact conversational/tool history without committing replacement.
3. **Pin** — insert or attach stable references to every active required constraint.
4. **Validate** — run `scripts/governance_coverage.py` and reject missing/stale/hash-mismatched pins.
5. **Decision parity test** — run representative protected actions before/after using authoritative action-time lookup.
6. **Adversarial test** — include content attempting to downgrade or omit a policy; authorization must remain unchanged.
7. **Commit** — atomically make the validated candidate current.
8. **Post-commit verify** — reload the current state and repeat coverage validation.

## Responsible agent
Implementation/compaction agent for stages 1–7; `subagents/governance-verifier.md` for independent post-change acceptance.

## Tools
Context compactor, governance ledger, deterministic coverage script, isolated test runner, audit log.

## Outputs
Candidate/committed context ID, before/after size, governance coverage report, parity results, rollback evidence, verification status.

## Checkpoints
Snapshot complete; candidate not yet authoritative; 100% governance coverage; parity tests pass; commit atomicity confirmed.

## Metrics
Context reduction %, constraint coverage %, stale pins, unauthorized fixture actions, rollback success, decision parity.

## Retry policy
At most 2 candidate-generation retries. Change the compaction strategy between retries; do not repeatedly submit the same failing candidate.

## Stop conditions
Stop with success after post-commit verification. Stop blocked if authoritative ledger is unavailable or any required constraint cannot be preserved/reloaded.

## Failure path
Discard candidate, retain last known-good context, log mismatches, and fail closed for protected actions if authoritative state cannot be loaded.

## Verification
Independent verifier must reproduce coverage and policy-decision parity.

## Definition of Done
Compaction reduces context, all required governance state remains authoritative and referenced, protected-action decisions are unchanged, rollback is proven, and independent verification passes.
