# Core Skills

## Skill 1 — Seal the approved obligation baseline

**Purpose:** Convert an approved plan into a stable, content-addressed task set that cannot silently shrink during execution.  
**Trigger:** Immediately after requirements/plan approval and before implementation.  
**Inputs:** Approved requirements, task list, mandatory/optional classification, acceptance criteria.  
**Preconditions:** Material requirements are known; unresolved ambiguities are explicitly marked.  
**Required context:** User request, approved plan, repository constraints, risk level.  
**Tools:** Text/JSON editor, `scripts/ledger_guard.py hash`, source control or durable storage.

### Procedure
1. Normalize each material obligation into one task with a stable ID such as `TASK-001`.
2. Record title, `mandatory`, and concise acceptance criteria.
3. Do not encode hidden reasoning; record only externally inspectable obligations.
4. Serialize the task array exactly as the host will store it.
5. Compute the canonical SHA-256 with `ledger_guard.py hash`.
6. Store tasks plus hash in the ledger baseline.
7. Record run ID, policy version, risk level, and initial empty event list.
8. Validate the baseline before any implementation begins.

**Decisions:** If one requirement spans independently verifiable outcomes, split it before sealing. If a new requirement appears later, add it through an explicit baseline amendment controlled by the host rather than rewriting the original baseline in place.  
**Constraints:** Stable IDs never get reused. Renaming does not change identity. Mandatory status cannot be downgraded silently.  
**Expected output:** Valid ledger with a sealed baseline hash.  
**Metrics:** Baseline hash validity; duplicate-ID count; percentage of material requirements represented.  
**Verification:** Recompute hash independently and compare.  
**Failure handling:** On hash mismatch, stop execution and restore/reseal from the approved source.  
**Stop condition:** Baseline hash validates and all material obligations have stable IDs.

## Skill 2 — Record progress as append-only transitions

**Purpose:** Make task lifecycle changes auditable and prevent disappearing work.  
**Trigger:** Every material state change.  
**Inputs:** Current derived state, intended transition, actor, evidence references, cancellation approval if needed.  
**Preconditions:** Valid sealed baseline.  
**Required context:** Policy transition table and current ledger.  
**Tools:** Ledger writer and validator.

### Procedure
1. Read the current state derived from existing events; never trust a separately edited status field.
2. Check whether the transition is policy-allowed.
3. Append exactly one event with monotonic `seq`, `task_id`, `from`, `to`, `actor`, timestamp, and reason when useful.
4. For `completed`, attach evidence references required by policy.
5. For mandatory `cancelled`, attach explicit human approval/reference.
6. Validate immediately after append.
7. If validation fails, retain the failed attempt in host logs but do not mutate prior valid history.

**Decisions:** A blocked task remains visible. A task that is no longer required becomes `cancelled`, never deleted.  
**Constraints:** Never edit or reorder prior ledger events. Never replace one task ID with a new item merely to reset status.  
**Expected output:** Append-only event stream with a reproducible current state.  
**Metrics:** Illegal-transition rejection count; cancellation-approval coverage; sequence-gap count.  
**Verification:** Rebuild state from event zero and compare with expected state.  
**Failure handling:** Reject invalid event and escalate if the actor repeatedly requests forbidden transitions.  
**Stop condition:** Event is valid and current state is reproducible.

## Skill 3 — Reconcile progress before stop/completion

**Purpose:** Prevent an agent from ending with missing or unresolved obligations.  
**Trigger:** Before final response, process exit, PR creation, merge request, or any “done” signal.  
**Inputs:** Ledger, policy, repository diff, verification evidence, execution status.  
**Preconditions:** No unresolved ledger parse errors.  
**Required context:** Approved baseline, all events, changed files, validation results.  
**Tools:** `ledger_guard.py gate`, git/diff tools, test output, optional independent verifier.

### Procedure
1. Verify baseline hash.
2. Replay all transitions and reject unknown tasks, sequence gaps, illegal state changes, and evidence-free completion.
3. Confirm every mandatory baseline task is terminal (`completed` or explicitly approved `cancelled`).
4. Compare current repo state and verification results with the ledger; flag work that suggests an obligation exists but is not represented.
5. For high-risk runs, require an independent verifier identity/result.
6. Run deterministic gate.
7. If blocked, generate only named remediation targets; do not rewrite the task set to make the gate pass.
8. Retry remediation at most the policy maximum.

**Decisions:** If the ledger and repo disagree, treat the run as incomplete until reconciled.  
**Constraints:** Do not lower acceptance criteria or mandatory classification to satisfy the gate.  
**Expected output:** `complete`, `incomplete`, or `blocked` with explicit reasons.  
**Metrics:** Missing-task detections; pending-at-stop interceptions; false completion incidents; remediation attempts.  
**Verification:** Independent replay/gate for high-risk changes.  
**Failure handling:** Preserve ledger and report unresolved blockers after retry limit.  
**Stop condition:** Gate passes or retry limit/required human decision is reached.

## Skill 4 — Investigate suspected ledger tampering

**Purpose:** Distinguish normal plan evolution from silent progress manipulation.  
**Trigger:** Baseline hash mismatch, missing task, unexpected terminal state, event sequence anomaly, or conflict between summary and ledger.  
**Inputs:** Original approved plan, ledger, repository history, orchestration logs, tool events.  
**Preconditions:** Preserve existing evidence before repair.  
**Tools:** Diff/history inspection, ledger validator, logs.

### Procedure
1. Freeze writes to the affected ledger.
2. Recompute baseline hash and replay events to identify the first divergence.
3. Compare the sealed obligations with current task view and final summary.
4. Classify divergence as malformed event, unauthorized cancellation, silent deletion/rewrite, evidence-free completion, or legitimate approved amendment.
5. Recover by appending corrective events or restoring from the sealed baseline; never erase the anomalous history.
6. Require independent review when manipulation affected mandatory/high-risk work.
7. Record incident reason and corrective action.

**Decisions:** Do not infer malicious intent from state corruption alone; classify observable behavior only.  
**Constraints:** Preserve audit evidence and user-owned tracking artifacts.  
**Expected output:** Tamper analysis with first bad transition, impacted tasks, recovery action, and verification status.  
**Metrics:** Time to detect; number of affected obligations; successful recovery rate.  
**Verification:** Re-run full validation and gate after recovery.  
**Failure handling:** If baseline cannot be trusted, stop and request human re-approval of a reconstructed plan.  
**Stop condition:** Integrity restored and independently verified, or run is safely blocked.