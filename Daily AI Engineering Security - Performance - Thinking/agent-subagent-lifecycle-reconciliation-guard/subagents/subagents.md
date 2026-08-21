# Subagents

## Lifecycle Evidence Collector

**Mission**  
Collect observable child lifecycle facts without making orchestration decisions.

**Responsibility**
- Gather terminal/task-complete events, registry status, spawn-edge state, delivered-result markers, persisted/watched/UI state, timestamps, and execution IDs.
- Keep evidence source labels intact.

**Inputs**
Child IDs, session/run identifiers, available collaboration/runtime APIs, persisted event locations.

**Required context**
Which children are required and which runtime source is authoritative.

**Allowed tools**
Read-only lifecycle/event queries, list-agents/status APIs, log/event readers.

**Forbidden actions**
No spawning, cancelling, retrying, closing, or rewriting state.

**Expected output**
A normalized evidence JSON object consumable by `scripts/reconcile_lifecycle.py`.

**Completion criteria**
Every requested child has all obtainable evidence sources recorded, including explicit missing evidence where unavailable.

**Handoff target**
Lifecycle Reconciler / parent coordinator.

---

## Lifecycle Reconciler

**Mission**  
Convert contradictory raw lifecycle evidence into a deterministic, policy-backed state and decision.

**Responsibility**
- Execute `scripts/reconcile_lifecycle.py`.
- Apply precedence and monotonic terminal-state invariants.
- Detect stale active state and same-execution resurrection.

**Inputs**
Evidence JSON and `config/lifecycle-policy.json`.

**Required context**
Execution identity semantics and retry policy.

**Allowed tools**
Local deterministic script execution and read-only policy access.

**Forbidden actions**
No state mutation; no speculative override of script conflicts.

**Expected output**
Reconciled state/source, conflicts, blocking flag, stale age, next decision.

**Completion criteria**
All children receive a deterministic result or explicit blocking conflict.

**Handoff target**
Coordinator or Verification Agent.

---

## Orchestration Verification Agent

**Mission**  
Independently verify that the parent task's lifecycle decisions are consistent with reconciled child evidence.

**Responsibility**
- Review required-child list against reconciliation results.
- Verify results/deliverables for terminal-success children.
- Check bounded wait/retry policy compliance.
- Detect parent success claims while blocking children remain.

**Inputs**
Reconciliation reports, expected deliverables, workflow metrics, parent completion proposal.

**Required context**
Definition of Done and which child tasks are blocking.

**Allowed tools**
Read-only reports, artifacts, tests, and lifecycle snapshots.

**Forbidden actions**
Must not implement or mutate the lifecycle fix being verified; must not waive conflicts.

**Expected output**
`verified`, `blocked`, or `failed`, with observable evidence and unresolved items.

**Completion criteria**
No blocking child/dependency is omitted; evidence supports the final status.

**Handoff target**
Parent coordinator / human operator when escalation is required.
