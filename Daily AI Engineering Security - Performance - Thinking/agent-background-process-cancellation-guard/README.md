# Agent Background Process Cancellation Guard

## Topic
Provider-neutral lifecycle ownership, cancellation propagation, orphan detection, and completion gating for AI-agent background processes.

## Category
**Performance**

## Problem
Agent runtimes can launch background subagents, shell commands, MCP servers, test/build processes, and API-driving scripts that outlive the parent turn/session. Recent 2026 issue reports across Claude Code and Codex show descendants continuing after stop requests, stale running state, unresponsive cancellation under memory pressure, and task completion while background work is still consuming resources.

## Evidence
See `evidence/research.md`. Key public signals include:
- Claude Code #66339 — background agents continued for 21+ hours after stop attempts and consumed substantial tokens.
- Claude Code #68642 — completion was reported while background API processes continued for hours.
- Claude Code #27959 — background Bash children became orphaned after interruption/session close.
- OpenAI Codex #29057 — stop/cancel became ineffective under subagent/MCP memory pressure.
- Claude Code #68992 and #65925 — task-state bookkeeping could remain stuck or persist across restarts.

## Existing approach
Typical systems rely on provider-native stop controls, Ctrl+C/SIGINT, task panels, runtime-internal child tracking, process cleanup on application exit, container/job timeouts, or manual process termination.

## Existing limitations
A cancellation signal is not proof that descendants terminated. Immediate child shells may exit while grandchildren survive, UI/runtime state may diverge from OS reality, parent crashes can skip cleanup, and manual process-name matching risks killing unrelated work. Resource exhaustion can also make the coordinator itself unable to perform graceful cleanup.

## Proposed improvement
Introduce an external lifecycle contract:

```text
register logical task
  -> isolate process group/session
  -> persist PID + start identity + parent + nonce
  -> heartbeat lease
  -> cancellation request
  -> verify ownership
  -> graceful process-group stop
  -> bounded wait
  -> optional explicitly-authorized force escalation
  -> verify zero owned descendants
  -> allow terminal completion
```

The LLM may decide *when* work should stop, but deterministic host logic decides *what process is owned* and whether cleanup actually completed.

## Architecture

### Durable ownership registry
Stores stable logical task IDs, parent linkage, PID, process-group ID, process-start identity, launch nonce, lifecycle state, heartbeat, and cancel attempts.

### Process identity boundary
PID alone is not trusted. The Linux reference implementation validates `/proc/<pid>/stat` start time to detect PID reuse or mismatches. Other OS adapters must provide an equivalent identity primitive.

### Lease/heartbeat
Authorized long-running work refreshes a lease. An independent reaper can detect abandoned records after coordinator crash.

### Cancellation adapter
`scripts/cancel_posix.py` uses process-group signaling with dry-run as the default. Destructive signals require current identity verification. Force kill additionally requires both policy and CLI opt-in.

### Completion barrier
`scripts/process_guard.py gate` traverses task descendants and blocks final success while a live or ambiguous owned descendant remains.

### Independent verification
The implementing agent is not the sole verifier. Fault-injection tests and deployment metrics determine whether cancellation is actually effective.

## Package structure

```text
agent-background-process-cancellation-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── examples/
│   └── registry.example.json
├── hooks/
│   └── hooks.md
├── rules/
│   └── engineering-rules.md
├── scripts/
│   ├── cancel_posix.py
│   └── process_guard.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── test_process_guard.py
├── verification/
│   └── verification-report.md
└── workflows/
    └── workflows.md
```

## Installation
Requirements for the reference implementation:
- Python 3.10+;
- Linux `/proc` for automatic process-start identity;
- host integration capable of launching background work in an isolated process group/session.

Create runtime storage:

```bash
mkdir -p .agent-process-guard
printf '{"version":1,"tasks":{}}\n' > .agent-process-guard/registry.json
```

For Windows, implement the same contract with Job Objects rather than process-name matching.

## Configuration
Edit `config/policy.json`.

Important defaults:
- lease: 120 seconds;
- heartbeat: 30 seconds;
- graceful cancel: 10 seconds;
- maximum cancel attempts: 2;
- force kill: disabled;
- observe-only: enabled;
- completion requires zero live descendants.

These are package defaults, not provider guarantees. Tune them after measuring representative workloads.

