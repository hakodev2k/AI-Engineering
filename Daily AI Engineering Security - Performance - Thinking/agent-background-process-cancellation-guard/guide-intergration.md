# Integration Guide

## Goal
Integrate durable background-process ownership and cancellation verification into an AI-agent runtime without coupling the package to one provider.

## 1. Choose the host authority
The guard must run in the host/orchestrator layer that actually launches subprocesses. Prompt instructions are not sufficient. Map every provider action that can create durable work:

- background shell/process execution;
- subagent launchers;
- MCP server lifecycle;
- build/test watchers;
- long-running local API scripts;
- container/job execution.

## 2. Create the runtime directory

```bash
mkdir -p .agent-process-guard
printf '{"version":1,"tasks":{}}\n' > .agent-process-guard/registry.json
```

Keep this directory outside source control if task metadata is sensitive.

## 3. Launch background commands in isolation
On POSIX, create a new session/process group (`setsid`, `start_new_session=True`, or equivalent). On Windows, use a Job Object adapter; do not emulate ownership with process-name matching.

Recommended launcher sequence:

1. allocate logical task ID and launch nonce;
2. create isolated process group/session;
3. obtain PID, process-group ID and process-start identity;
4. register immediately with `process_guard.py`;
5. if registration fails, terminate the just-created controlled child or fall back to foreground execution;
6. start heartbeat only after registration succeeds.

Example POSIX Python launcher fragment:

```python
proc = subprocess.Popen(command, start_new_session=True)
pgid = os.getpgid(proc.pid)
# Host then invokes process_guard.py register with task id, pid, pgid and nonce.
```

## 4. Register ownership

```bash
python scripts/process_guard.py --policy config/policy.json register \
  --task-id build-123 \
  --parent-id root-task \
  --pid "$PID" \
  --pgid "$PGID" \
  --nonce "$LAUNCH_NONCE"
```

On Linux the script reads `/proc/<pid>/stat` start identity automatically. Other OS adapters must provide an equally strong start identity.

## 5. Heartbeat

```bash
python scripts/process_guard.py --policy config/policy.json heartbeat --task-id build-123
```

Run at a cadence shorter than `lease_seconds`. A failed heartbeat is health evidence; do not rewrite the registry to hide it.

## 6. Cancellation integration
When user/runtime cancellation occurs:

1. invoke provider-native cancellation first where appropriate;
2. inspect the registered process identity;
3. on POSIX, run the adapter in dry-run mode and inspect its decision;
4. only then execute termination if policy and environment permit it;
5. verify zero live descendants with the completion gate.

Dry run:

```bash
python scripts/cancel_posix.py \
  --policy config/policy.json \
  --task-id build-123
```

Execute graceful cancellation:

```bash
python scripts/cancel_posix.py \
  --policy config/policy.json \
  --task-id build-123 \
  --execute
```

Force escalation additionally requires both `allow_force_kill=true` in policy and `--allow-force` on the command line.

## 7. Completion barrier
Never equate an agent's final message with host resource completion.

```bash
python scripts/process_guard.py --policy config/policy.json gate --task-id root-task
```

Exit `0` permits completion. Exit `3` means a live or ambiguous owned descendant blocks success.

## 8. Stale-lease reaper
A supervisor outside the agent process should periodically inspect:

```bash
python scripts/process_guard.py --policy config/policy.json stale
```

The reaper should reconcile records, not blindly kill them. A stale record with identity mismatch is not owned evidence.

## 9. Observe-only rollout
Keep `observe_only=true` initially. Measure:

- live processes after user cancel;
- cancellation p50/p95;
- stale leases;
- force-escalation candidates;
- post-cancel CPU/RAM/API activity;
- identity mismatch count.

Only move to enforced termination after controlled tests demonstrate zero false ownership matches.

## 10. Windows integration
The included destructive reference adapter is POSIX/Linux-specific. For Windows production use a Job Object:

- create one Job Object per logical background unit or ownership subtree;
- assign the child process immediately after creation;
- configure kill-on-job-close when appropriate;
- persist task ↔ job/process identity in the same logical registry;
- implement the same bounded cancel/verify state machine.

Do not substitute `taskkill /IM` or fuzzy process names.

## Failure handling
- Registry unavailable: reject untracked background mode or fall back to foreground.
- Identity unavailable/mismatch: inspect only; no destructive action.
- Graceful termination timeout: stop if force policy is disabled; mark blocking state.
- Parent crash: stale lease is reconciled by external supervisor.
- Memory pressure: supervisor should remain lightweight and outside the resource-heavy agent tree.
- Repeated orphaning: return to diagnosis; do not simply increase kill aggressiveness.

## Production verification checklist
- [ ] Controlled child is registered with start identity.
- [ ] Parent cancellation reaches provider/runtime cancellation path.
- [ ] Host cancellation independently verifies process identity.
- [ ] Graceful cancellation is bounded.
- [ ] Force escalation is disabled by default.
- [ ] Unrelated sibling process survives all fixture tests.
- [ ] Parent completion is blocked by a live required child.
- [ ] Parent crash leaves a stale lease discoverable by supervisor.
- [ ] Audit/metrics contain no secrets.
