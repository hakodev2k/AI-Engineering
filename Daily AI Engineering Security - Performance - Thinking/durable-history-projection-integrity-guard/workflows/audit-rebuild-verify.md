# Workflow: Audit → Rebuild → Verify

## Trigger
Resume/reopen/migration or any signal that rendered/projected history is incomplete or has contradictory state.

## Goal
Restore a trustworthy projection from durable evidence without losing records or allowing unverified continuation.

## Inputs
Durable JSONL, projected JSONL, runtime state, critical-event policy, projection/parser version if known.

## Baseline
Hash both inputs; record record counts, ordinal range, projected coverage, terminal events, projected/runtime status, and first discrepancy.

## Context
The durable log is read-only authoritative evidence. A projection is a derived cache/view and may be rebuilt.

## Stages
1. **Observe** — capture visible symptom and runtime state. Responsible: coordinator.
2. **Measure baseline** — run the audit and preserve hashes. Responsible: verifier.
3. **Diagnose** — classify first failure as schema/parser, ordinal/cursor, terminal reconciliation, or renderer hydration.
4. **Form hypothesis** — select one concrete repair mechanism and expected audit delta.
5. **Implement improvement** — rebuild a new projection from durable input; quarantine only unsupported non-critical records with ordinal/type/hash/reason. Never edit the durable source.
6. **Measure again** — run audit against rebuilt projection.
7. **Improved?** If no, revise once. Maximum two repair attempts total.
8. **Verify** — independent verifier runs the same audit and checks hashes/terminal state.
9. **Complete** — swap/consume repaired projection only after verification and host-level safe replacement semantics.

## Tools
`python scripts/history_projection_audit.py`, read-only hashes/log inspection, host-specific projection builder, independent verifier.

## Outputs
Baseline report, repair manifest, rebuilt projection, after-report, verification result.

## Checkpoints
Durable hash before repair; first failing ordinal identified; repair attempt count; post-rebuild coverage; terminal reconciliation; independent verification.

## Metrics
Coverage before/after, missing critical ordinals, mismatch count, rebuild attempts, diagnosis time, repeated-work avoided.

## Retry policy
At most 2 repair attempts. The same deterministic failure may only be retried when parser/migration/quarantine handling changes.

## Stop conditions
Stop immediately on durable-source corruption or hash change. Stop after second failed repair, missing critical durable evidence, verifier rejection, or unresolved terminal contradiction.

## Failure path
Keep original projection and durable source, mark the session `invalid`/read-only, emit evidence bundle, and escalate. Never discard durable records or mark complete merely to restore UI continuity.

## Verification
The repair agent cannot be the only verifier. Audit tests must pass and the repaired projection must have no critical gaps or terminal contradiction.

## Definition of Done
Evidence preserved; baseline measured; root failure classified; bounded repair applied; before/after metrics captured; tests pass; independent verification succeeds; no blocking issue remains.
