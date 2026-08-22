# Core Skills

## Skill 1 — Reconcile Child Lifecycle Before Orchestration

**Purpose**  
Prevent parent agents from waiting, retrying, replacing, or finalizing work based on stale child state.

**Trigger**  
Before any decision that depends on whether one or more subagents are active, terminal, missing, or ready for result consumption.

**Inputs**
- child/execution identifiers;
- available lifecycle evidence: terminal/task-complete events, authoritative registry state, spawn-edge state, delivered result marker, persisted/watched/UI status;
- `config/lifecycle-policy.json`.

**Preconditions**
- Evidence fields preserve source identity.
- A terminal event is not rewritten into a generic status string.
- The parent can query at least one authoritative status source when conflicts exist.

**Required context**
- Which children are required for parent completion.
- Whether replacement execution IDs are legitimate retries.
- Maximum acceptable wait/staleness budget.

**Tools**
- Collaboration/list-agent API when available.
- Persisted lifecycle events.
- `scripts/reconcile_lifecycle.py`.

**Procedure**
1. Collect lifecycle evidence without trusting the UI label as authoritative.
2. Normalize evidence into the schema consumed by the reconciler.
3. Run the deterministic reconciler.
4. If terminal evidence outranks stale active evidence, consume the result or close the child dependency.
5. If a terminal→active transition occurs with the same execution ID, block orchestration and require reconciliation.
6. If active state exceeds the staleness budget, perform one authoritative refresh instead of another model-based guess.
7. If conflict remains after refresh, escalate with facts: sources, states, timestamps, execution ID, and missing evidence.
8. Only after a clean reconciliation may the parent wait, spawn replacement work, or finish.

**Decisions**
- `consume_result_or_finalize_child`: terminal state is authoritative.
- `bounded_wait`: active state is valid and within policy.
- `reconcile_before_orchestration`: contradictory/stale evidence blocks action.
- `query_authoritative_registry`: no trustworthy state is present.
- `review_unknown_state`: state is not covered by policy.

**Constraints**
- Do not infer a lifecycle state from commentary text alone.
- Do not accept terminal→active resurrection without a new execution identity when policy forbids it.
- Do not poll indefinitely.
- Do not spawn replacement work solely because a UI badge is stale.

**Expected output**
A reconciliation report containing selected state/source, conflicts, staleness, blocking status, and next decision.

**Metrics**
- reconciliation mismatch count;
- stale-active duration;
- waits avoided;
- status queries per child;
- terminal→active resurrection attempts;
- unresolved-required-child count at parent completion.

**Verification**
- Run fixture tests.
- Confirm terminal evidence wins over lower-precedence stale active status.
- Confirm same-execution resurrection blocks.
- Confirm clean active state yields bounded wait.

**Failure handling**
If authoritative evidence cannot be obtained, stop lifecycle-dependent actions and report `unknown/conflicted`; do not manufacture completion.

**Stop conditions**
Stop when every required child has one non-conflicting reconciled state or when the bounded reconciliation attempts are exhausted.

---

## Skill 2 — Diagnose Stale Subagent State

**Purpose**  
Identify why a multi-agent session appears stuck without turning diagnosis into an unbounded tool/model loop.

**Trigger**  
A child appears active significantly longer than expected, a result exists while status remains running, or restart/resume changes visible lifecycle state.

**Inputs**
- lifecycle snapshot before/after refresh;
- persisted child events;
- result-delivery evidence;
- registry/API status;
- task timestamps.

**Preconditions**
A baseline snapshot exists before making changes.

**Procedure**
1. Capture UI/cache state and authoritative state separately.
2. Check for terminal events and result delivery.
3. Compare execution IDs to distinguish resurrection from a legitimate retry.
4. Measure stale age from last authoritative transition.
5. Classify the mismatch: precedence bug, rehydration bug, delayed delivery, missing event, unknown registry, or genuine long-running work.
6. Run at most one refresh/requery cycle per diagnostic attempt.
7. Record whether refresh changed only presentation state or authoritative state.
8. Recommend remediation at the lowest layer that owns the defect.

**Expected output**
Facts, mismatch class, likely ownership layer, measured stale age, and verification status.

**Failure handling**
After two diagnostic attempts without stronger evidence, escalate rather than increasing polling frequency.

**Stop conditions**
A root-cause class is evidence-backed or diagnostic retry limit is reached.

---

## Skill 3 — Verify Parent Completion Against Child Dependencies

**Purpose**  
Prevent parent agents from declaring success while required child work is genuinely unresolved, while also avoiding false blocking from stale UI state.

**Trigger**  
Immediately before final parent completion.

**Inputs**
- required child IDs;
- latest reconciliation reports;
- expected child deliverables.

**Procedure**
1. Reconcile all required children.
2. For terminal-success children, verify expected result/deliverable exists.
3. For terminal-failure children, confirm recovery policy was executed or failure is explicitly surfaced.
4. For active/unknown children, block parent success unless they are explicitly non-blocking.
5. Ignore lower-precedence stale active UI state when stronger terminal evidence is present.
6. Produce a completion ledger: implemented, measured, verified, unresolved.

**Verification**
Parent completion is valid only when blocking child count is zero and required deliverables are present.

**Stop conditions**
Parent may finish only when Definition of Done is satisfied or it reports a blocking failure.