## Usage

### Register controlled background work

```bash
python scripts/process_guard.py --policy config/policy.json register \
  --task-id build-123 \
  --parent-id root-task \
  --pid "$PID" \
  --pgid "$PGID" \
  --nonce "$LAUNCH_NONCE"
```

### Refresh lease

```bash
python scripts/process_guard.py --policy config/policy.json heartbeat --task-id build-123
```

### Inspect identity

```bash
python scripts/process_guard.py --policy config/policy.json inspect --task-id build-123
```

### Dry-run cancellation decision

```bash
python scripts/cancel_posix.py --policy config/policy.json --task-id build-123
```

### Execute graceful POSIX group cancellation

```bash
python scripts/cancel_posix.py --policy config/policy.json --task-id build-123 --execute
```

### Gate parent completion

```bash
python scripts/process_guard.py --policy config/policy.json gate --task-id root-task
```

### Find stale leases

```bash
python scripts/process_guard.py --policy config/policy.json stale
```

## Workflow
1. Measure cancellation baseline on controlled workloads.
2. Register every background launch with durable ownership identity.
3. Refresh leases while work is authorized.
4. On stop/shutdown, use native runtime cancellation plus host-side verification.
5. Gracefully terminate verified-owned groups within a bounded window.
6. Escalate only when explicitly allowed and identity still matches.
7. Block completion until zero owned descendants remain.
8. Reconcile stale leases outside the agent process.
9. Compare before/after metrics and independently verify.

Detailed procedures are in `workflows/workflows.md` and `skills/core-skills.md`.

## Metrics
Track:
- cancellation p50/p95;
- live owned processes after cancel;
- orphan rate;
- stale lease count;
- identity mismatch count;
- force escalation rate;
- false-kill rate;
- CPU/RAM/API activity after cancellation;
- completion attempts blocked by live descendants.

Never claim a performance improvement without measured before/after evidence.

## Verification
See `verification/verification-report.md`.

Run Linux unit tests:

```bash
python -m unittest -v tests/test_process_guard.py
```

Verification must distinguish:
- **Implemented** — code/policy/hooks exist;
- **Measured** — target-environment metrics collected;
- **Verified** — controlled cancellation fixtures demonstrate zero owned survivors and zero unrelated kills.

## Safety
- Never kill by process name, substring, port, or PID alone.
- Unknown identity fails closed.
- Force kill is disabled by default.
- The POSIX adapter refuses its own process group and unsafe group IDs.
- Re-check identity immediately before every destructive signal.
- Do not persist secrets/full sensitive command arguments in registry or audit data.
- Prefer observe-only rollout before enforcement.

## Failure handling

### Identity mismatch
Do not signal. Mark/reconcile as ambiguous and obtain stronger host evidence.

### Graceful cancellation timeout
If force kill is disabled, return a blocking failure and escalate to an operator/supervisor. Do not silently mark success.

### Coordinator crash
The independent stale-lease scan discovers abandoned records after lease expiry.

### Memory/resource emergency
Cleanup should be owned by a lightweight external supervisor rather than relying solely on the stressed agent process.

### Repeated orphaning
Re-enter diagnosis. Do not compensate by broadening kill selectors.

## Definition of Done
- Current public evidence documented.
- Existing approaches and limitations documented.
- Every controlled background launch gets a durable ownership record.
- Baseline and post-change cancellation metrics are captured.
- Controlled cancellation tests produce zero owned survivors within policy deadline.
- False-kill rate is zero.
- Live/ambiguous child work blocks parent completion.
- Stale leases are independently discoverable after crash.
- Force escalation remains explicit and bounded.
- Independent verification is complete for the deployment environment.
- Residual risks are documented and no blocking lifecycle ambiguity remains.

## Customization
- Replace the Linux `/proc` identity adapter with Windows Job Objects, container/cgroup identity, Kubernetes Job/Pod UID, CI job identity, or cloud task handles.
- Replace JSON registry with SQLite/PostgreSQL/Redis when multiple hosts need transactional ownership state.
- Add OpenTelemetry spans/events for launch, heartbeat, cancel, escalation, and orphan detection.
- Tune lease/cancel deadlines by workload class rather than applying one timeout globally.
- Add remote-resource adapters for external jobs while preserving the same stable logical task identity and completion barrier.
