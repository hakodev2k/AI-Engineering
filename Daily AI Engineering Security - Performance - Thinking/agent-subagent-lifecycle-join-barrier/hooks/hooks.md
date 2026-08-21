# Hooks

## Hook 1 — Pre-Dispatch Contract Validation

**Trigger:** immediately before any subagent/background task spawn.

**Action:** persist the logical task contract and validate the ledger.

**Command:**

`python scripts/join_guard.py validate-ledger --ledger .agent-lifecycle/ledger.json`

**Expected result:** exit 0; child has stable identity, valid parent, required flag, expected outputs for required work, and legal state.

**Failure behavior:** block dispatch. Allow at most two metadata correction attempts; never dispatch an untracked required child.

---

## Hook 2 — Post-Spawn Attempt Registration

**Trigger:** provider spawn/task API returns.

**Action:** record provider attempt/session ID, dispatch timestamp, and initial state under the logical task ID.

**Command/script:** orchestrator-native ledger append followed by `join_guard.py validate-ledger`.

**Expected result:** every provider child is attributable to exactly one logical task attempt.

**Failure behavior:** cancel the just-created child if safe and supported; otherwise mark the untracked attempt as a blocking orchestration incident. Do not continue as if delegation succeeded.

---

## Hook 3 — Heartbeat/Stale Check

**Trigger:** timer event while required descendants are active.

**Action:** compare current time with `last_heartbeat_at`; query provider status only after the stale threshold or when an event stream disconnects.

**Command:**

`python scripts/join_guard.py stale --ledger .agent-lifecycle/ledger.json --policy config/policy.json`

**Expected result:** exit 0 when no required child is stale; exit 3 when stale tasks require authoritative runtime reconciliation.

**Failure behavior:** do not invoke an LLM just to retry the same status question. Reconcile through deterministic provider status; if unresolved by deadline, terminalize as blocking unknown/orphaned according to policy.

---

## Hook 4 — Child Terminal Handoff Check

**Trigger:** child/attempt emits a terminal event.

**Action:** require terminal reason; for success require a handoff artifact; for failure preserve partial handoff if available.

**Command:**

`python scripts/join_guard.py check-task --ledger .agent-lifecycle/ledger.json --task-id <task-id>`

**Expected result:** success tasks have handoff references; non-success tasks have explicit reasons and do not masquerade as success.

**Failure behavior:** mark handoff invalid and block the required join. One repair attempt is permitted when no new side effect is needed.

---

## Hook 5 — Independent Verification

**Trigger:** a required child reaches `succeeded` and its handoff exists.

**Action:** deterministic artifact checks first, then independent semantic verification if required; write a verification record keyed by logical task ID.

**Command/script:** project-specific tests plus the verifier workflow; then `join_guard.py check-task`.

**Expected result:** verification record contains `verdict: pass`, verifier identity, timestamp, checks, and evidence.

**Failure behavior:** task does not satisfy the join barrier. Route failures back to Recovery Coordinator or parent replanning.

---

## Hook 6 — Pre-Parent-Completion Barrier

**Trigger:** immediately before parent reports completion, publishes final result, merges, or exits headless execution.

**Action:** compute descendant closure and validate all required joins.

**Command:**

`python scripts/join_guard.py check --ledger .agent-lifecycle/ledger.json --parent-id <parent-id> --policy config/policy.json`

**Expected result:** exit 0 and `PASS` only when all required descendants succeeded with valid independent verification.

**Failure behavior:** block completion and return non-zero in CI/headless mode. Never shorten the required set or rewrite failure states merely to pass.

---

## Hook 7 — Global Wait Deadline

**Trigger:** elapsed join wait reaches `max_join_wait_seconds`.

**Action:** stop waiting, snapshot statuses, preserve partial artifacts, classify unresolved required children as blocking timeout/orphan according to runtime evidence.

**Expected result:** no infinite wait loop and a reproducible blocker report.

**Failure behavior:** parent fails/replans. The deadline may only be changed by an explicit new plan, not by an agent silently continuing retries.

---

## Hook 8 — Shutdown Cleanup

**Trigger:** parent terminal state/process shutdown.

**Action:** verify no required descendant is being abandoned; safely cancel/reap optional background work that is no longer needed; persist final ledger.

**Expected result:** no silent required orphan, no unnecessary optional process left running, and cleanup actions are logged.

**Failure behavior:** cleanup failure is reported separately; it must not convert a failed join to success or bypass safety controls.
