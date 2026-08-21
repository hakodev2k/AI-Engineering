# Core Skills

## Skill 1 — Delegation Budget Planning

**Purpose:** Convert a root task into a bounded delegation envelope before any subagent is spawned.

**Trigger:** A workflow plans parallel or nested agent delegation.

**Inputs:** Task goal, expected work units, model/tool profile, policy, current budget ledger.

**Preconditions:** Root task ID exists; policy is loaded; no previous unresolved reservation for the same spawn request.

**Required context:** Remaining descendant count, depth, concurrency, estimated token budget, tool-call budget, wall-clock budget.

**Tools:** Budget policy, runtime ledger, historical token/tool-call metrics when available.

**Procedure:**
1. Decompose only into independently useful work units.
2. Estimate minimum viable workers and per-worker token/tool/time needs.
3. Prefer the smallest fan-out that covers independent work.
4. Reserve root-level headroom for synthesis and verification.
5. Allocate each child a smaller explicit envelope.
6. Set whether each child may delegate; default to no delegation unless necessary.
7. Validate the planned tree against hard limits before execution.
8. Emit a machine-readable plan containing root budget, child reservations, expected fan-out, and escalation rule.

**Decisions:** Reject delegation when sequential execution is cheaper or when expected fan-out exceeds policy. Reduce worker count before reducing correctness-critical context.

**Constraints:** Never assign the entire remaining root token budget to children. Never rely on prompt wording as the only limit.

**Expected output:** A validated delegation budget plan.

**Metrics:** Planned descendants, planned depth, reserved tokens, reserved synthesis headroom, planned concurrency.

**Verification:** `budget_guard.py plan-check` returns exit code 0.

**Failure handling:** Re-plan once with fewer workers. If still invalid, execute without subagents or escalate.

**Stop conditions:** Valid plan produced, or one bounded re-plan fails.

---

## Skill 2 — Atomic Spawn Admission

**Purpose:** Prevent races and recursive explosions by enforcing the tree budget at the exact spawn boundary.

**Trigger:** Any request to create a child agent.

**Inputs:** Parent agent ID, root task ID, requested child budget, current ledger, policy.

**Preconditions:** Parent is active and registered; child request has a unique request ID.

**Required context:** Parent depth, parent remaining delegated budget, root active count, root cumulative descendants, global reservations.

**Tools:** `scripts/budget_guard.py`, atomic store/transaction adapter in production.

**Procedure:**
1. Validate request shape and identity.
2. Reject duplicate request IDs unless the prior reservation is being replayed idempotently.
3. Compute proposed child depth and root cumulative counts.
4. Check descendant, depth, concurrency, token, tool, and time budgets.
5. Confirm the parent has permission and sufficient delegated allowance.
6. Atomically reserve the requested envelope.
7. Return a lease/reservation ID to the orchestrator.
8. Only after success may the runtime spawn the child.

**Decisions:** Deny on any hard-limit breach. Soft thresholds emit warnings but never bypass hard limits.

**Constraints:** Check-and-reserve must be one atomic operation in distributed runtimes.

**Expected output:** Admission decision and reservation/denial reason.

**Metrics:** Spawn attempts, admitted, denied by reason, duplicate/replay attempts, reservation latency.

**Verification:** Concurrency test proves total admitted reservations never exceed configured limits.

**Failure handling:** Fail closed if the ledger cannot be read or written reliably.

**Stop conditions:** Reservation committed, request denied, or ledger unavailable.

---

## Skill 3 — Runtime Budget Reconciliation

**Purpose:** Replace estimates with actual usage and expose remaining budget throughout execution.

**Trigger:** Child emits usage metrics, completes, fails, times out, or is cancelled.

**Inputs:** Reservation ID, actual tokens/tool calls/wall time, terminal status, partial-result pointer.

**Preconditions:** Reservation exists or event is flagged as orphaned.

**Required context:** Root and parent ledger state.

**Tools:** Runtime telemetry, ledger, `scripts/budget_guard.py` for offline validation.

**Procedure:**
1. Validate event ownership.
2. Record actual usage monotonically.
3. Release unused reservation only after terminal confirmation.
4. Never refund already consumed tokens/tool calls.
5. Recompute remaining root budget and soft-threshold status.
6. Flag overrun, orphan, or accounting gap.
7. Persist partial-result location before releasing the child slot.

**Decisions:** At hard-budget exhaustion, deny new spawns and move to bounded synthesis/recovery.

**Constraints:** Unknown usage keeps its reservation held until timeout/reconciliation.

**Expected output:** Updated ledger and remaining budget snapshot.

**Metrics:** Estimate error, reconciliation delay, unknown usage count, stranded reservations.

**Verification:** Ledger invariants remain non-negative and hard limits remain respected.

**Failure handling:** Quarantine inconsistent ledger and stop new delegation.

**Stop conditions:** Event reconciled or ledger escalated as inconsistent.

---

## Skill 4 — Fan-out Incident Containment

**Purpose:** Stop an expanding delegation tree without losing already completed evidence.

**Trigger:** Descendant growth exceeds plan, spawn velocity spikes, hard budget reached, or orphan descendants remain after parent completion.

**Inputs:** Root task ID, live tree, reservations, partial results, policy.

**Preconditions:** Runtime can enumerate and cancel descendants.

**Required context:** Planned vs actual fan-out, child age, progress, cost, criticality.

**Tools:** Agent registry, cancellation API, ledger, audit log.

**Procedure:**
1. Freeze new spawn admissions for the root.
2. Snapshot the live tree and budget ledger.
3. Preserve completed/available partial results.
4. Cancel newest or lowest-value descendants first according to policy.
5. Wait a bounded grace period for cancellation acknowledgement.
6. Mark non-terminating descendants as orphan incidents.
7. Synthesize from preserved results only if correctness criteria can still be met.
8. Require human approval to raise hard limits and resume spawning.

**Decisions:** Prefer stopping redundant branches over expanding budget.

**Constraints:** Never silently raise quotas to make the task finish.

**Expected output:** Containment report, preserved results, incident status.

**Metrics:** Time to freeze, descendants cancelled, tokens after detection, partial-result retention rate.

**Verification:** No new descendants after freeze; active count trends to zero/bounded residual.

**Failure handling:** Escalate orphan processes to runtime/operator control plane.

**Stop conditions:** Tree contained, or cancellation grace expires and operator escalation is required.