# Integration Guide

## Goal
Integrate deterministic subagent token attribution and budget enforcement into an agent host without depending on model self-reporting.

## 1. Collect the minimum telemetry
For each usage checkpoint, emit a JSON object with as many of these fields as the host can provide:

```json
{
  "task_id": "task-123",
  "agent_id": "agent-child-7",
  "parent_id": "agent-root",
  "role": "reviewer",
  "completed": true,
  "usage": {
    "input_tokens": 12000,
    "output_tokens": 800,
    "cache_read_input_tokens": 4000,
    "cache_creation_input_tokens": 500
  }
}
```

If the platform exposes only a combined child total, emit it as `subagent_tokens`. The analyzer intentionally places the unexplained amount into `unknown_tokens`; do not estimate an input/output split.

Prompt and response text are not required for attribution and should not be collected solely for this package.

## 2. Map lifecycle IDs
A child must have:
- one stable `agent_id`;
- the parent `parent_id`;
- a root/parent-owned `task_id` shared by the execution tree;
- an explicit `role` such as `reviewer`, `guardian`, `research`, or `memory`.

If the provider lacks one field, derive it only from deterministic lifecycle metadata. Do not ask the LLM to invent IDs after the fact.

## 3. Run normalization

```bash
python scripts/analyze_usage.py telemetry.jsonl \
  --policy config/budgets.json \
  --report usage-report.json
```

Exit codes:
- `0`: policy passes;
- `2`: budget/policy violation;
- `3`: invalid telemetry or policy;
- `4`: I/O failure.

## 4. Configure budgets from evidence
Do not use the example values as universal production defaults. Capture normal and worst-case representative runs first, then tune:
- `max_children_per_parent`;
- `max_total_tokens_per_parent_tree`;
- `max_tokens_per_child`;
- `max_unknown_token_ratio`;
- `max_child_token_share`;
- per-role overrides.

Simple high-frequency classifiers/guardians generally deserve tighter ceilings than bounded evidence-heavy reviewers, but the actual numbers must come from your workload.

## 5. Add the pre-spawn gate
Before spawning a child:
1. resolve parent task and role;
2. read current parent-tree usage;
3. calculate remaining envelope;
4. apply child-count and role ceilings;
5. allow, block optional work, or escalate mandatory work.

Never convert a budget failure for a security reviewer into auto-approval.

## 6. Add post-usage checkpoints
After child usage updates, completion, cancellation, retry, and compaction:
- append counters to the ledger;
- regenerate/reconcile the report;
- stop new optional fan-out after a breach;
- preserve the breach record for diagnosis.

## 7. Handle background jobs
Platform/background jobs should receive an explicit role and task owner whenever possible. If a job cannot be tied to the visible task, put it under a separate background task ID rather than hiding it in the user's foreground total.

Monitor token growth during idle periods. A positive token slope without completed outcomes is an incident signal.

## 8. CI integration
Add a representative fixed workload around orchestration changes. Compare candidate reports with an approved baseline and fail when:
- parent-tree tokens regress beyond tolerance;
- child token share materially increases without a documented benefit;
- unknown-token ratio exceeds policy;
- child count unexpectedly increases;
- functional acceptance or mandatory review coverage falls.

This package supplies unit tests for the analyzer:

```bash
python tests/test_analyzer.py
```

## 9. Provider adapters
### Exact usage available
Map provider fields to `input_tokens`, `output_tokens`, cache read, and cache write. Preserve each class separately.

### Combined child total only
Map to `subagent_tokens`. Do not fake cost precision. Report the unknown ratio and improve telemetry if accurate costing is required.

### No parent/role metadata
Instrument the orchestrator at spawn time. If that is impossible, classify the usage as unattributed and do not claim per-role savings.

## 10. Verification sequence
1. Run analyzer tests.
2. Capture baseline from the current host.
3. Introduce attribution only; confirm totals reconcile.
4. Introduce budgets in observe-only mode if your host supports it.
5. Review false positives and mandatory-role behavior.
6. Turn on enforcement for optional fan-out.
7. Test mandatory-role over-budget escalation.
8. Re-run the same workload and acceptance tests.
9. Mark **Verified** only when token and quality/security criteria both pass.

## Failure handling
- Invalid policy: stop enforcement initialization.
- Missing parent/role: fail closed for child attribution when configured.
- Budget breach: block additional optional fan-out.
- Mandatory reviewer exceeds budget: stop/escalate, do not bypass.
- High unknown ratio: continue coarse accounting if safe, but stop precise cost claims.
- Two unsuccessful optimization hypotheses: stop tuning and escalate with evidence.

## Customization
Extend the analyzer adapter paths for provider-specific fields, but keep its invariants:
- non-negative counters;
- no guessed token classes;
- explicit unknown bucket;
- stable parent-child IDs;
- deterministic budget evaluation.
