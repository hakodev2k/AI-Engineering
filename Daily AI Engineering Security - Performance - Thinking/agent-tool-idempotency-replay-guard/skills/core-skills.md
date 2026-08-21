# Core Skills

## Skill 1 — Classify Tool Effects

**Purpose:** determine replay safety before a tool is executed.

**Trigger:** tool registration or before first invocation of an unclassified tool.

**Inputs:** tool name, provider semantics, arguments, side effects, retry behavior.

**Preconditions:** tool contract and external effect are known well enough to classify.

**Procedure:**
1. Identify whether the tool can mutate external state.
2. Classify as `read`, `idempotent-write`, or `non-idempotent-write`.
3. Record whether the provider supports native idempotency keys or status lookup.
4. Record business identity fields required to distinguish legitimate repeated operations.
5. Reject write execution when classification is unknown.

**Decisions:** reads may retry under normal policy; writes require operation identity; ambiguous non-idempotent writes require reconciliation before retry.

**Output:** tool-effect policy entry.

**Verification:** a table-driven test proves every registered side-effecting tool has a non-read classification.

**Failure handling:** fail closed if effect cannot be determined.

**Stop condition:** classification is explicit and reviewed.

---

## Skill 2 — Build Stable Operation Identity

**Purpose:** map runtime attempts to one logical business operation.

**Trigger:** before a side-effecting tool reservation.

**Inputs:** tenant, workflow/business scope, tool name, canonical arguments, explicit business id when available.

**Procedure:**
1. Remove volatile attempt fields such as trace IDs and timestamps unless they are business-significant.
2. Canonicalize JSON recursively with stable key ordering.
3. Include tenant/security boundary so unrelated users never collide.
4. Prefer explicit caller-provided business IDs for payments, messages, jobs, orders, and mutations.
5. Hash the canonical identity with SHA-256.
6. Persist the canonical identity version with the ledger entry.

**Constraints:** never use model-generated random IDs as the only dedup key; never cross tenant boundaries.

**Expected output:** deterministic `operation_key`.

**Metric:** key stability across retry/replay fixtures.

**Verification:** semantically identical fixtures produce equal keys; distinct business operations produce distinct keys.

**Stop condition:** key passes collision fixtures.

---

## Skill 3 — Reserve, Execute, Commit

**Purpose:** ensure concurrent/replayed attempts do not execute the same external effect independently.

**Trigger:** side-effecting tool invocation.

**Procedure:**
1. Atomically reserve `operation_key` in durable storage.
2. If state is `completed`, return stored result/reference.
3. If state is `in_progress` with valid lease, wait/poll only within bounded policy or return duplicate-in-progress.
4. If stale, reconcile external provider state before stealing the lease.
5. Execute provider call only for the reservation owner.
6. Persist result hash/reference and mark completed.
7. If provider outcome is ambiguous, mark `unknown`, not failed.

**Metrics:** provider executions per operation key, suppression count, reservation latency, unknown-state count.

**Verification:** parallel 20-attempt test produces one provider call.

**Failure handling:** do not blindly retry `unknown` writes.

---

## Skill 4 — Reconcile Ambiguous Outcomes

**Purpose:** distinguish 'request failed before effect' from 'effect happened but response was lost'.

**Trigger:** timeout, connection reset, worker crash, or lease expiration around a write.

**Inputs:** operation key, provider request ID/idempotency key, provider lookup capability, prior reservation state.

**Procedure:**
1. Query provider by native idempotency/request/business key where possible.
2. If provider confirms success, commit stored result without re-execution.
3. If provider confirms no effect, allow a bounded retry under the same operation key.
4. If status cannot be determined, keep `unknown` and escalate according to risk policy.
5. Never create a new operation key merely to bypass an uncertain state.

**Verification:** timeout-after-side-effect fixture never duplicates the effect.

**Stop condition:** resolved to completed/no-effect, or human escalation is required.

---

## Skill 5 — Measure Replay Cost

**Purpose:** prove performance benefit rather than assume it.

**Trigger:** rollout, incident, or retry-policy change.

**Procedure:** capture baseline provider-call count, duplicate rate, p50/p95 guard overhead, saved calls, avoided estimated cost, wait time for duplicate contenders, unknown outcome rate, and false-collision incidents. Compare before/after on the same workload.

**Success:** duplicate executions decrease without unacceptable added latency or incorrectly suppressing legitimate operations.
