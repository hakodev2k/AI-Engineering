# Workflows

## Workflow A — Plan → Dispatch → Join → Verify

### Trigger
A parent task delegates any required work to one or more subagents/background tasks.

### Goal
Ensure delegation cannot disappear between spawn and parent completion.

### Inputs
Parent requirements, delegation plan, `config/policy.json`, lifecycle ledger, provider/runtime task API.

### Baseline
Capture current task count, existing descendants, model/tool calls used only for waiting, and current unresolved-child count.

### Context
Explicit Facts, Assumptions, Dependencies, Required outputs, Safety constraints, and Verification status. Do not store hidden reasoning.

### Stages
1. **Contract** — Lifecycle Planner creates logical child records.
2. **Validate** — `join_guard.py validate-ledger` validates structure before dispatch.
3. **Dispatch** — Execution Coordinator spawns each child and records provider attempt IDs.
4. **Observe** — runtime events update heartbeat/state; deterministic status reads are preferred to model turns.
5. **Collect** — terminal children produce handoffs.
6. **Verify** — Handoff Verifier validates successful required handoffs.
7. **Join** — Join Barrier computes descendant closure and evaluates all required children.
8. **Complete or block** — parent can complete only on barrier PASS.

### Responsible agents
Lifecycle Planner → Execution Coordinator → Handoff Verifier → Join Barrier Agent.

### Tools
Provider task APIs, durable store, `scripts/join_guard.py`, tests/linters/artifact validators.

### Outputs
Lifecycle ledger, handoff records, verification records, barrier result.

### Checkpoints
- C1: contracts valid before first dispatch.
- C2: all provider task IDs mapped to logical IDs.
- C3: all required children terminal before join pass.
- C4: all required successful children independently verified.

### Metrics
Required-unjoined count, handoff verification coverage, join latency, model wait calls, stale detections, retry count.

### Retry policy
A task may receive at most two execution recovery attempts unless project policy is stricter. Retrying non-idempotent side effects requires explicit approval/idempotency protection.

### Stop conditions
- PASS: every required descendant succeeded and has verified handoff.
- BLOCKED: any required descendant has a blocking terminal state, structural error, or wait deadline expires.

### Failure path
Preserve partial work → classify failure → retry safely if allowed → otherwise propagate terminal failure → parent replans or fails.

### Verification
The final barrier verdict must be reproducible by running `join_guard.py check` against persisted records.

### Definition of Done
No required descendant is unresolved; every successful required handoff is verified; no unlimited wait exists; parent result agrees with deterministic barrier status.

---

## Workflow B — Stale Child Detection and Recovery

### Trigger
A child remains `running`/`dispatched` without heartbeat beyond policy threshold, or a background completion notification is expected but not observed.

### Goal
Detect orphan/stall promptly without expensive indefinite polling.

### Inputs
Task record, last heartbeat, policy, provider status endpoint, partial artifacts.

### Baseline
Record stale age, previous status-check count, model calls consumed by waiting, last durable artifact time.

### Stages
1. Compute stale age outside the model.
2. If below threshold, schedule the next deterministic status check.
3. If above threshold, query authoritative provider status once.
4. If provider proves active liveness, update heartbeat evidence and continue bounded wait.
5. If provider reports terminal, normalize terminal reason and collect handoff.
6. If provider cannot resolve the task or status remains ambiguous, classify `orphaned` after the configured recovery check.
7. Preserve partial artifacts/checkpoints.
8. Recovery Coordinator chooses safe retry or terminal propagation.

### Responsible agent
Execution Coordinator; Recovery Coordinator after stale classification.

### Tools
Clock, provider status API, lifecycle store, process/task supervisor.

### Outputs
Fresh liveness evidence, normalized terminal state, or blocking orphan classification.

### Checkpoints
- No model-mediated wait loop when deterministic status is available.
- Global join deadline remains unchanged by repeated stale checks.
- Every retry appends an attempt instead of rewriting history.

### Metrics
Detection latency, stale false-positive rate, status-poll count, tokens used during idle wait, orphan count.

### Retry policy
At most two recovery attempts. Provider status checks use bounded retry (maximum 3 transient retries with backoff) and do not reset the global deadline.

### Stop conditions
Resolved terminal state, verified recovery attempt starts, or retry/global deadline exhausted.

### Failure path
If provider is unavailable through the global deadline, block the required join with `unknown/orphaned` evidence rather than assuming success.

### Verification
Timeline demonstrates stale detection within policy threshold plus polling interval.

### Definition of Done
No stale required child remains indefinitely `running` without liveness evidence.

---

## Workflow C — Resource Exhaustion Partial-Handoff Recovery

### Trigger
A child terminates because of account usage/spend limit, context/resource exhaustion, provider quota, or watchdog termination after partial progress.

### Goal
Preserve useful work, avoid repeated full work, and keep parent success truthful.

### Inputs
Child transcript metadata, durable artifacts/checkpoints, terminal reason, remaining budget.

### Baseline
Record completed outputs vs expected outputs and cost/time already spent.

### Stages
1. Normalize terminal state to `resource_exhausted` or appropriate failure reason.
2. Inventory durable outputs produced before termination.
3. Write a partial handoff with `partial=true`; include missing expected outputs explicitly.
4. Verify partial artifacts for integrity/freshness without treating them as success.
5. Parent replans the remainder only.
6. If safe budget exists, dispatch a continuation/new attempt referencing partial artifacts.
7. Re-run final handoff verification across combined artifacts.
8. Apply the normal join barrier.

### Responsible agents
Execution Coordinator → Recovery Coordinator → Handoff Verifier → Join Barrier Agent.

### Tools
Artifact store, ledger, provider quota/status information, test tools.

### Outputs
Partial handoff, remainder plan, traceable continuation, or blocking failure.

### Checkpoints
Partial result cannot satisfy required success; repeated work is measured; prior evidence is not silently discarded.

### Metrics
Partial-work reuse rate, repeated-work ratio, recovery cost, missing-output count after continuation.

### Retry policy
Maximum two attempts. Stop earlier if resource budget cannot support completion.

### Stop conditions
Verified complete handoff or explicit blocking resource failure.

### Failure path
Escalate with exact missing outputs and preserved partial evidence; do not claim completion.

### Verification
Final verifier confirms all original expected outputs, not merely the continuation subset.

### Definition of Done
Either the original contract is fully verified or parent is explicitly blocked with recoverable evidence.

---

## Workflow D — Headless CI Completion Gate

### Trigger
A CI/headless agent run is about to exit after spawning any required delegated work.

### Goal
Prevent exit code 0 when child work is orphaned, pending, invalid, or unverified.

### Inputs
Parent ID, ledger, policy, handoffs, verifications.

### Stages
1. Run `join_guard.py check`.
2. If exit code 0, continue final product-level verification.
3. If non-zero, emit blocker report and return non-zero process exit.
4. Cleanup optional descendants safely; never cancel required work merely to make CI green.

### Metrics
False-success count, unresolved descendants at process exit, CI runs blocked correctly.

### Retry policy
No automatic barrier retry beyond normal bounded lifecycle workflow; a failed barrier requires lifecycle progress or explicit replanning.

### Stop conditions
Barrier pass or process fails.

### Verification
Inject a running required child and confirm CI gate fails; inject a succeeded-but-unverified handoff and confirm gate fails; only fully verified required descendants pass.

### Definition of Done
`required_unjoined_at_parent_success == 0` for all headless runs using the gate.
