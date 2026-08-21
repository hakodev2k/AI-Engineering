# Core Skills

## Skill 1 — Build a Delegation Lifecycle Contract

### Purpose
Turn free-form delegation into an explicit parent-child contract that can be checked without trusting model narration.

### Trigger
Before spawning any subagent, nested agent, asynchronous reviewer, background analysis task, or delegated tool sequence whose result is required by a parent task.

### Inputs
- Parent task identifier.
- Child purpose and scope.
- Whether the child is required or optional.
- Expected output/artifact contract.
- Deadline and retry budget.
- Allowed tools and safety constraints.

### Preconditions
- Parent task has a stable identifier.
- The orchestrator can persist a lifecycle ledger outside the LLM context.
- Required outputs can be expressed as observable artifacts or structured fields.

### Required context
Task requirements, dependency graph, current ledger, safety policy, and expected handoff schema.

### Tools
Orchestrator/scheduler API, filesystem or durable store, `scripts/join_guard.py`, provider task status API when available.

### Procedure
1. Assign a stable child `task_id`; never use display text as identity.
2. Record `parent_id`, `required`, `owner`, `expected_outputs`, `created_at`, deadline, and safety constraints.
3. Set state to `planned`.
4. Before dispatch, validate that the parent exists and expected outputs are non-empty for required children.
5. Dispatch exactly once or use an idempotency key if the runtime may retry.
6. Transition to `dispatched`, then `running` only on provider evidence that execution started.
7. Record provider task/session ID separately from stable logical task ID.
8. On every terminal event, record a terminal state and terminal reason.
9. For `succeeded`, require a handoff record containing artifact references, result summary, evidence locations, and unresolved risks.
10. Hand the ledger to the join barrier rather than allowing the parent to infer completion from conversation text.

### Decisions
- Required child with no output contract: block dispatch and fix the plan.
- Optional child: may fail without failing the parent, but must still reach a terminal state or be explicitly cancelled.
- Provider task ID changes after resume: preserve logical task ID and append provider attempt metadata.

### Constraints
- Do not store hidden chain-of-thought.
- Do not grant new permissions to recover a stalled child.
- Do not silently convert timeout/resource exhaustion to success.

### Expected output
A persisted lifecycle record that uniquely identifies the child and states what evidence is needed to join it.

### Metrics
Contract coverage, missing-parent count, children without expected outputs, duplicate logical dispatches.

### Verification
Run `python scripts/join_guard.py validate-ledger --ledger <path>` and require exit code 0.

### Failure handling
Reject invalid records; do not spawn until corrected. At most two metadata-correction attempts before escalating to the orchestrator owner.

### Stop conditions
Stop once the child contract is valid and durably persisted before dispatch.

---

## Skill 2 — Execute a Bounded Join Barrier

### Purpose
Prevent parent success while required descendants are non-terminal, stale, orphaned, or missing verified handoffs.

### Trigger
Before a parent reports success, advances beyond a dependency checkpoint, publishes an artifact, merges a result, or exits a headless run.

### Inputs
Lifecycle ledger, policy, required child set, handoff directory, verification directory.

### Preconditions
All delegated children are represented in the ledger.

### Required context
Required/optional classification, descendant graph, last heartbeat timestamps, terminal reasons, output contracts.

### Tools
`join_guard.py check`, deterministic provider status API, clock/timer, artifact validator.

### Procedure
1. Calculate the full descendant closure of the parent.
2. Select all required descendants.
3. Classify each as terminal-valid, terminal-invalid, active-fresh, active-stale, or structurally-invalid.
4. If structurally invalid, block immediately.
5. If active-fresh, wait using deterministic timers rather than an LLM turn when possible.
6. Re-check at `poll_interval_seconds` until a terminal event, stale timeout, or global wait deadline.
7. If active-stale exceeds `stale_timeout_seconds`, mark as suspected orphan and query provider status once through an authoritative API.
8. If provider cannot prove liveness, transition to `orphaned` with evidence; do not wait indefinitely.
9. For terminal `succeeded`, verify the required handoff exists and passes independent verification.
10. For terminal `failed`, `timed_out`, `resource_exhausted`, `orphaned`, or `cancelled`, apply required/optional policy.
11. Parent success is allowed only when every required descendant is `succeeded` with a valid independently verified handoff.
12. Emit a machine-readable barrier result.

