# Runtime Agent Spend Circuit Breaker

**Category:** Token  
**Status model:** Implemented → Measured → Verified

## Problem
Long-running and multi-agent systems can consume unexpectedly large cumulative token and monetary budgets through parent calls, retries, subagents, hooks, plugins, and large outputs. Per-call limits and billing dashboards do not reliably prevent a runaway task from continuing to spend.

## Evidence
See `evidence/research.md`. Current independent public signals include Claude Code #85422 (August 10, 2026), Buzz #5652 (August 12, 2026), and Microsoft Agent Framework #6397/#6934 requesting runtime token/cost controls.

## Existing approach and limitation
Provider dashboards are retrospective; output-token caps bound only one call; advisory prompts are probabilistic; turn limits ignore different call sizes and model prices. Exact provider usage also commonly arrives after a request completes.

## Proposed improvement
Use a two-phase accounting gate:
1. reserve conservative estimated spend before dispatch;
2. block when the projected cumulative budget breaches a hard ceiling;
3. enter bounded wrap-up mode near the ceiling;
4. reconcile the reservation against actual provider usage after completion;
5. attribute spend by task, agent, source, model, and attempt.

The model may be informed of remaining budget, but enforcement stays in deterministic runtime code.

## Architecture
```text
Task / Agent / Source
        |
        v
pre-model-call hook
        |
        v
spend_guard.py reserve ----> durable budget ledger
        |                         |
 allow / wrap / block             |
        |                         |
        v                         |
 provider model call              |
        |                         |
 actual usage --------------------+
        |
        v
spend_guard.py reconcile
        |
        v
metrics + independent verification
```

## Package tree
```text
runtime-agent-spend-circuit-breaker/
├── README.md
├── config/
│   └── budget.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-model-call.md
├── rules/
│   └── runtime-budget.md
├── scripts/
│   └── spend_guard.py
├── skills/
│   └── budget-baseline.md
├── subagents/
│   └── cost-verifier.md
├── tests/
│   └── test_spend_guard.py
└── workflows/
    └── enforce-budget.md
```

## Installation
Requires Python 3.10+ and no third-party Python packages for the reference script/tests. Copy the package directory intact.

## Configuration
Edit `config/budget.json` before use. Replace `example-model` pricing with verified current pricing for models actually used. Production deployments SHOULD version price data and use a transactional/single-writer ledger rather than a shared JSON file.

Key settings:
- `task_hard_limit_usd`: deterministic task ceiling.
- `task_wrap_up_threshold_usd`: earlier threshold for bounded finalization.
- `agent_daily_hard_limit_usd`: second scope for cumulative agent spend.
- `reservation_safety_factor`: conservatism for pre-dispatch estimates.
- `unknown_model_policy`: defaults to `block`.

## Usage
Reserve before a call:
```bash
python scripts/spend_guard.py reserve --config config/budget.json --state state.json \
  --task task-1 --agent worker-1 --source parent --model example-model \
  --input-tokens 12000 --max-output-tokens 4096
```

Reconcile the returned reservation after the provider response:
```bash
python scripts/spend_guard.py reconcile --config config/budget.json --state state.json \
  --reservation-id <id> --actual-input-tokens 11800 \
  --actual-cached-input-tokens 5000 --actual-output-tokens 1200
```

## Workflow
Follow `workflows/enforce-budget.md`: Observe → baseline → diagnose → hypothesis → implement reservation/reconciliation → measure again → independently verify. Tuning is bounded to two iterations.

## Metrics
Tokens/task, USD/task, p50/p95 spend, retry/subagent share, estimate error, hard blocks, wrap-ups, unresolved reservations, completion rate, and quality regression rate.

## Verification
Run:
```bash
python -m unittest tests/test_spend_guard.py
```
Then use `subagents/cost-verifier.md` to independently recompute sampled traces against raw provider usage.

## Safety
- Never auto-raise a hard limit.
- Never treat missing usage as zero.
- Never remove safety-, authorization-, correctness-, or verification-critical context merely to save tokens.
- Never let retries or child agents reset the parent task budget.
- Do not use the bundled JSON state file as a concurrent multi-writer production database.

## Failure handling
**Detection:** invalid pricing, inconsistent ledger, unresolved reservation, projected hard-limit breach, or failed durable write.  
**Evidence:** preserve request identity and budget event.  
**Retry:** at most one retry for a transient ledger-store operation. Model retries consume the same budget.  
**Fallback:** block new spend and return a partial-result/budget-exhausted state.  
**Escalation:** human/platform owner for pricing or accounting inconsistency.  
**Stop condition:** hard limit reached or accounting cannot be trusted.

## Definition of Done
### Implemented
Every known spend-producing path runs the reservation gate and reconciles actual usage.

### Measured
Baseline and post-control distributions exist, including attribution and estimate error.

### Verified
Allow/wrap/block/reconcile tests pass; cumulative accounting matches sampled provider records; no new call starts beyond the hard ceiling; and representative tasks show no critical quality regression.

## Customization
Add token-only limits, monthly portfolio scopes, provider-specific cached-token categories, distributed ledger adapters, model-routing policies, or per-source budgets without weakening the hard cumulative gate.
