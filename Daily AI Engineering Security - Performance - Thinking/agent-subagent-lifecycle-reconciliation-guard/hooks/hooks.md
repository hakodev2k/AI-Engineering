# Hooks

## Pre-Orchestration Lifecycle Check

**Trigger**  
Before `wait`, `retry`, `replace`, `cancel`, `consume result`, or parent finalization for any child.

**Action**
1. Build a lifecycle evidence JSON snapshot.
2. Run:

```bash
python scripts/reconcile_lifecycle.py \
  --input .agent/lifecycle-input.json \
  --policy config/lifecycle-policy.json \
  --output .agent/lifecycle-report.json
```

**Expected result**  
Exit `0` and a non-blocking decision.

**Failure behavior**  
Exit `2` blocks lifecycle-dependent action until one authoritative refresh/reconciliation attempt is completed. Exit `3/4` blocks action and surfaces input/tooling failure.

---

## Post-Child-Result Reconciliation

**Trigger**  
A child result or terminal event arrives.

**Action**
- Persist the result/terminal evidence with execution ID.
- Reconcile against cached/watched/UI state.
- If lower-precedence state remains active, mark it stale for presentation repair; do not reopen execution.

**Expected result**  
The reconciled state is terminal for that execution when authoritative terminal evidence exists.

**Failure behavior**  
Record conflict and prevent a new wait/retry decision from using stale state.

---

## Resume/Rehydrate Integrity Check

**Trigger**  
Parent session/app restarts, reconnects, or resumes historical work.

**Action**
- Compare rehydrated active children against persisted terminal events, closed spawn edges, delivered results, and registry state.
- Run reconciler before restoring active orchestration dependencies.

**Expected result**  
No terminal execution is resurrected as active without a new execution ID.

**Failure behavior**  
Quarantine the contradictory child state from orchestration and request authoritative reconciliation.

---

## Bounded Wait Hook

**Trigger**  
Reconciled state is legitimately active.

**Action**
- Use `initial_wait_seconds` and bounded backoff up to `max_wait_seconds`.
- Stop after `max_wait_attempts`.
- Prefer event-driven completion when supported.

**Expected result**  
The parent waits without generating an unbounded stream of model/status turns.

**Failure behavior**  
After the maximum attempts, collect a fresh authoritative snapshot once, reconcile, and either proceed or escalate.

---

## Final Verification Hook

**Trigger**  
Immediately before parent success.

**Action**
- Reconcile all required children.
- Verify expected child deliverables.
- Assert blocking conflict count = 0.
- Run the fixture test suite for package/integration changes.

**Expected result**  
Independent verification status `verified`.

**Failure behavior**  
Do not report success; return the concrete unresolved child or verification failure.
