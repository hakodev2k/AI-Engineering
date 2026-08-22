# Workflow: Resumable Execution

## Entry condition
A task is expected to span multiple stages, may be interrupted, or includes external side effects/retry loops that must be recoverable.

## Required inputs
- Task objective and acceptance criteria.
- Repository/environment baseline.
- Existing checkpoint if resuming.
- Approval policy and retry limit.

## Stages

### 1. Initialize — Recovery Planner
Create or load checkpoint, record baseline, constraints, approvals, retry policy, and ordered stages.

**Artifact:** `.agent-state/checkpoint-state.json`

**Checkpoint:** schema validation must pass before execution.

### 2. Reconcile — Recovery Planner
If resuming, compare persisted state with current Git/environment/external evidence.

Decision:
- `continue`: state matches;
- `restart-stage`: current stage has no material side effect and can safely restart;
- `reconcile`: benign drift must be recorded first;
- `blocked`: unsafe ambiguity or missing approval.

### 3. Execute one bounded stage — Execution Agent
Perform only the current stage. Record commands, changed files/resources, external identifiers, and outcome.

### 4. Checkpoint — deterministic hook + Execution Agent
Persist event history, failures, retry counters, stage evidence, and exactly one `next_action`.

Run:

```bash
python scripts/validate-checkpoint.py --checkpoint .agent-state/checkpoint-state.json
```

If invalid, stop.

### 5. Failure loop
For an idempotent transient failure:

```text
Failure
  ↓
Record fingerprint + evidence
  ↓
Retry budget remaining?
  ├─ Yes → Retry same bounded action
  └─ No  → Block + escalate
```

Maximum retries default to 2. A changed failure fingerprint returns control to the planner rather than consuming retries blindly.

For non-idempotent actions with unknown outcome: no automatic retry.

### 6. Stage transition
A stage may become `completed` only when its declared evidence exists. Persist the next stage before executing it.

### 7. Verification — Verification Agent
After all execution stages complete:
- validate checkpoint;
- inspect final diff/state;
- run applicable build/tests/static analysis;
- verify acceptance criteria and contracts;
- confirm no pending approval or unresolved failure.

### 8. Fix-retest loop
If verification fails, return evidence to Recovery Planner. Planner may create a diagnosis/fix stage.

Maximum two fix-retest iterations for the same root-failure fingerprint. Then stop and report unresolved evidence.

### 9. Close
Set task status to `verified` only when Verification Agent returns `verified` and evidence is appended.

## Human approval points
Explicit approval is required before:
- production deployment;
- DB schema/destructive data changes;
- deletion of resources/files when not explicitly part of the approved task;
- secret or production configuration mutation;
- force push/history rewrite;
- breaking public contracts;
- retry of uncertain non-idempotent external side effects.

## Stop conditions
Stop when:
- checkpoint validation fails and cannot be repaired from evidence;
- retry budget is exhausted;
- persisted and current state conflict materially;
- an external side effect has unknown outcome;
- required human approval is absent;
- verification fails after bounded fix-retest attempts.

## Definition of Done
The task is done only when:
1. Every planned stage is completed with evidence.
2. Checkpoint schema validation passes.
3. Current repository/environment state is reconciled.
4. Relevant verification checks pass.
5. No unresolved failure or pending approval remains.
6. Verification Agent returns `verified`.
7. Checkpoint status is `verified` with final evidence.
