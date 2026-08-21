# Verification Report

## Status model

### Implemented
- Durable logical task registry.
- PID + process-start identity validation on Linux `/proc`.
- Parent/child ownership graph.
- Heartbeat/lease freshness tracking.
- Stale-record inspection.
- Completion gate that blocks while live/ambiguous descendants exist.
- POSIX process-group cancellation adapter with dry-run default.
- Identity re-check immediately before destructive signals.
- Force escalation disabled unless both policy and CLI explicitly enable it.
- Fault-injection unit tests for live blocking, exited processes, stale leases, identity mismatch, and child ownership.

### Measured
This reusable package does not claim production improvement before integration. Required deployment metrics are defined as:
- cancellation p50/p95;
- owned survivors after cancel;
- orphan rate;
- identity mismatch count;
- stale lease count;
- force escalation rate;
- CPU/RAM/API activity after cancel;
- false-kill rate.

### Verified
Static package verification confirms that destructive decisions are deterministic and fail closed on unknown identity. Runtime verification must be executed on the target host because process-group behavior, Windows Job Objects, containers, and provider-native cancellation are environment-specific.

## Test command
From package root on Linux:

```bash
python -m unittest -v tests/test_process_guard.py
```

Expected contract:
- live owned process blocks completion;
- registered process that exits no longer blocks completion;
- stale heartbeat is detected;
- changed process-start identity fails closed;
- live child blocks parent even after parent process exits.

## POSIX adapter verification
1. Launch a controlled sleeper with `start_new_session=True`.
2. Register PID + PGID.
3. Run `cancel_posix.py` without `--execute`; confirm dry-run only.
4. Run with `--execute`; verify group reaches zero.
5. Launch an unrelated sibling process in another group; verify it survives.
6. Corrupt the registered start identity; verify adapter refuses to signal.
7. Keep force kill disabled and simulate SIGTERM-resistant controlled process; verify adapter returns blocking failure rather than escalating.

## Required production fault-injection suite
- parent agent crash;
- user cancellation;
- session shutdown;
- child ignores graceful termination;
- coordinator memory pressure;
- stale lease after crash;
- PID reuse/identity mismatch simulation;
- nested parent/child background ownership;
- unrelated process with similar command name;
- provider task status says stopped while OS child remains live.

## Definition of Done
- Research evidence and existing limitations documented.
- Background launcher creates durable ownership record for every controlled task.
- Observe-only baseline captured.
- Zero controlled owned survivors after bounded cancellation in supported host adapter tests.
- False-kill rate remains zero.
- Completion gate blocks on live/ambiguous required descendants.
- Stale leases are independently discoverable.
- Force escalation remains opt-in and identity-checked.
- Before/after metrics collected in deployment environment.
- Independent verifier signs off on fixtures and residual risks.
- No blocking ownership ambiguity remains for enforce-mode rollout.

## Residual risks
- `/proc` reference implementation is Linux-specific.
- PID + start-time identity is stronger than PID alone but OS-native handles/job objects are preferable where available.
- Distributed/remote subprocesses require provider-specific ownership adapters.
- Abrupt host loss requires container/cloud job TTLs in addition to local reaping.
- A compromised privileged host supervisor is outside this package's threat boundary.
