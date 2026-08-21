# Integration Guide

## Objective
Insert lifecycle reconciliation between raw child-agent state and every parent orchestration decision. The integration must preserve source identity and must not silently collapse contradictory evidence into a single status.

## 1. Add the package
Copy the package directory into your repository or agent-runtime configuration. No external Python dependencies are required.

Requirements:
- Python 3.10+
- access to the runtime's read-only child lifecycle/event/status data
- a writable temporary/report directory outside protected source paths if reports are persisted

## 2. Map runtime evidence
Build one object per child:

```json
{
  "child_id": "child-123",
  "execution_id": "attempt-2",
  "previous_execution_id": "attempt-1",
  "previous_reconciled_state": "completed",
  "observed_at": "2026-08-21T03:10:00Z",
  "evidence": {
    "terminal_event": null,
    "task_complete_event": null,
    "authoritative_registry": "running",
    "closed_spawn_edge": null,
    "delivered_result": null,
    "persisted_status": "running",
    "watched_status": "running",
    "ui_status": "working"
  }
}
```

Do not substitute one evidence source for another. If a source is unavailable, omit it or set it to `null`.

## 3. Define authoritative sources
Adapt `config/lifecycle-policy.json` to your host. Keep terminal events and the authoritative collaboration/runtime registry above cache/UI presentation fields.

If your runtime has a stronger event than those listed, add it explicitly and update the script mapping/tests rather than overloading an existing field name.

## 4. Run the pre-orchestration gate
Before any lifecycle-dependent operation:

```bash
python scripts/reconcile_lifecycle.py \
  --input .agent/lifecycle-input.json \
  --policy config/lifecycle-policy.json \
  --output .agent/lifecycle-report.json
```

Exit code semantics:
- `0`: no blocking conflict;
- `2`: lifecycle conflict blocks the decision;
- `3`: invalid input/policy;
- `4`: I/O failure.

Treat non-zero as fail-closed for retry/wait/replacement/finalization decisions.

## 5. Integrate with parent orchestration
Recommended decision mapping:

| Reconciler decision | Parent action |
|---|---|
| `consume_result_or_finalize_child` | Validate result and close dependency |
| `bounded_wait` | Wait using bounded backoff/event notification |
| `reconcile_before_orchestration` | Refresh authoritative evidence once, rerun guard |
| `query_authoritative_registry` | Query registry/event source, rerun guard |
| `review_unknown_state` | Escalate unknown lifecycle state |

Do not let the model override a blocking conflict with natural-language confidence.

## 6. Add resume/rehydration protection
On app/session restart:
1. load last trusted reconciliation snapshot;
2. collect fresh persisted/registry/presentation state;
3. reconcile before marking historical children active;
4. reject terminal→active for the same execution ID.

This prevents stale cache/UI state from resurrecting completed children.

## 7. Add bounded wait behavior
Use policy values for maximum attempts and wait bounds. Prefer runtime completion events or callbacks. If polling is the only option, increase wait intervals rather than issuing frequent model turns.

A wait timeout is not proof of child failure. After the wait budget expires, collect one fresh authoritative snapshot and reconcile.

## 8. Run tests

```bash
python -m unittest tests/test_reconcile_lifecycle.py -v
```

Integration tests should additionally cover:
- completed child + stale running UI;
- terminal child rehydrated as running after restart;
- legitimate retry with a new execution ID;
- result delivered before presentation refresh;
- registry unavailable;
- genuine long-running child within and beyond stale budget;
- parent completion with required failed/unknown child.

## 9. Observability
Record only lifecycle metadata needed for diagnosis:
- child/execution ID;
- selected evidence source/state;
- conflicting source/state names;
- timestamps/stale age;
- wait/status-query counts;
- final decision.

Do not include child prompt/content unless separately required. This guard is about lifecycle integrity, not content capture.

## 10. Rollout strategy
1. **Observe-only**: run reconciliation and compare to current host decision without blocking.
2. **Warn**: alert on mismatch/resurrection/staleness.
3. **Enforce**: block lifecycle-dependent actions on conflict.
4. **Optimize**: replace short polling with event-driven waits/bounded backoff and measure model/tool-call reduction.

Do not skip the observe phase if your runtime's authoritative source semantics are unclear.

## Verification criteria
Integration is verified when:
- all package tests pass;
- representative stale-state fixtures are blocked/reconciled correctly;
- legitimate retries remain possible with new execution IDs;
- parent success is blocked only by genuinely unresolved required children;
- no infinite wait/status loop exists;
- before/after status-turn counts and stale-active incidents are measured.
