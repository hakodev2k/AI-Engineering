# Hook: Owner Terminal Reconciliation

## Trigger
Immediately after a task/thread/turn owner reaches a terminal state, and before a new runtime spawn when the hard budget is near.

## Preconditions
The ownership registry is readable and process snapshots include PID plus process start time.

## Action
1. Export a current ownership/process snapshot to JSON.
2. Run the deterministic audit.
3. If the owner is terminal, identify only matching owned non-shared survivors.
4. Request graceful cleanup through the host lifecycle manager.
5. After the grace period, rerun audit.
6. Block completion if survivors remain or ownership is uncertain.

## Command
```bash
python3 scripts/runtime_reaper.py audit --registry runtime-registry.json --processes process-snapshot.json --owner "$OWNER_ID" --require-terminal-clean
```

To generate an explicit cleanup plan without killing anything:

```bash
python3 scripts/runtime_reaper.py plan --registry runtime-registry.json --processes process-snapshot.json --owner "$OWNER_ID"
```

## Expected result
Exit 0 and a report with `blocked=false`, zero terminal-owner non-shared survivors, and zero PID identity mismatches.

## Failure behavior
- Exit 2: invalid input/configuration; block completion.
- Exit 3: lifecycle invariant violation; block completion and enter `workflows/runtime-reconcile-and-benchmark.md`.
- Never fall back to killing by name or parent PID.

## Blocking
Yes. A terminal owner with verified surviving owned resources blocks successful completion until reconciled or explicitly escalated.