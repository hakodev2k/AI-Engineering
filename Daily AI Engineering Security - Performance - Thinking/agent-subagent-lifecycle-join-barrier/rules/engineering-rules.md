# Engineering Rules

## MUST

- Every delegated logical task MUST have a stable `task_id` and `parent_id` before dispatch.
- Every required child MUST declare observable expected outputs before dispatch.
- Parent completion MUST be gated by a deterministic descendant join check, not by model narration such as “all agents finished.”
- Every required descendant MUST reach an allowed terminal state before the parent can complete.
- A required descendant in `succeeded` state MUST have a persisted handoff and independent verification verdict `pass`.
- A required descendant in `failed`, `cancelled`, `timed_out`, `resource_exhausted`, or `orphaned` MUST block parent success until the parent explicitly replans and creates a new valid contract.
- State transitions MUST be persisted outside volatile model context.
- Lifecycle state MUST be monotonic per attempt; a terminal attempt MUST NOT silently become `running` again.
- Resumed/retried provider executions MUST create a new attempt record under the same logical task identity.
- Waiting MUST have a maximum wall-clock deadline and retry count.
- Stale running tasks MUST be checked through an authoritative provider/runtime status source when available.
- If liveness cannot be established after the stale threshold and authoritative check, the task MUST be classified as blocking rather than waited on forever.
- Headless process exit code MUST derive from the join-barrier result when required subagents were used.
- Partial results from resource exhaustion or failure MUST be preserved when available and labeled `partial=true`.
- Handoffs MUST include artifact/evidence references, terminal reason, attempt identity, checks performed, and unresolved risks.
- The implementing child MUST NOT be the sole verifier for high-impact or required semantic work.
- Optional descendants MUST still be terminalized or explicitly cancelled before orchestration cleanup.
- Any scheduler/runtime ambiguity that could hide required unfinished work MUST fail closed.

## MUST NOT

- MUST NOT treat `spawn`/`dispatch` success as child completion.
- MUST NOT treat a notification being enqueued as proof that the parent received it.
- MUST NOT infer child success solely from the parent process exit status.
- MUST NOT use unlimited `wait`, retry, resume, polling, or notification loops.
- MUST NOT spend repeated LLM turns merely to poll a status endpoint when a deterministic status check is available.
- MUST NOT silently coerce `resource_exhausted`, timeout, interrupted, or orphaned states to `succeeded`.
- MUST NOT discard partial artifacts when a child fails after producing useful durable work.
- MUST NOT grant broader filesystem, network, credential, repository, or production permissions to make a stuck join pass.
- MUST NOT retry destructive/non-idempotent work without explicit idempotency or human approval.
- MUST NOT overwrite previous attempt history during resume/retry.
- MUST NOT allow a child to satisfy its own independent-verification requirement.
- MUST NOT allow stale `running` state to survive beyond policy without evidence of liveness.

## SHOULD

- Provider status polling SHOULD run outside the model loop.
- Poll interval SHOULD use bounded backoff for long-running tasks where provider events are unavailable.
- Event-driven completion SHOULD be preferred over polling, while the ledger remains the source of truth.
- Parent-child graphs SHOULD support descendant closure so nested grandchildren cannot escape the barrier.
- Required/optional classification SHOULD be decided during planning rather than after failure.
- Handoff schemas SHOULD be machine-readable enough for deterministic checks.
- Child tasks SHOULD checkpoint useful intermediate artifacts at natural stage boundaries.
- Resource budgets SHOULD be assigned before dispatch so resource exhaustion is predictable and recoverable.
- Orchestrators SHOULD record metrics for join latency, stale detections, wait polls, retry count, handoff validity, and unresolved-child count.
- Cleanup SHOULD cancel or reap optional background work that is no longer useful after parent completion/failure.

## Observable invariants

1. `parent_success => required_unjoined_descendants == 0`.
2. `required_child_success => verified_handoff_exists == true`.
3. `terminal_attempt => later_state_for_same_attempt != running`.
4. `wait_elapsed <= max_join_wait_seconds`.
5. `stale_running_age <= stale_timeout + detection_interval`, unless authoritative liveness evidence exists.
6. `required_failure => parent_success == false`, unless a new explicit plan replaces the failed dependency.
7. `logical_task_retry => attempt_count increases and history remains append-only`.
