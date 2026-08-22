# Integration Guide

## Goal
Integrate the continuity contract into any agent harness that performs compaction, summarization, session resume, model switching, or long-running handoff.

## 1. Choose the authoritative storage
Store `state/continuity.json` outside the compactable conversation transcript. Suitable locations include a workspace state directory, durable agent store, database row, or checkpoint object. The store must preserve generations and protect against concurrent overwrite.

Do not place secrets or hidden reasoning in the capsule. Store only observable task state and stable evidence/artifact references.

## 2. Create the first capsule
Copy the shape from `examples/continuity-capsule.json`, replace sample values with real state, then stamp it:

```bash
mkdir -p state
cp examples/continuity-capsule.json state/continuity.json
python scripts/continuity_guard.py stamp --capsule state/continuity.json
python scripts/continuity_guard.py validate --capsule state/continuity.json --policy config/continuity-policy.json
```

A production harness should build the object directly rather than copying the example.

## 3. Capture checkpoints proactively
Invoke the capture workflow at these events:
- before compaction when exposed by the runtime;
- after a major accepted decision;
- after a verified milestone;
- before a handoff/model switch;
- before the context reaches the configured risk threshold.

Increment `generation` once for each committed checkpoint. Write the updated capsule atomically and then stamp/validate it.

## 4. Separate active turn from historical text
The harness should assign a stable ID to each user/system task event. `active_turn.id` must identify the currently authoritative instruction. Never derive “current instruction” merely by selecting the latest visible historical user message after compaction.

Example:

```json
"active_turn": { "id": "turn-2026-08-20T02:59:41+07:00-001" }
```

## 5. Create recovered state after compaction
After compaction/resume, do not immediately give the agent write/execute permissions. First have it reconstruct a `state/recovered.json` object using the same schema and stamp it:

```bash
python scripts/continuity_guard.py stamp --capsule state/recovered.json
```

Then compare:

```bash
python scripts/continuity_guard.py compare \
  --before state/continuity.json \
  --after state/recovered.json \
  --policy config/continuity-policy.json
```

Exit code 0 means critical continuity is preserved. Exit code 1 means mutation must remain blocked.

## 6. Bounded rehydration
On mismatch:
1. load the authoritative capsule explicitly into the resumed context;
2. reconstruct `state/recovered.json` again;
3. restamp and compare;
4. stop after `max_rehydrate_attempts` from policy.

Do not silently relax the critical-field list to make recovery pass.

## 7. Mutation gate
Before the first mutating tool call after recovery, generate a receipt:

```bash
python scripts/continuity_guard.py receipt \
  --before state/continuity.json \
  --after state/recovered.json \
  --policy config/continuity-policy.json \
  --max-age-seconds 300
```

The orchestrator should require:
- receipt status `valid`;
- matching `task_id` and `active_turn_id`;
- receipt age within local policy;
- no capsule generation change since receipt creation.

If the authoritative capsule changes after the receipt is issued, compare again.

## 8. Tool-wrapper integration
Wrap mutating capabilities such as file write, patch, shell execution, Git write, deployment, issue/PR updates, email send, database mutation, and MCP actions with the continuity gate.

Pseudo-flow:

```text
request mutation
  -> continuity status known?
  -> latest capsule validated?
  -> recovered state compared?
  -> active turn matches?
  -> repeated-work guard passes?
  -> allow tool
otherwise -> block
```

Read-only inspection can normally continue while recovering, provided it cannot indirectly mutate state.

## 9. Recording completed and failed work
Completed items should carry stable artifact or evidence references. Failed approaches must preserve the reason they failed. This prevents a compacted agent from repeating expensive investigation just because negative evidence disappeared from its prose summary.

Use stable IDs:

```json
{
  "id": "failed-db-lock-01",
  "approach": "Increase transaction retry count",
  "reason": "Deadlock root cause is lock-order inversion, not transient timeout",
  "evidence_refs": ["trace-deadlock-20260820"]
}
```

## 10. Tests
Run:

```bash
python -m unittest tests/test_continuity_guard.py -v
```

The fixture suite covers goal loss, stale active turn, dropped failed approaches, dropped completed work, checksum tampering, and evidence-policy violations.

## 11. Metrics
Capture at minimum:
- capsule bytes;
- checkpoint age;
- critical mismatch count;
- recovery attempt count;
- stale-turn detections;
- repeated-work blocks;
- compaction events;
- execution blocked due to unknown/invalid continuity.

A useful production target is zero critical-field false passes, not merely a high average recovery score.

## 12. High-risk operations
For production deployment, destructive data changes, credential/permission changes, or irreversible external actions, combine this package with independent human approval and tool-specific security controls. A valid continuity capsule proves task continuity; it does not by itself prove the action is safe or authorized.
