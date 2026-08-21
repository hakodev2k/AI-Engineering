# Workflows

## Workflow 1 — Normal guarded execution

**Trigger:** Approved multi-step agent task.  
**Goal:** Execute work while keeping the progress control plane trustworthy.  
**Inputs:** Approved requirements, repository, policy, risk level.  
**Baseline:** Capture task count, mandatory count, baseline hash, repository commit/ref, and initial verification status.

### Stages
1. **Contract** — Baseline Contract Agent assigns stable IDs and acceptance criteria.
2. **Seal** — Compute and persist baseline hash.
3. **Execute** — Implementation Agent works one or more task IDs.
4. **Record** — Ledger/Reconciliation Agent validates and appends each transition.
5. **Verify** — Run task-specific tests/inspections and attach evidence references.
6. **Reconcile** — Replay all events and compare ledger against repo/test state.
7. **Independent review** — Required for high-risk runs.
8. **Gate** — `ledger_guard.py gate` decides semantic completion.
9. **Deliver** — Only gate exit 0 permits a success status.

**Tools:** Git/repository tools, tests/CI, `ledger_guard.py`.  
**Outputs:** Sealed ledger, implementation artifacts, evidence references, gate report.  
**Checkpoints:** After baseline seal; after each terminal transition; before final response.  
**Metrics:** Open mandatory tasks, illegal transitions rejected, pending-at-stop interceptions, reconciliation retries.  
**Retry policy:** At most `max_reconciliation_retries`; each retry must target explicit blocking IDs.  
**Stop conditions:** Gate passes; retry limit reached; required human approval missing; baseline integrity cannot be restored.  
**Failure path:** Preserve ledger, report incomplete/blocked, do not delete obligations.  
**Verification:** Deterministic gate plus independent verification when required.  
**Definition of Done:** Original mandatory obligation set is fully accounted for and gate passes.

## Workflow 2 — Premature-stop interception

**Trigger:** Agent attempts to finish, process exits, or final response begins.  
**Goal:** Prevent a convincing summary from bypassing remaining work.  
**Inputs:** Current ledger and policy.  
**Baseline:** Current states derived by replay.

### Stages
1. Run `validate` to confirm ledger integrity.
2. Run `gate` to enumerate unresolved mandatory IDs.
3. If none remain, proceed to normal final verification.
4. If remediable IDs remain, return only those IDs to the orchestrator for continuation.
5. Increment reconciliation retry counter.
6. Re-run validation and gate after remediation.

**Responsible agent:** Orchestrator + Ledger/Reconciliation Agent.  
**Outputs:** Pass or explicit continuation/block list.  
**Retry policy:** Maximum configured retries; never unlimited continuation.  
**Stop conditions:** Pass, retry exhaustion, cancellation by user, or hard blocker.  
**Failure path:** Report `incomplete`, preserving all open tasks.  
**Definition of Done:** No unresolved mandatory tasks and all integrity checks pass.

## Workflow 3 — Suspected tracker manipulation recovery

**Trigger:** Hash mismatch, disappeared obligation, altered task ID, illegal transition, or mismatch between original plan and current tracker.  
**Goal:** Preserve evidence, identify first divergence, and reconstruct trustworthy state.  
**Inputs:** Approved plan snapshot, current ledger, repo history, orchestration logs.  
**Baseline:** Last known valid hash/event sequence.

### Stages
1. Freeze further ledger writes.
2. Preserve current files/logs and compute hashes.
3. Rebuild task states from the last known valid baseline and event prefix.
4. Identify first invalid mutation and impacted task IDs.
5. Classify as accidental malformed state, unauthorized cancellation, silent deletion/rewrite, or approved amendment missing metadata.
6. Restore trust by appending corrective events or rebuilding from the sealed baseline; do not erase anomalous evidence.
7. Require human re-approval if the original baseline itself is ambiguous or untrusted.
8. Independently verify recovered state.
9. Resume only if integrity passes.

**Retry policy:** One reconstruction attempt plus one independent verification pass.  
**Stop conditions:** Integrity restored or human re-approval required.  
**Failure path:** Freeze run as blocked and retain forensic artifacts.  
**Definition of Done:** Recovered ledger validates from baseline through latest event with no unexplained obligation loss.