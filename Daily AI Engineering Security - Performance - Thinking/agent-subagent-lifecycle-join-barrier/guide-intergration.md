# Integration Guide

## Goal

Integrate the lifecycle join barrier into an agent harness so a parent cannot finish while required descendant work is unresolved or unverified.

## 1. Create the durable lifecycle store

At repository/workspace runtime level create:

```text
.agent-lifecycle/
├── ledger.json
├── handoffs/
└── verifications/
```

Do not keep the only copy of lifecycle state inside model conversation context. The ledger may live in a database instead; the JSON structure is the portable reference implementation.

Recommended task fields:

```json
{
  "task_id": "review-security",
  "parent_id": "root-task",
  "required": true,
  "owner": "security-reviewer",
  "expected_outputs": ["security findings with evidence"],
  "state": "planned",
  "attempts": [],
  "created_at": "2026-08-20T00:00:00+07:00"
}
```

## 2. Wire pre-dispatch validation

Before any runtime call such as `spawn_agent`, `Task`, background session creation, remote worker dispatch, or nested agent launch:

1. allocate the logical task ID;
2. persist parent linkage and expected outputs;
3. run:

```bash
python scripts/join_guard.py validate-ledger --ledger .agent-lifecycle/ledger.json
```

If non-zero, do not dispatch. This closes the gap where child execution exists but has no durable parent contract.

## 3. Separate logical task identity from provider attempt identity

A resume/retry can change provider/session IDs. Do not replace `task_id`. Append provider attempts:

```json
"attempts": [
  {
    "attempt": 1,
    "provider_task_id": "agent-abc",
    "started_at": "...",
    "ended_at": "...",
    "terminal_reason": "resource_exhausted"
  },
  {
    "attempt": 2,
    "provider_task_id": "agent-def",
    "started_at": "..."
  }
]
```

This makes retries traceable and prevents an old child from being mistaken for the active attempt.

## 4. Normalize provider runtime events

Map provider-specific states into:

- `planned`
- `dispatched`
- `running`
- `succeeded`
- `failed`
- `cancelled`
- `timed_out`
- `resource_exhausted`
- `orphaned`

Keep raw provider status in attempt metadata for debugging. Never map ambiguous failure to `succeeded`.

Update `last_heartbeat_at` only from real execution/status evidence; do not synthesize heartbeats merely because the parent is still polling.

## 5. Use event-driven updates first, deterministic polling second

Preferred order:

1. provider completion/event subscription;
2. deterministic task-status API;
3. process supervisor status;
4. bounded polling;
5. model-mediated status reasoning only when no structured path exists.

Run stale analysis:

```bash
python scripts/join_guard.py stale \
  --ledger .agent-lifecycle/ledger.json \
  --policy config/policy.json
```

Exit 3 means the harness must reconcile those tasks through an authoritative status source. It is not permission to wait forever.

## 6. Handoff format

For every terminal child write a handoff. For success, the handoff is mandatory.

Example:

```json
{
  "task_id": "review-security",
  "state": "succeeded",
  "terminal_reason": "completed",
  "partial": false,
  "artifacts": ["reports/security-review.md"],
  "evidence": ["tests/security-test.log"],
  "checks_run": ["security tests"],
  "unresolved_risks": []
}
```

For `resource_exhausted`/failure, preserve the same structure with `partial: true` if useful artifacts exist. Partial work helps recovery but must not satisfy a required success join.

## 7. Independent verification format

After a required successful handoff, run deterministic checks and an independent verifier where semantic assessment is needed. Store:

```json
{
  "task_id": "review-security",
  "verdict": "pass",
  "verifier_id": "independent-verifier",
  "checks": [
    "artifact exists",
    "expected findings schema valid",
    "required scope covered"
  ],
  "evidence": ["reports/security-review.md"]
}
```

Reference it from the task as `verification`. Do not set `verifier_id` equal to the implementing owner when independence is required.

## 8. Install the pre-completion join barrier

Immediately before parent success, publishing, merge, or headless process exit:

```bash
python scripts/join_guard.py check \
  --ledger .agent-lifecycle/ledger.json \
  --parent-id root-task \
  --policy config/policy.json
```

Interpret exit codes:

- `0`: join PASS;
- `2`: lifecycle structure/input invalid;
- `3`: stale check requires reconciliation (for `stale` command);
- `4`: parent completion BLOCKED.

In CI, propagate non-zero as job failure. Never wrap the command with `|| true`.

## 9. Headless orchestration pattern

Pseudo-flow:

```text
persist child contracts
validate ledger
spawn required agents
record provider IDs
while required work active and within global deadline:
    process runtime events
    run deterministic stale checks
    reconcile only stale/ambiguous statuses
collect terminal handoffs
independently verify successes
run join barrier
if PASS:
    run parent-level product verification
    exit 0
else:
    preserve partial results and blocker report
    exit non-zero
```

The waiting loop belongs in deterministic orchestration code rather than repeated LLM turns.

## 10. Nested subagents

The checker computes descendant closure. If child A spawns grandchild B, B is covered when checking the root parent as long as B has `parent_id: A`.

A nested runtime that cannot expose parent linkage should be wrapped by the harness: the logical parent is recorded before provider dispatch, even if the provider UI does not expose that relationship.

## 11. Resource exhaustion

When a provider reports usage/spend/resource limit:

1. terminalize the attempt as `resource_exhausted`;
2. save partial handoff;
3. inventory missing expected outputs;
4. decide whether a safe continuation fits remaining budget;
5. create a new attempt under the same logical task;
6. verify the combined final output against the original contract.

Do not relabel partial output as success just because it is useful.

## 12. Status ambiguity and notification loss

A completion notification is a delivery mechanism, not source-of-truth state. If a notification is missing but authoritative provider status says success, collect/verify the artifact and record the terminal state. If provider state cannot be resolved by the global deadline, fail closed as timeout/orphan/unknown according to local policy.

## 13. Cleanup

On parent termination:

- required descendants must already satisfy the join or be explicitly blocking the parent;
- optional unnecessary descendants should be cancelled/reaped safely;
- background processes must not be abandoned merely because the parent UI/session exits;
- preserve the final ledger for incident analysis.

## 14. CI test

Run:

```bash
python -m unittest discover -s tests -p 'test_*.py' -v
```

Required regression cases include running required child, failed child, resource exhaustion, missing verification, self-verification, nested grandchild, invalid parent linkage, and fully verified success.

## 15. Customization

Adjust `config/policy.json` for workload duration and organization policy. For long jobs, increase stale/global timeout deliberately while keeping them finite. Add project-specific handoff validators rather than weakening the barrier. Integrate database-backed ledgers by producing the same logical task/verification view consumed by the checker.
