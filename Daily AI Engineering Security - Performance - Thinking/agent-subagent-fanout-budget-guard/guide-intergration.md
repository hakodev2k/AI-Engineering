# Integration Guide

## Integration boundary
Place the guard immediately before every agent/subagent creation API. The LLM may request a spawn, but only the host runtime may authorize it. Do not put enforcement inside the child prompt alone.

## 1. Create the root ledger
At task admission, load `config/budget-policy.json` and initialize a root ledger:

```bash
python scripts/budget_guard.py init \
  --policy config/budget-policy.json \
  --root task-123 \
  --ledger .runtime/task-123-budget.json
```

Persist this ledger in a transactional store in production. The bundled JSON implementation is suitable for local integration/tests and demonstrates invariants, but distributed workers require database/Redis transaction or compare-and-swap semantics.

## 2. Validate the planned tree
Produce a small JSON plan, for example:

```json
{
  "descendants": 4,
  "max_depth": 1,
  "concurrency": 4,
  "estimated_tokens": 60000,
  "tool_calls": 80
}
```

Validate it before delegation:

```bash
python scripts/budget_guard.py plan-check --policy config/budget-policy.json --plan plan.json
```

A failed plan must be reduced or executed without delegation. Do not raise hard limits automatically.

## 3. Wrap every spawn API
Before `spawn_agent`, `Agent`, `Task`, worker creation, or equivalent call, reserve capacity:

```bash
python scripts/budget_guard.py reserve \
  --policy config/budget-policy.json \
  --ledger .runtime/task-123-budget.json \
  --root task-123 \
  --parent root \
  --request-id task-123:research:1 \
  --child research-1 \
  --tokens 12000 \
  --tool-calls 20
```

Only call the real spawn API when exit code is 0. Save the returned reservation ID with the child runtime record.

### Nested delegation
Nested delegation must use the same root ledger. Pass `--can-delegate` only when the child genuinely needs to spawn descendants. The guard derives depth from the registered parent and denies children beyond `max_depth`.

## 4. Reconcile actual usage
At completion/failure/cancel/timeout, report actual usage:

```bash
python scripts/budget_guard.py reconcile \
  --ledger .runtime/task-123-budget.json \
  --reservation-id <reservation-id> \
  --tokens-used 9400 \
  --tool-calls-used 17 \
  --status completed
```

Production adapters should update actual usage periodically for long-lived children instead of waiting only for termination. Unknown usage must retain its reservation.

## 5. Monitor thresholds
After spawn/reconcile and on a periodic control-plane tick:

```bash
python scripts/budget_guard.py check \
  --policy config/budget-policy.json \
  --ledger .runtime/task-123-budget.json
```

Exit codes:
- `0`: healthy
- `3`: soft threshold reached; avoid optional delegation and prepare synthesis
- `4`: hard violation; freeze new spawns and run containment
- `5`: I/O/config problem; fail closed

## 6. Trace analysis
Export orchestration events as NDJSON:

```json
{"type":"spawn","parent":"root","child":"a1","tokens":0}
{"type":"spawn","parent":"a1","child":"a2","tokens":0}
{"type":"complete","child":"a2","tokens":5200}
```

Analyze planned-versus-actual behavior:

```bash
python scripts/analyze_fanout_trace.py trace.ndjson \
  --planned-descendants 4 \
  --planned-depth 1 \
  --planned-tokens 60000
```

Exit `3` indicates at least one plan-level violation.

## 7. Incident containment adapter
When actual fan-out diverges from the plan or a hard threshold fires:
1. Set the root to frozen in the runtime/control plane.
2. Deny all new spawn admissions.
3. Snapshot active descendants and their reservation IDs.
4. Persist completed/partial outputs.
5. Cancel newest/redundant descendants first.
6. Wait a bounded grace period.
7. Mark non-terminating children as orphan incidents.
8. Continue synthesis only if available evidence still satisfies correctness requirements.

Raising limits requires explicit human approval.

## 8. Distributed-runtime requirements
The bundled file ledger cannot provide cross-process atomicity. For production multi-worker systems implement the same contract using one of:
- SQL transaction with row lock/version column;
- Redis Lua script or WATCH/MULTI transaction;
- strongly consistent key-value compare-and-swap.

The transaction must perform read → check all root/parent limits → reserve → commit as a single atomic unit.

## 9. Telemetry schema
At minimum emit:
- root_task_id
- parent_agent_id
- child_agent_id
- request_id
- reservation_id
- depth
- planned_tokens / actual_tokens
- planned_tool_calls / actual_tool_calls
- spawn timestamp / terminal timestamp
- terminal status
- denial reason
- partial-result reference

Do not log prompts, secrets, or raw tool output merely to support budget accounting.

## 10. Rollout
1. **Observe:** calculate planned/actual fan-out without denial.
2. **Warn:** enable soft-threshold alerts and trace analyzer.
3. **Enforce leaf delegation:** require reservation for direct children.
4. **Enforce recursively:** remove unrestricted spawn capability from children.
5. **Fault test:** run recursive, retry, concurrency, quota, and cancellation fixtures.
6. **Release:** block deployments that bypass the spawn boundary.

## Safety
The package limits resource/cost amplification; it does not replace sandboxing, permission controls, content safety, or tool authorization. Cancellation must not perform destructive rollback unless separately approved and designed.