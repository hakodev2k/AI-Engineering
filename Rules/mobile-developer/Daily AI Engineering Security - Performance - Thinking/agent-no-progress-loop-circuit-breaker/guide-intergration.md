# Integration Guide

## 1. Choose the enforcement boundary
Place the guard outside the model loop, ideally in the host/orchestrator that already sees tool requests, tool results, compaction/resume events, and auto-continuation scheduling. The model may receive the resulting WARN/STOP summary, but it must not control whether counters reset.

## 2. Emit a minimal event stream
Append JSONL events in execution order:

```json
{"type":"action","tool":"Read","args":{"file":"src/a.cs","offset":0}}
{"type":"result","output":"..."}
{"type":"progress","marker":"new_evidence:file-a-first-read"}
{"type":"turn"}
```

Prefer hashes/compact summaries for large results. Do not store secrets merely for loop detection.

## 3. Define durable progress
Map host-observable changes to the configured progress event types. Recommended examples:
- `file_changed`: Git/worktree diff changed materially;
- `test_outcome_changed`: failing/pass set or diagnostic changed;
- `new_evidence`: new file/region/source/result materially affects the task;
- `task_state_changed`: queued → running → completed/failed, or external job percentage/phase changes;
- `hypothesis_eliminated`: a hypothesis is explicitly closed by evidence;
- `blocker_declared`: execution transitions to a known wait/escalation state;
- `human_decision`: an approval/decision changes what may happen next.

Do not emit progress for commentary alone.

## 4. Run in WARN mode first
Use representative successful traces and known looping traces. Execute:

```bash
python scripts/trajectory_guard.py trace.jsonl --config config/policy.json --json
```

Exit codes are 0 healthy, 2 warn, 3 stop, 4 invalid input/config.

During calibration, treat exit 3 as telemetry rather than enforcement until productive loops are represented correctly.

## 5. Wire enforcement
Recommended host behavior:
- after each tool result: append event and evaluate;
- before auto-continue: evaluate again;
- on WARN: attach concise machine-readable diagnosis to the task and preserve counters;
- on STOP: do not schedule another automatic model turn from the same trajectory;
- invoke Recovery Planner or terminate as blocked;
- clear STOP only after a changed recovery key and durable progress marker.

## 6. Preserve state across compaction/resume
Keep detector state outside the model context: last progress marker, recent fingerprints, no-progress count, recovery count, status. Rehydrate it after compaction, reconnect, desktop/CLI handoff, or subagent transition.

## 7. Handle polling safely
Repeated polling is legitimate only when bounded. If result/state changes, emit `task_state_changed`. If results do not change, `max_unchanged_polls` must eventually force WARN/STOP or transition to an asynchronous wait mechanism.

## 8. Tests
Run:

```bash
python tests/test_trajectory_guard.py
```

The suite checks a productive exploration trace, a repeated-read loop, and a changing poll trace.

## 9. Production rollout
Track:
- percentage of tasks entering WARN/STOP;
- median actions after last progress before STOP;
- tokens after loop onset when available;
- false stops on successful tasks;
- recovery success and relapse rates.

Never claim improvement until before/after traces show reduced wasted actions/tokens with acceptable false-stop rate.
