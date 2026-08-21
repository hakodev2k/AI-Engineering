# Core Skills

## Skill 1 — Classify Tool Side-Effect Semantics

**Purpose:** Decide whether retry can change external state.  
**Trigger:** Before enabling a tool or changing retry behavior.  
**Inputs:** tool identity, documentation, downstream API behavior, failure modes.  
**Preconditions:** tool contract is available; unknown behavior is not assumed read-only.  
**Required context:** side effects, downstream idempotency support, consistency model, compensation path.  
**Tools:** documentation search, code inspection, API contract, logs.

**Procedure**
1. Enumerate externally observable changes the tool can cause.
2. Classify `read_only`, `idempotent_write`, or `non_idempotent_write`.
3. For `idempotent_write`, identify the exact downstream deduplication contract, key scope, retention period, and conflict behavior.
4. Identify ambiguous failures: timeout, disconnect, 5xx after commit, fallback/replay, worker crash.
5. Define an observable side-effect probe if possible.
6. Record the classification in host configuration; default unknown tools to `non_idempotent_write`.

**Decisions:** classification, verified downstream idempotency yes/no, probe available yes/no.  
**Constraints:** never infer idempotency from HTTP method, tool name, or model description alone.  
**Expected output:** tool-side-effect contract.  
**Metrics:** classified-tool coverage; unknown-tool count.  
**Verification:** reviewer can point to concrete downstream semantics.  
**Failure handling:** fail closed as non-idempotent.  
**Stop conditions:** semantics cannot be established safely.

## Skill 2 — Create Logical Operation Identity

**Purpose:** Deduplicate attempts that represent one intended action.  
**Trigger:** Immediately before a state-changing dispatch.  
**Inputs:** canonical server/tool identity, canonical arguments, stable intent ID.  
**Preconditions:** argument validation completed.  
**Required context:** operation scope and caller/run identity.  
**Tools:** `scripts/idempotency_guard.py`.

**Procedure**
1. Normalize tool identity to the host's canonical identity.
2. Serialize validated arguments with stable key ordering.
3. Include an explicit intent ID stable across retries/fallbacks but new for a genuinely new user action.
4. Compute the argument fingerprint and logical operation key.
5. Reserve the key durably before dispatch.
6. If the key already exists, follow the returned replay/block/conflict decision; do not ask the model to improvise.

**Decisions:** new reservation, duplicate, conflict.  
**Constraints:** a provider attempt ID is not automatically a logical intent ID.  
**Expected output:** durable operation record.  
**Metrics:** keyed-write coverage; key conflicts.  
**Verification:** same logical input produces same key; changed arguments produce a conflict under forced key reuse.  
**Failure handling:** if the reservation store is unavailable, block non-idempotent dispatch.  
**Stop conditions:** no durable reservation can be created.

## Skill 3 — Resolve Ambiguous Tool Outcomes

**Purpose:** Safely handle “request may have executed, response unavailable.”  
**Trigger:** timeout/disconnect/crash/fallback after dispatch started.  
**Inputs:** operation ledger, downstream idempotency contract, probe data, audit logs.  
**Preconditions:** operation is already reserved.  
**Required context:** side-effect classification and attempt number.  
**Tools:** `idempotency_guard.py`, `side_effect_probe.py`.

**Procedure**
1. Mark the record `outcome_unknown`; never mark it `known_failed` without evidence.
2. If read-only, apply bounded retry policy.
3. If downstream idempotency is verified, retry with the identical logical key within budget.
4. Otherwise run exactly one configured side-effect probe.
5. If effect is present, reconcile/replay result without re-execution.
6. If effect is absent, transition to a retry-safe state and retry within budget.
7. If probe remains unknown, stop and require human resolution or an approved compensation strategy.

**Decisions:** replay/reconcile, retry, block/escalate.  
**Constraints:** no unlimited probing or retries.  
**Expected output:** evidence-backed outcome classification.  
**Metrics:** ambiguity resolution rate; blocked unsafe retries.  
**Verification:** every ambiguous write has evidence for the next action.  
**Failure handling:** preserve `outcome_unknown`.  
**Stop conditions:** probe inconclusive after configured limit.

## Skill 4 — Verify Retry Safety Regression

**Purpose:** Prove runtime changes do not reintroduce duplicate execution.  
**Trigger:** retry middleware, tool adapter, MCP SDK, provider fallback, resume logic, or queue-worker changes.  
**Inputs:** test fixtures, policy, ledger.  
**Preconditions:** deterministic tests can inject duplicate/ambiguous states.  
**Tools:** unit tests and synthetic transport-loss tests.

**Procedure**
1. Capture baseline duplicate-execution behavior.
2. Test same-key/same-fingerprint duplicate.
3. Test same-key/different-fingerprint conflict.
4. Test concurrent in-progress duplicate.
5. Test lost-response `outcome_unknown` for every write class.
6. Test retry-budget exhaustion.
7. Test completed-result replay.
8. Have a verifier independent from the implementation agent inspect high-risk failures.

**Expected output:** regression report with measured duplicate count and block/replay decisions.  
**Metrics:** duplicate executions, false blocks, decision coverage.  
**Verification:** all required tests pass on current code.  
**Failure handling:** rollback or disable automatic write retries.  
**Stop conditions:** any non-idempotent duplicate remains reproducible.