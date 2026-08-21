# Workflows

## Workflow 1 — Normal Tool Correlation

**Trigger:** Model emits one or more tool calls.

**Goal:** Preserve exactly-once causal binding from action to observation.

**Inputs:** Tool calls, session ID, generation, agent identity, policy.

**Baseline:** Measure current orphan, duplicate, replay, and unresolved-call rates before enforcement.

**Context:** Runtime event stream and active generation.

**Stages:**
1. **Register** — Orchestrator records every invocation before execution.
2. **Execute** — Tool runs with the registered composite identity.
3. **Observe** — Result event is appended without overwriting prior state.
4. **Reconcile** — Correlation Observer matches identity and computes payload digest.
5. **Gate** — Run `correlation_guard.py`.
6. **Continue** — Only a clean gate permits model continuation.

**Responsible agents:** Orchestrator → Correlation Observer → Reconciliation Agent.

**Tools:** runtime hooks, correlation ledger, guard script.

**Outputs:** accepted result set, audit reason codes, continuation verdict.

**Checkpoints:** after invocation registration; after result arrival; before model continuation.

**Metrics:** orphan rate, duplicate rate, unresolved calls, gate latency.

**Retry policy:** Reconciliation may retry at most 2 times when fresh host state can resolve ambiguity. Tool execution is not automatically retried by this workflow.

**Stop conditions:** `safe_to_continue`; otherwise block and escalate after maximum reconciliation attempts.

**Failure path:** Preserve raw event metadata, classify violation, do not inject uncertain result into model context.

**Verification:** Deterministic guard exit code 0.

**Definition of Done:** Every active invocation is uniquely identified and every accepted result has one matching active invocation.

## Workflow 2 — Provider Retry / Model Fallback

**Trigger:** provider retry, safety fallback, transport retry, turn retraction, or response regeneration.

**Goal:** Prevent transcript retry from duplicating already-executed real-world actions.

**Inputs:** old generation ledger, live executions, retry reason, side-effect metadata.

**Baseline:** Count duplicate execution incidents around retries before rollout.

**Context:** Old generation may contain calls whose transcript entry disappears while execution continues.

**Stages:**
1. Freeze old generation for new dispatches.
2. Enumerate old nonterminal and completed side-effectful calls.
3. Cancel only safely cancellable nonterminal calls.
4. Quarantine late old-generation results from automatic injection.
5. Start a new generation namespace.
6. Surface completed old-generation execution facts to the new turn.
7. Before replay, require idempotency key/proof; if absent for side effects, require human approval.
8. Run gate before any continuation.

**Responsible agents:** Orchestrator + Reconciliation Agent; Human Approver for ambiguous side effects.

**Tools:** runtime execution registry, guard script.

**Outputs:** generation-boundary report and allowed/blocked replay decisions.

**Checkpoints:** old generation frozen; side effects classified; new generation registered.

**Metrics:** duplicate side effects per retry, orphaned background executions, stale-result quarantine count.

**Retry policy:** Maximum 2 reconciliation attempts. Never recursively retry the entire fallback workflow.

**Stop conditions:** new generation is cleanly initialized or execution stops blocked.

**Failure path:** report ambiguous side effects rather than replaying.

**Verification:** no stale-generation result is accepted; no side-effect replay occurs without proof/approval.

**Definition of Done:** Transcript and real execution state are explicitly reconciled across the retry boundary.

## Workflow 3 — Correlation Incident Recovery

**Trigger:** `ORPHAN_RESULT`, `CONFLICTING_DUPLICATE_RESULT`, unresolved active call, or stale result appears.

**Goal:** Recover safely without fabricating state.

**Inputs:** ledger, raw transport/runtime logs, policy.

**Baseline:** Current violation class and affected invocation identities.

**Context:** Model continuation is paused.

**Stages:**
1. Snapshot evidence.
2. Re-read authoritative runtime state once.
3. Reconstruct missing metadata only from observable logs/events.
4. Run guard.
5. If clean, resume with a concise external-state summary.
6. If still ambiguous, retry reconciliation once more only if new evidence is obtainable.
7. After 2 failed attempts, stop and escalate.

**Responsible agents:** Reconciliation Agent → Independent Verification Agent.

**Tools:** read-only logs, guard script.

**Outputs:** repaired ledger or blocked incident report.

**Checkpoints:** evidence snapshot; each reconciliation attempt; final verification.

**Metrics:** recovery success rate, attempts per incident, false-resume rate.

**Retry policy:** exactly 2 maximum reconciliation attempts.

**Stop conditions:** clean gate or escalation.

**Failure path:** leave uncertain calls unresolved and preserve negative evidence.

**Verification:** independent verifier confirms the repaired mapping using observable events.

**Definition of Done:** No ambiguous result is accepted and recovery state is auditable.