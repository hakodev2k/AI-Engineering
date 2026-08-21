# Workflows

## Workflow 1 — Reconcile Before Wait / Retry / Finalize

**Trigger**  
The parent is about to wait for, retry, replace, consume, or finalize a child task.

**Goal**  
Make the orchestration decision from reconciled lifecycle evidence, not stale presentation state.

**Inputs**
- required child IDs and execution IDs;
- evidence from event stream, registry, spawn-edge/result state, persistence, watched/UI state;
- `config/lifecycle-policy.json`.

**Baseline**
Capture current counts: children shown active, children authoritative-active, children terminal, status queries so far, wait turns so far, and oldest active-state age.

**Context**
Label each evidence source. Identify which children block parent completion.

**Stages**
1. **Observe** — Lifecycle Evidence Collector gathers one snapshot.
2. **Normalize** — convert fields to the reconciler input schema.
3. **Reconcile** — run `scripts/reconcile_lifecycle.py`.
4. **Checkpoint A** — if a blocking conflict exists, do not wait/spawn/finalize yet.
5. **Refresh once** — query the authoritative registry/event source for conflicted children.
6. **Reconcile again** — maximum two reconciliation attempts per decision point.
7. **Decide**:
   - terminal success → verify/consume result;
   - terminal failure → recovery or explicit failure;
   - valid active → bounded wait;
   - unresolved conflict/unknown → escalate, do not invent state.
8. **Verify** — independent Verification Agent checks the chosen decision for blocking children.

**Responsible agents**
Evidence Collector → Reconciler → Parent Coordinator → Verification Agent.

**Tools**
Read-only lifecycle APIs/event logs, reconciler script, task deliverable checks.

**Outputs**
Reconciliation JSON, decision, metrics delta, verification status.

**Checkpoints**
- A: no lifecycle-dependent mutation under unresolved conflict.
- B: terminal→active requires a distinct execution ID.
- C: parent success requires zero genuinely unresolved blocking children.

**Metrics**
Mismatch rate, stale-active age, status queries/child, wait turns avoided, reconciliation attempts, unresolved children.

**Retry policy**
Maximum two evidence/reconcile attempts at a decision point. Waiting for valid active children is governed separately by policy: maximum `max_wait_attempts` with bounded backoff.

**Stop conditions**
- Stop successfully when all required children have non-conflicting reconciled states and required deliverables are verified.
- Stop blocked when reconciliation attempts are exhausted without trustworthy state.
- Stop failed when a required child terminal-fails and recovery is exhausted.

**Failure path**
Persist the minimal evidence snapshot, mark state `unknown/conflicted`, surface the blocked orchestration action, and escalate. Never convert uncertainty to success.

**Definition of Done**
Every blocking child has an evidence-backed state, bounded policy was respected, expected deliverables are present, and independent verification passes.

---

## Workflow 2 — Stale Active Incident Investigation

**Trigger**  
A child is shown active past the configured staleness threshold, a result is available while status is active, or restart/resume changes lifecycle presentation.

**Goal**  
Find whether the problem is genuine long-running work or state desynchronization without creating another polling loop.

**Inputs**
Before/after snapshots, child event history, execution IDs, registry response, delivered-result state.

**Baseline**
Record stale age, UI state, registry state, latest terminal event, last result timestamp, and restart/rehydration boundary.

**Stages**
1. Capture evidence without mutating state.
2. Reconcile once.
3. Classify mismatch: precedence, rehydration, delayed event/result delivery, registry unavailable, unknown.
4. Perform one targeted refresh for the strongest missing source.
5. Reconcile again.
6. Compare baseline and post-refresh state.
7. Document likely ownership layer and remediation hypothesis.
8. Verify with a regression fixture or reproduction test before declaring fixed.

**Retry policy**
Two diagnostic cycles maximum. No increasing poll rate.

**Stop conditions**
Evidence-backed mismatch class found, or diagnostic budget exhausted and escalation produced.

**Verification**
A fix is verified only when the stale-state scenario no longer violates invariants and does not regress legitimate active/retry transitions.

---

## Workflow 3 — Parent Completion Gate

**Trigger**  
Immediately before the parent agent reports task completion.

**Goal**  
Avoid both false completion and false blocking from stale child UI state.

**Stages**
1. Load required-child dependency list.
2. Obtain the latest lifecycle snapshot for each child.
3. Run reconciliation.
4. Verify terminal-success child artifacts/results.
5. Verify terminal-failure recovery or surface failure.
6. Treat active/unknown required children as blocking unless explicitly marked non-blocking.
7. Ignore lower-precedence stale active presentation when stronger terminal evidence exists.
8. Independent verifier returns `verified`, `blocked`, or `failed`.

**Definition of Done**
Blocking child count is zero, expected child outputs exist, conflicts are zero, and final verification passes.
