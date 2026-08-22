# Workflows

## Workflow A — Protect a New Side Effect

**Trigger:** an agent workflow adds or changes a non-idempotent external mutation.

**Goal:** make replay/retry behavior deterministic before release.

**Inputs:** workflow ID strategy, effect semantics, provider API, policy.

**Baseline:** execute existing workflow twice with the same semantic request in an isolated environment and record provider call/effect count. This establishes whether duplicate risk already exists.

**Context:** provider idempotency capabilities, consistency model, timeout behavior, business uniqueness rules.

**Stages:**
1. **Observe** — Identity Analyst inventories the mutation and current retry/checkpoint boundaries.
2. **Baseline** — measure calls/effects for normal duplicate invocation and one forced retry.
3. **Define identity** — derive `workflow_id + effect_type + semantic_input_hash`.
4. **Implement** — Implementation Agent adds claim → execute → complete and downstream provider idempotency key when available.
5. **Measure** — run normal, duplicate, concurrency, and restart cases.
6. **Crash matrix** — inject crash before call, after provider success/before completion, and after completion.
7. **Review** — independent Verification Agent confirms counts and uncertain-state behavior.
8. **Security review** — inspect ledger payload/permissions/high-risk policy.

**Responsible agents:** Identity Analyst → Implementation Agent → Crash/Replay Verification Agent → Security & Release Reviewer.

**Tools:** `scripts/side_effect_guard.py`, fake/test provider, test runner, SQLite inspection.

**Outputs:** key contract, integration, test evidence, residual risk statement.

**Checkpoints:** identity approved; claim path exercised; crash matrix complete; security review complete.

**Metrics:** provider calls per operation key, duplicate effects, uncertain blind retries, concurrency winners, replay reuse count.

**Retry policy:** implementation/test loop maximum 2 correction cycles. Provider integration tests maximum 2 transient retries, but tests must preserve the same semantic operation key.

**Stop conditions:** ambiguous semantic identity; ledger unavailable; provider effect count not observable; duplicate side effect remains after 2 correction cycles; security blocker.

**Failure path:** revert integration or disable automated mutation; do not raise retry count or bypass guard.

**Verification:** all mandatory scenarios have measured call count and ledger decision.

**Definition of Done:** duplicate effects = 0; same-key concurrent executors <=1; completed replay adds 0 provider calls; uncertain blind retries = 0; no sensitive payload stored; reviewer signs off.

---

## Workflow B — Resume After Crash or Timeout

**Trigger:** worker restart, tool timeout, queue redelivery, lost response, or an expired `in_progress` claim.

**Goal:** resume without guessing whether the external effect happened.

**Inputs:** operation key, ledger state, provider reference/idempotency key, risk class.

**Baseline:** inspect the ledger before any mutation.

**Stages:**
1. `completed` → reuse stored safe result; do not call provider.
2. fresh `in_progress` → wait outside model reasoning loop; another owner is active.
3. expired `in_progress` → guard transitions to `uncertain`.
4. `uncertain` → Verification/Reconciliation agent performs read-only provider lookup.
5. Provider confirms completion → `resolve --resolution completed`.
6. Provider authoritatively confirms absence → for low/normal risk, `resolve --resolution retry`; then obtain a fresh claim before execution.
7. Ambiguous/high risk → require explicit human decision; retain uncertainty until resolved.

**Checkpoints:** state observed; evidence captured; resolution recorded; any retry reacquires a fresh claim.

**Metrics:** time-to-reconcile, uncertain resolution type, duplicate provider calls.

**Retry policy:** maximum 2 automated reconciliation attempts with bounded delay; no mutation during reconciliation.

**Stop conditions:** evidence remains ambiguous, provider read path unavailable, or human approval required.

**Failure path:** leave state uncertain and surface a blocking incident with operation-key hash and safe metadata.

**Verification:** recovery action is supported by provider/ledger evidence rather than checkpoint absence.

**Definition of Done:** state is completed/reused or a new execution is explicitly released after authoritative absence/approval.

---

## Workflow C — Runtime/Checkpointer Upgrade Regression

**Trigger:** upgrade agent runtime, graph engine, checkpoint saver, worker queue, orchestration middleware, or persistence backend.

**Goal:** detect changes in replay/re-execution behavior before production.

**Inputs:** old/new versions, representative protected side effects, crash harness.

**Baseline:** store old-version scenario matrix: provider calls, ledger state transitions, duration.

**Stages:** run the same matrix under new version; compare every recovery branch; independently verify effect counts.

**Metrics:** duplicate count delta, uncertain count delta, replay reuse delta, recovery latency.

**Retry policy:** one rerun for test-infrastructure flake only when the flake is independently evidenced.

**Stop conditions:** any new duplicate, blind retry, or unexplainable state transition.

**Failure path:** hold upgrade; preserve existing version; file a minimized runtime issue if framework behavior changed.

**Verification:** side-effect correctness remains unchanged even if internal checkpoint scheduling changes.

**Definition of Done:** all previous passing scenarios remain passing and evidence is archived.
