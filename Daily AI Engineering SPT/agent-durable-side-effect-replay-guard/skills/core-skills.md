# Core Skills

## Skill 1 — Derive Stable Side-Effect Identity

**Purpose:** produce a deterministic operation identity that represents the semantic external effect rather than an ephemeral agent attempt.

**Trigger:** before any effect that can create, mutate, send, charge, publish, provision, append, or delete external state.

**Inputs:** workflow identity, effect type, semantic business inputs, provider idempotency capability, risk class.

**Preconditions:** caller can identify the business operation without including credentials or volatile attempt metadata.

**Required context:** business uniqueness rules, external API contract, effect risk, retention requirements.

**Tools:** canonical JSON serializer, SHA-256, `scripts/side_effect_guard.py`.

**Procedure:**
1. Define `workflow_id` as the stable logical workflow/thread/request identity.
2. Define `effect_type` narrowly, e.g. `send_invoice_email`, not `tool_call`.
3. Construct semantic input using only values that define whether two effects are logically the same: recipient/customer/object/action/version.
4. Exclude timestamps, retry counters, worker IDs, random UUIDs generated per attempt, credentials, authorization headers, and tracing IDs.
5. Canonicalize and hash semantic input.
6. Claim the resulting key in the durable ledger before provider execution.
7. If the provider accepts an idempotency key, pass the same stable key downstream.

**Decisions:** if two attempts should create only one external effect, they MUST derive the same semantic input. If changes should create a new effect, include the changed business version/value.

**Constraints:** never make a key from raw secrets; do not use only process/run/task IDs.

**Expected output:** `{workflow_id, effect_type, semantic_hash, operation_key}`.

**Metrics:** duplicate-key rate, accidental-key-collision investigations, key reuse across retries.

**Verification:** identical semantic inputs across retries produce identical operation keys; materially different intended effects produce different keys.

**Failure handling:** if semantic identity is ambiguous, stop before side effect and escalate to workflow owner; do not invent a random key.

**Stop conditions:** stable identity cannot be derived safely.

---

## Skill 2 — Claim → Execute → Complete

**Purpose:** prevent concurrent or replayed attempts from blindly repeating external effects.

**Trigger:** immediately before non-idempotent provider call.

**Inputs:** operation key inputs, owner/attempt identifier, configured TTL, provider call.

**Preconditions:** durable ledger is writable and shared by all workers that can execute the operation.

**Required context:** policy, risk class, provider idempotency support.

**Tools:** `side_effect_guard.py claim|complete`.

**Procedure:**
1. Call `claim` before the external call.
2. On `decision=execute`, invoke the provider exactly once for this owner.
3. If provider returns success, capture only a safe stable result reference such as provider request/message/object ID.
4. Immediately call `complete` using the same owner and operation key.
5. On `decision=reuse`, return the stored safe result reference without provider execution.
6. On `decision=wait`, do not execute; retry status observation with bounded backoff outside the model loop.
7. On `decision=reconcile`, transition to the reconciliation skill; never blind-retry.

**Decisions:** provider timeout/connection loss after request transmission is an uncertain result, not proof of failure.

**Constraints:** do not record raw provider response bodies if they may contain secrets or personal data.

**Expected output:** one of `executed+completed`, `reused`, `waiting`, `uncertain`.

**Metrics:** provider calls per operation key, reuse count, uncertain count, completion latency.

**Verification:** crash/retry test must show no second provider effect for an already completed key.

**Failure handling:** if ledger completion fails after provider success, leave the key to age into uncertain state and preserve provider correlation ID for reconciliation.

**Stop conditions:** ledger unavailable; claim conflict; uncertain result.

---

## Skill 3 — Reconcile Uncertain Effects

**Purpose:** determine whether an external effect already happened after a crash, timeout, lost acknowledgement, or expired claim.

**Trigger:** ledger state is `uncertain`.

**Inputs:** operation key, safe provider reference if available, semantic business lookup fields, effect risk.

**Preconditions:** blind retry from uncertain is disabled.

**Required context:** provider lookup/idempotency semantics and human approval policy.

**Tools:** provider read-only lookup, `status`, `resolve`.

**Procedure:**
1. Inspect ledger state and timestamps.
2. Query the provider by idempotency key, provider request ID, or uniquely identifying business fields using read-only operations.
3. Classify evidence as `completed`, `not_observed`, or `ambiguous`.
4. If completed, resolve ledger to completed with a safe result reference.
5. If not observed and provider guarantees authoritative absence, resolve to `retry`; a fresh claim is then required.
6. If ambiguous, high-risk, or provider has eventual consistency, require human approval or postpone within a bounded reconciliation window.
7. Record evidence type and decision without sensitive payloads.

**Decisions:** absence is sufficient only if the lookup is authoritative for the operation’s consistency model.

**Constraints:** high-risk ambiguous effects never auto-release for retry.

**Expected output:** evidence-backed `completed`, `safe_to_retry`, or `human_required`.

**Metrics:** uncertain resolution rate, false retry incidents, human escalation rate.

**Verification:** every retry release has explicit absence evidence or required approval.

**Failure handling:** maximum two automated reconciliation attempts; then escalate.

**Stop conditions:** evidence remains ambiguous after maximum attempts.

---

## Skill 4 — Crash/Replay Verification

**Purpose:** prove the workflow remains correct at the exact recovery boundaries most likely to duplicate effects.

**Trigger:** new side-effect integration, retry/recovery change, runtime/checkpointer upgrade.

**Inputs:** test operation, fake provider counter, ledger path, crash-point matrix.

**Preconditions:** tests use non-production targets.

**Procedure:**
1. Baseline a normal execution and verify one provider effect.
2. Inject crash before provider call; resume; expect one total effect.
3. Inject crash immediately after provider success but before ledger completion; resume; expect uncertain/reconciliation, never a blind second effect.
4. Crash after ledger completion; resume; expect reuse with zero additional calls.
5. Start two workers with identical semantic inputs; expect one execute decision and one wait/reuse decision.
6. Repeat test after closing/reopening the SQLite connection to validate restart durability.

**Metrics:** total provider calls per semantic operation, duplicate effects, uncertain blind retries, reconciliation coverage.

**Verification:** all protected scenarios produce at most one external effect.

**Failure handling:** any duplicate blocks release of the integration.

**Stop conditions:** a test cannot deterministically observe provider effect count.
