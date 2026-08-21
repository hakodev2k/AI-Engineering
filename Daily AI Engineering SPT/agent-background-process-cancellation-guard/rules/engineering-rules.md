# Engineering Rules

## MUST
- Every background process/task MUST have a stable logical task ID, parent ID, launch nonce, and durable ownership record.
- Every locally spawned background command MUST use a dedicated process group/session or equivalent host isolation when supported.
- The registry MUST store enough process identity evidence to detect PID reuse; PID alone is insufficient.
- Cancellation MUST be treated as a state transition with post-signal verification, not as proof of termination.
- Final task completion MUST be blocked while any required owned descendant is still live.
- Lease expiry MUST trigger reconciliation by an independent inspector/reaper.
- Every destructive termination attempt MUST re-check current process identity immediately before signaling.
- Cleanup retries MUST be bounded by `max_cancel_attempts` and time budgets.
- All cancellation, identity mismatch, stale lease, escalation, and survivor events MUST be auditable.
- Force termination MUST remain disabled unless policy explicitly enables it.
- Corrupt/missing ownership evidence MUST fail closed for destructive cleanup.
- Runtime/UI task status MUST be cross-checked against host process evidence when background OS processes are involved.

## MUST NOT
- MUST NOT kill by process name, command substring, port number, fuzzy match, or PID alone.
- MUST NOT mark a cancelled task terminal until verified-owned descendants are gone or a blocking failure is explicitly recorded.
- MUST NOT claim completion while owned required background work is still active.
- MUST NOT silently downgrade an orphan to success.
- MUST NOT use unlimited polling, unlimited SIGTERM retries, or endless model-driven status loops.
- MUST NOT weaken identity checks because a process is expensive or appears stuck.
- MUST NOT let the LLM decide whether a PID belongs to the task; use deterministic host evidence.
- MUST NOT depend exclusively on the parent agent process for cleanup; crash recovery requires an external reconciliation path.
- MUST NOT persist secrets or full sensitive command arguments in audit logs; store sanitized fingerprints where needed.

## SHOULD
- Run in observe-only mode before enforcing termination in production.
- Prefer OS/container primitives that kill an ownership tree atomically: POSIX process groups, Windows Job Objects, container/cgroup/job supervisors.
- Use atomic registry updates and file locking or a transactional store.
- Emit metrics for live owned processes, stale leases, cancel latency, orphan rate, resource consumption after cancel, and identity mismatches.
- Treat high force-kill rate as a design signal requiring root-cause analysis rather than normal operation.
- Separate logical task IDs from provider session/attempt IDs so retries do not lose ownership history.
- Add a completion hook that verifies zero live required descendants before final user-visible success.
- Keep reaper privileges no broader than required for processes launched by the agent runtime.