### Decisions
- Required failure: parent fails or enters explicit recovery; never success.
- Optional failure: record degradation and continue if policy allows.
- Child resource exhaustion with useful partial work: preserve the partial handoff, but it does not satisfy a required success contract unless the parent replans and explicitly changes requirements.

### Constraints
No unlimited retries. No model-driven status polling when deterministic status reads are available.

### Expected output
`PASS` only with zero unresolved required descendants; otherwise a categorized blocking report.

### Metrics
Join latency, stale-child detection latency, polling count, model calls used for waiting, unresolved required children at parent exit.

### Verification
The join checker must return exit 0 for pass and non-zero for any blocking condition.

### Failure handling
Maximum wait is policy-bound. On expiry, classify unresolved required children as timed out/orphaned and fail the barrier.

### Stop conditions
Pass when all required descendants have verified handoffs; fail when any required descendant reaches a blocking terminal condition or the global wait deadline expires.

---

## Skill 3 — Produce and Verify a Structured Handoff

### Purpose
Ensure a child finishing is not confused with the parent actually receiving usable results.

### Trigger
Whenever a child reaches a terminal state.

### Inputs
Child task record, expected output contract, produced artifacts, partial results, terminal reason.

### Preconditions
Child logical identity and parent linkage are known.

### Required context
Expected outputs and verifier requirements.

### Tools
Artifact filesystem/store, tests/linters as relevant, independent verifier agent or deterministic validator.

### Procedure
1. Write a handoff document keyed by logical task ID.
2. Include terminal state, terminal reason, attempt/provider IDs, artifact paths/URIs, evidence, checks executed, unresolved risks, and whether the result is partial.
3. For success, compare produced outputs against every expected output item.
4. Run deterministic checks first.
5. Assign an independent verifier for semantic requirements that deterministic checks cannot prove.
6. Persist verification with verifier identity, timestamp, checks, and verdict.
7. Only a `verified=true` verdict may satisfy a required successful child join.

### Decisions
Missing artifact means invalid handoff. Partial handoff from a failed/resource-exhausted child is useful recovery evidence but not success evidence.

### Constraints
The implementing child must not be the sole verifier for high-impact changes.

### Expected output
A handoff plus verification record attributable to one logical child task.

### Metrics
Handoff completeness, verifier coverage, artifact-missing rate, rework caused by invalid handoffs.

### Verification
`join_guard.py check` validates existence and verifier verdict for required successful descendants.

### Failure handling
Permit one handoff repair attempt if the child is still available and no new side effect is required; otherwise fail and replan.

### Stop conditions
Stop after verified handoff or explicit blocking terminal outcome.

---

## Skill 4 — Recover from Stalled or Resource-Limited Children

### Purpose
Recover useful work without hiding failure or entering expensive unbounded polling loops.

### Trigger
Stale heartbeat, provider timeout, usage/spend limit, process loss, notification-delivery failure, or ambiguous status.

### Inputs
Ledger, provider task status, latest durable handoff/checkpoint, policy, remaining parent budget.

### Preconditions
Logical task identity and expected outputs exist.

### Procedure
1. Capture the last authoritative state and timestamp.
2. Classify failure: stale, resource exhausted, timeout, provider unavailable, orphaned, or unknown.
3. Preserve any durable partial artifact/checkpoint.
4. Do not automatically retry destructive or non-idempotent work.
5. If retry is safe and budget remains, create a new attempt under the same logical task ID and record provenance.
6. Limit recovery to two attempts by default.
7. If no safe retry exists, record terminal failure and propagate it to the parent barrier.
8. Reuse partial evidence to reduce repeated work, but verify freshness before trusting it.

### Metrics
Recovery attempts, repeated-work ratio, time to classify stalls, partial-work reuse rate.

### Verification
Every retry must be traceable to the original logical task and must not erase previous attempt history.

### Failure handling
After retry budget exhaustion, fail closed and escalate to the parent plan.

### Stop conditions
Recovered verified handoff, explicit terminal failure, or retry budget exhausted.
