# Workflow: Review → Approve Source → Verify

## Trigger
Plugin/integration install or update introduces new/changed hooks.

## Goal
Approve only intended executable hooks with durable source provenance.

## Inputs
Hook declarations JSON, plugin/installer identity, policy and existing ledger.

## Baseline
Count pending hooks by source, unattributed hooks, global approvals and current trusted hashes.

## Stages
1. **Observe** — enumerate hooks without execution.
2. **Measure baseline** — attribute source and count pending changes.
3. **Diagnose** — identify provenance flattening or missing metadata.
4. **Form hypothesis** — determine whether compatibility installation changed origin metadata.
5. **Implement** — create/update source-scoped ledger only after human review.
6. **Measure again** — run source-specific verification.
7. **Verify** — `subagents/security-verifier.md` confirms no unrelated approvals changed.

## Responsible agent
Installer/integration owner implements; Hook Trust Security Verifier independently verifies.

## Tools
Python 3, plugin metadata and platform hook inventory.

## Outputs
Per-source trust diff, reviewed ledger and verification evidence.

## Checkpoints
Before approval, after ledger write and after plugin update.

## Metrics
Unattributed hook count, review scope size, accidental cross-source approvals and stale hashes caught.

## Retry policy
At most one re-attribution attempt when metadata is incomplete. Do not repeatedly guess source identity.

## Stop conditions
Missing source identity, command mismatch, policy denial or verifier rejection.

## Failure path
Keep the hook pending/disabled and escalate to a human/platform owner. Never use a trust-bypass flag to complete the workflow.

## Definition of Done
Ledger implemented; measured hook inventory matches; exact hash/source bindings verify; unrelated hooks remain pending/trusted exactly as before.
