# Workflow: Cost-Governed Agent Execution

## Trigger
A task may incur model/tool/API cost, expensive retries, multi-agent delegation, or large-context processing.

## Entry conditions
- Task objective and identifier exist.
- `config/cost-policy.json` is available.
- Budget Planner can produce a valid budget plan.

## Inputs
Task objective, risk level, available tools/models, known pricing metadata, approval records, and execution telemetry.

## Context
Load only cost-relevant task context and the repository instructions needed to identify workflow stages and mandatory verification.

## Stages

### 1. Plan budget — Budget Planner
Create the budget plan and validate it with `scripts/validate_budget.py`.

**Checkpoint:** plan status must be valid.

### 2. Pre-action admission — Orchestrator
Before each metered operation, confirm:
- stage ceiling remains available;
- retry cap is not exceeded;
- protected verification reserve will remain intact;
- unknown-cost policy is satisfied;
- any configured high-cost escalation has approval.

If not, stop with `human-approval-required` or `block`.

### 3. Execute and ledger — Orchestrator
After each operation, append a spend-ledger entry. Failed billable attempts remain in the ledger.

### 4. Stage reconciliation — Cost Reviewer
At stage boundaries, run:

```bash
python scripts/reconcile_spend.py --plan budget-plan.json --ledger spend-ledger.json --policy config/cost-policy.json --out reconciliation.json
python scripts/evaluate_spend_gate.py --plan budget-plan.json --ledger spend-ledger.json --policy config/cost-policy.json
```

Proceed only on `allow`.

### 5. Approval path — Human
If status is `human-approval-required`, the workflow stops. A valid approval may raise only the explicitly named task ceiling or permit the named expensive operation. Revalidate the plan before resuming.

### 6. Verify task — Orchestrator + Cost Reviewer
Use protected verification reserve for mandatory correctness checks. Record verification spend separately by stage.

### 7. Final gate — Cost Reviewer
Reconcile final actuals, confirm no unexplained spend, retry violation, or reserve violation, and distinguish:
- `executed`: requested actions ran;
- `verified`: required correctness checks passed and the cost gate allows completion.

## Produced artifacts
- Budget plan
- Spend ledger
- Reconciliation report
- Gate decision
- Optional human approval record

## Retry rules
- Operation retries: bounded by `max_retries_per_operation` in policy and plan.
- Cost telemetry retrieval: maximum 1 retry for transient failure.
- Budget-plan correction: maximum 1 revision after validator failure.
- No retry is allowed solely to obtain a cheaper-looking accounting result.

## Evidence preserved
Preserve failed operation cost entries, validator errors, gate output, reconciliation reports, and approval records.

## Approval points
Human approval is required for budget increases, unknown-cost paid operations when policy requires it, configured high-cost escalation, and any dangerous production action governed by repository policy.

## Failure paths
- Invalid plan/ledger → `block`.
- Hard ceiling exceeded → `block`.
- Mandatory verification reserve endangered → `block`.
- Soft threshold or expensive escalation → `human-approval-required`.
- Missing metered telemetry after one retry → `block`.

## Stop conditions
Stop at any blocking gate, after bounded retries are exhausted, or when required approval is absent.

## Definition of Done
- Budget plan validated.
- Metered operations accounted for.
- No hard-limit/retry/reserve violation remains.
- Required approval exists where applicable.
- Mandatory task verification completed.
- Final gate status is `allow`.
- Remaining risks or unpriced assumptions are documented.