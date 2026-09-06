# Workflow: Safe Dead-Letter Queue Replay

## Trigger
A finite set of dead-lettered messages is proposed for recovery after an incident, defect fix, dependency recovery, or schema/routing correction.

## Entry conditions
- Repository and handler path are accessible.
- Candidate queue/environment is known.
- Message metadata can be inspected read-only.
- No replay execution has started under this workflow.

## Inputs
Candidate message IDs, queue/environment, incident evidence, repository state, `config/replay-policy.json`.

## Context strategy
Start with message metadata, the consumer entry point, dead-letter/retry configuration, nearby tests, and directly relevant logs. Expand to schema/routing/dependencies only when evidence requires it. Keep facts, hypotheses, decisions, approvals, and open questions separate.

## Flow

```text
Trigger
  ↓
Replay Explorer
  ↓
Cause + side-effect + tenant + compatibility evidence
  ↓
Replay Planner
  ↓
Deterministic replay guard
  ↓
blocked? ── yes ─→ fix evidence / stop
  │
  no
  ↓
production? ── yes ─→ human approval bound to plan fingerprint
  │                         ↓
  └─────────────────────────┘
  ↓
Dry-run/test when available
  ↓
Host-specific bounded replay
  ↓
Receipts
  ↓
Independent Replay Verifier
  ↓
verified | blocked | failed
```

## Stages and ownership

### 1. Investigate — Replay Explorer
- Freeze the explicit candidate message-ID set.
- Collect broker metadata and original failure evidence.
- Trace current handler side effects and idempotency boundaries.
- Verify tenant, schema, and routing semantics.
- Determine whether failure preconditions have changed.

**Checkpoint:** unknown cause, tenant scope, or material side effects blocks planning.

### 2. Plan — Replay Planner
- Create a plan conforming to `schemas/replay-plan.schema.json`.
- Split unrelated failure causes into separate plans.
- Set batch and retry limits no larger than policy.
- Define a measurable expected outcome.

**Produced artifact:** replay-plan JSON.

### 3. Guard — deterministic script
Run:

```bash
python scripts/replay_guard.py --plan <plan.json> --policy config/replay-policy.json --out .dlq-replay/guard.json
```

**Checkpoint:** only guard status `pass` proceeds.

### 4. Approval — human owner
Production execution requires explicit approval after the substantive plan fingerprint is known. Any edit to environment, queue, IDs, tenant scope, evidence, batch size, retry limit, compatibility state, or expected outcome changes the fingerprint and invalidates prior approval.

### 5. Execute — host-specific replay operator
This package intentionally delegates broker writes to an adapter/tool owned by the host repository. The adapter MUST:
- accept explicit message IDs rather than wildcard scope;
- enforce the plan batch size;
- preserve message identity/correlation when broker semantics allow;
- emit one receipt per attempt with `message_id`, `status`, `attempt`, and `timestamp`;
- stop the batch on unexpected non-transient failures.

### 6. Verify receipts — deterministic script

```bash
python scripts/validate_receipts.py --plan <plan.json> --receipts <receipts.json> --out .dlq-replay/receipt-verification.json
```

### 7. Verify business outcome — Replay Verifier
Confirm downstream state, duplicate absence within available evidence, and that replayed messages have not returned to the DLQ during the chosen observation window.

## Retry rules

- Read-only broker/log transient failures: maximum 2 retries; preserve error evidence.
- Replay transport failure explicitly classified transient: may retry only the affected message and only up to `execution_retry_limit`.
- Schema, business-rule, tenant, routing, auth, or idempotency failures: no automatic retry.
- A replayed message that dead-letters again stops subsequent batches.
- No loop may exceed the smaller of plan and policy limits.

## Approval points
Explicit approval is required before production replay, scope expansion, replay of uncertain/non-idempotent side effects, destructive message operations, broker configuration/retention changes, secret changes, production configuration/infrastructure changes, security weakening, or retry-limit increase.

## Failure paths

- **Validation failure:** block before execution; preserve guard output.
- **Build/test failure in underlying fix:** block; replay is not a substitute for a passing fix.
- **Tool/transient failure:** bounded retry with logs.
- **Permission failure:** stop; do not request broader permissions automatically.
- **Business-rule/schema/routing failure:** stop; return to investigation with new evidence.
- **Receipt mismatch:** stop; treat any unplanned message ID as a critical execution-scope failure.
- **Duplicate/unexpected side effect:** stop remaining batches and escalate.

## Produced artifacts
- Replay investigation evidence (host-defined Markdown/JSON).
- Replay plan JSON.
- `.dlq-replay/guard.json`.
- Host-specific replay receipts JSON.
- `.dlq-replay/receipt-verification.json`.
- Independent verifier result.

## Stop conditions
Stop when any blocker remains, approval is absent/expired/mismatched, plan scope becomes ambiguous, retry limit is exhausted, a replayed message re-dead-letters, or verification detects unexpected side effects.

## Definition of Done
The plan is bounded and guard-passing; required approval matches the plan fingerprint; execution receipts contain only planned IDs and remain within attempt limits; expected business outcomes are verified; no selected message re-dead-letters during observation; independent verifier reports `verified`; and no blocking risk remains.
