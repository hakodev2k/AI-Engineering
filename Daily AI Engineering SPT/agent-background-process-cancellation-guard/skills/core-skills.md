# Core Skills

## Skill 1 — Baseline Background-Process Lifecycle

### Purpose
Measure whether cancelled/completed agent tasks leave owned work running.

### Trigger
Before enabling background execution, after a runtime upgrade, or when CPU/RAM/API activity continues after cancellation.

### Inputs
- task/run IDs;
- launch command metadata;
- OS process snapshots;
- runtime task status;
- cancellation timestamps;
- resource metrics.

### Preconditions
Run only against processes created by a controlled test workload. Do not infer ownership from process names.

### Required context
Configured policy, registry path, host OS, agent runtime, and known launcher integration point.

### Tools
`scripts/process_guard.py`, OS process inspection, runtime logs, metrics backend.

### Procedure
1. Create a controlled task with a long-lived child process.
2. Register the logical task before launch.
3. Record PID, process group/session identity, process start identity, command fingerprint, and launch nonce.
4. Capture baseline CPU/RAM and live-owned count.
5. Cancel the parent through the normal provider/runtime control.
6. Measure time until the owned process group reaches zero live members.
7. If descendants remain, classify cancellation propagation failure rather than retrying blindly.
8. Run deterministic reconciliation with `process_guard.py inspect`.
9. Record cancellation latency, survivors, stale registry records, and false-positive candidates.
10. Repeat at least three times or across representative workload classes.

### Decisions
- Zero survivors within deadline: pass baseline.
- Survivors with matching ownership identity: lifecycle defect.
- PID exists but identity changed: PID reuse; never terminate it.
- Runtime says stopped but OS-owned child lives: bookkeeping/runtime divergence.

### Constraints
Do not use fuzzy `pkill`, name matching, or port matching as authority.

### Expected output
A baseline report with cancel latency, survivor count, process identity evidence, and resource impact.

### Metrics
Cancel p50/p95, owned survivors, stale lease count, CPU/RAM after cancel, API activity after cancel.

### Verification
Independent verifier checks OS evidence and registry identity, not the implementer's summary.

### Failure handling
If ownership cannot be established, stop enforcement and collect more launch metadata.

### Stop conditions
Stop after the bounded sample completes or ownership evidence becomes ambiguous.

---

## Skill 2 — Introduce Durable Ownership and Leases

### Purpose
Make background work independently discoverable and safely reclaimable.

### Trigger
Any agent can spawn work that may outlive the immediate tool call or coordinator process.

### Inputs
Logical task ID, parent ID, PID/process-group identity, launch nonce, owner, lease policy.

### Preconditions
A host layer can execute code before/after process launch.

### Procedure
1. Allocate stable logical task ID and cryptographic launch nonce.
2. Start the child in an isolated process group/session where supported.
3. Immediately record PID, group ID, process start identity and nonce in durable registry.
4. Mark state `running` only after identity can be re-read and matched.
5. Refresh lease at configured heartbeat interval.
6. On normal completion, verify no owned descendants remain before setting `completed`.
7. On cancellation, transition to `cancelling` before signaling descendants.
8. After bounded cancellation verification, transition to `cancelled`, `orphaned`, or `needs-human` based on evidence.

### Decisions
A registry record is authoritative only when its process identity still matches current OS evidence.

### Constraints
Registry writes must be atomic. A stale or corrupted registry fails closed for destructive cleanup.

### Expected output
Durable lifecycle entries usable after parent crash/restart.

### Metrics
Registry coverage %, heartbeat freshness, identity-mismatch count, orphan recovery time.

### Verification
Restart the parent runtime and prove the independent inspector can reconstruct ownership state.

### Failure handling
If registry write fails, do not launch untracked background work unless policy explicitly allows degraded foreground execution.

### Stop conditions
Stop rollout if false ownership matches occur.

---

## Skill 3 — Bounded Cancellation and Reaping

### Purpose
Stop owned work without harming unrelated processes.

### Trigger
User cancellation, parent failure, session shutdown, expired lease, resource emergency, or completion barrier.

### Inputs
Registry, policy, current OS process identity evidence.

### Preconditions
Ownership identity is verified.

### Procedure
1. Re-read registry record and current process identity.
2. Reject termination if identity mismatch or record is malformed.
3. Send graceful termination to the owned group/session.
4. Wait up to `graceful_cancel_seconds` while polling deterministically.
5. If zero owned live processes, close as cancelled.
6. If survivors remain, increment bounded attempt counter.
7. If force kill is disabled, mark `needs-human` and stop.
8. If force kill is enabled, re-verify identity immediately before escalation, terminate only verified-owned survivors, and wait `force_cancel_seconds`.
9. Verify zero descendants; otherwise mark `orphaned` and escalate.
10. Append immutable audit event for every state transition.

### Decisions
Unknown ownership is safer than an incorrect kill; unknown means no destructive action.

### Constraints
Maximum attempts are finite. Never weaken identity validation to achieve cleanup metrics.

### Expected output
Terminal lifecycle state plus audit evidence.

### Metrics
Cancel success %, p95 latency, orphan count, force-escalation rate, false-kill rate.

### Verification
Fault-injection tests include parent crash, ignored SIGTERM, stale lease, PID reuse simulation, and unrelated-process coexistence.

### Failure handling
Escalate to host/container supervisor or human operator with exact ownership evidence.

### Stop conditions
Success = zero verified-owned descendants. Failure = bounded attempts exhausted.
