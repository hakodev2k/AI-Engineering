# Compensation Governance

## MUST
- Bind execution to an immutable plan fingerprint and repository revision.
- Use one stable operation key per side effect.
- Persist precondition and postcondition evidence outside transient agent memory.
- Treat timeout/disconnect/ambiguous provider response as `unknown`, not failure.
- Reconcile `unknown` outcomes with authoritative read-back before retry or compensation.
- Compensate only effects proven to have succeeded.
- Verify every compensation when policy requires it.
- Follow reverse compensation order unless the approved plan documents a safer dependency order.
- Preserve the first failure, reconciliation evidence, retry count, and recovery decisions.
- Stop before every approval-required action.
- Require independent review for high/critical recovery when configured.
- Run the final deterministic gate before claiming verified completion.

## MUST NOT
- Retry a side effect merely because the client timed out.
- Assume command exit code proves remote state.
- Compensate an `unknown` outcome.
- Reuse an operation key for a different payload/action.
- Invent a rollback for an irreversible operation.
- Continue forward mutation while recovery state is unresolved.
- Let the implementation owner self-approve high/critical recovery when forbidden by policy.
- Silently increase tool/API permissions after a permission failure.
- Delete failure evidence to make a ledger appear clean.
- Mark the workflow complete while any step is `failed`, `unknown`, `not-started`, or has unverified compensation.

## SHOULD
- Prefer provider-native idempotency keys and read-back APIs.
- Place irreversible steps after reversible steps when semantics permit.
- Keep transaction/step boundaries small.
- Record provider request ids without secrets or sensitive payloads.
- Use dry-run or simulation for compensation logic in non-production environments.
- Keep compensation actions narrower than the original side effect.
