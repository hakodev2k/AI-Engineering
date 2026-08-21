# Integration Guide

## Placement
Integrate the guard around the host's file-read tool, not inside the model prompt. The host remains responsible for deciding when exact text is required.

## Lifecycle wiring
1. **Before Read:** run `check` with canonical path and requested range.
2. **Cache hit:** return the compact JSON receipt to the agent instead of duplicate file content, unless exact text is required and context residency is unknown.
3. **Cache miss:** execute the host's normal read, then run `record` with the exact returned range and bytes.
4. **After file mutation:** run `invalidate` for each affected path. For broad operations such as checkout/merge where affected paths are uncertain, clear or namespace the ledger generation rather than guessing.
5. **After compaction:** run `compact`. Do not delete fingerprints; downgrade residency.
6. **At task end:** collect `stats` and persist metrics, not source content.

## Host decision contract
The host should provide two independent facts:
- **Need identity only:** the agent only needs to know whether the file/range changed. A valid unchanged receipt is sufficient.
- **Need exact text:** the next reasoning/edit/verification step requires literal source content. Use `--require-context`; after compaction this causes rehydration.

## Example flow
```text
Read request: src/service.cs lines 1-200
  -> guard check: MISS
  -> host reads content
  -> guard record
Later identical read
  -> guard check: UNCHANGED_READ
  -> host returns compact receipt
Compaction occurs
  -> guard compact
Later agent asks whether service.cs changed
  -> check: UNCHANGED_READ, residency=unknown is acceptable
Later agent must edit exact line 74
  -> check --require-context: MISS_REHYDRATE
  -> host rereads required range and records it
```

## Ledger location
Use a task/worktree-scoped state directory outside source control, e.g. `.agent-read-cache/ledger.json`, and add it to local ignore configuration if needed. Do not commit runtime ledgers.

## Multi-agent integration
Share a ledger only when subagents operate in the same trusted worktree and task generation. Include agent/task metadata in host metrics. If agents work in separate worktrees, keep separate ledgers.

## Large files
The default script hashes up to `max_hash_bytes` and mixes total file size into the digest. For very large/high-churn files, adapt the host to use range hashes or a reliable repository object ID plus working-tree dirty checks. Do not weaken identity guarantees for speed without measuring the collision/staleness risk.

## Security
The ledger contains paths, fingerprints, ranges and metrics but no file bodies. Treat paths as potentially sensitive operational metadata. Keep ledger permissions scoped to the task user. Do not include secrets in metrics.

## Failure handling
- Ledger missing: normal read, then create/record state.
- Ledger corrupt: normal read; quarantine/reset ledger.
- Hash error: normal read; mark guard degraded.
- Uncertain mutation scope: invalidate broadly or rotate ledger generation.
- Any stale substitution discovered: immediately disable suppression, retain evidence, reproduce with fixture, and fix before re-enabling.

## Rollout
Start in observe-only mode: execute checks but always perform reads and compare decisions. After zero false hits on representative workloads, enable suppression for identical full/range reads. Expand to shared subagent reuse only after cross-agent isolation tests pass.
