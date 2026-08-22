# Checkpoint Resume Workflow

## Trigger
A long-running or failure-prone background job must support safe interruption and resume.

## Entry conditions
Job identity, input source, chunking strategy, side effects, and test environment are known.

## Inputs
Repository, job requirements, source data or fingerprintable input, checkpoint policy, and existing tests/logs.

## Stages
1. **Context — Job Planner:** locate entry point, ordering, side effects, transaction boundaries, and current failure behavior.
2. **Plan — Job Planner:** define cursor semantics, input fingerprint, checkpoint durability, retry classification, and approval boundaries.
3. **Implement — Implementation owner:** integrate checkpoint initialization, pre-resume verification, commit-before-checkpoint ordering, failure recording, and completion state.
4. **Test — Implementation owner:** run unit/integration tests plus `tests/test_checkpoint_gate.py`.
5. **Review — Verification Agent:** inspect diff and prove no checkpoint can advance ahead of committed work.
6. **Failure simulation — Verification Agent:** simulate interruption after commit/before checkpoint and before commit; confirm replay behavior is safe.
7. **Verify — Verification Agent:** verify identity mismatch, input drift, completed checkpoint rejection, bounded retries, and preserved evidence.
8. **Complete — workflow owner:** record final verification status and remaining risks.

## Produced artifacts
Checkpoint file, test/build evidence, verification result, and any approval request based on `templates/replay-approval.md`.

## Checkpoints
- After planning: cursor and durability semantics must be explicit.
- After implementation: diff must contain no unrelated changes.
- Before resume of committed non-idempotent effects: human approval is mandatory.
- Before completion: verification status must be `passed`.

## Retry rules
Maximum three automatic retries. Retry only transient network/tool failures. Preserve the same checkpoint and evidence. Validation, identity, fingerprint, permission, business-rule, or ambiguous replay failures are non-retryable and must stop.

## Failure paths
- Corrupt checkpoint → stop, preserve file, reconstruct only with human-reviewed evidence.
- Input fingerprint mismatch → stop and create a new explicitly scoped job; never reuse the checkpoint.
- Side-effect ambiguity → stop before replay and request approval.
- Test/build failure → preserve output, fix once per evidence, rerun; after three failed cycles escalate.

## Approval points
Production data deletion, schema/infrastructure/secret/config changes, breaking contracts, irreversible migrations, or replay of non-idempotent committed effects require explicit human approval.

## Definition of Done
Required context exists; checkpoint semantics are deterministic; implementation and tests exist; build/test checks pass; resume safety is independently verified; approvals are recorded when required; remaining risks are documented; no blocking failure remains.
