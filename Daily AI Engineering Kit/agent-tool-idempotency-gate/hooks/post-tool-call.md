# Hook: Post Tool Call

**Trigger:** immediately after a side-effecting invocation returns, fails, times out, or loses connection.

**Preconditions:** the key was successfully claimed.

**Action:** classify outcome and run exactly one transition: `complete --key ... --result-ref ...` for confirmed success; `fail --key ... [--retryable] --error ...` for definite failure; or `ambiguous --key ... --error ...` when commit status is uncertain.

**Expected result:** ledger leaves `in_progress` and records sanitized evidence.

**Failure behavior:** if ledger update itself fails, stop further mutation attempts. Preserve provider evidence and reconcile manually before retry because state is no longer trustworthy.

**Blocking:** yes. A workflow may not report success until the success transition is persisted and independently verified.
