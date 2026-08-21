# Token Burn Circuit Breaker

**Category:** Token

## Problem
Agent runtimes can continue spending tokens through retries, subagents, hooks, or repeated orchestration even when no useful progress is being made. Provider/session limits and dashboards are too coarse or too late for unattended execution.

## Evidence
See `evidence/research.md`. Current 2026 signals include Claude Code reports of repeated workflow restarts consuming hundreds of thousands of tokens, a request for runtime-enforced source-attributed caps, abnormal usage reports, and a Codex blocked-state loop that continued for hours.

## Existing approach and limitation
Usage dashboards, provider quotas, compaction, and per-component retry caps help, but they do not provide a shared task-level budget across parent/child agents and retry paths. A system can remain individually within each local cap while collectively wasting a large budget.

## Proposed improvement
Use a hierarchical runtime ledger and deterministic circuit breaker. Every model call is attributed to a task/source/lineage; progress markers distinguish productive work from repeated burn; child agents reserve budget from parents; hard limits stop unattended execution before another call.

## Architecture
- `evidence/research.md` — current evidence, gap, and root causes.
- `config/budget-policy.json` — default warning/hard thresholds and lineage policy.
- `schemas/usage-event.schema.json` — provider-neutral usage-event contract.
- `scripts/budget_guard.py` — deterministic evaluator; exit 0 allow, 3 warn, 4 stop, 2 invalid.
- `skills/token-budget-analysis.md` — evidence-driven baseline and threshold procedure.
- `rules/runtime-budget-rules.md` — enforceable runtime rules.
- `subagents/budget-verifier.md` — independent verification role.
- `workflows/enforce-and-verify.md` — bounded measure/diagnose/implement/remeasure workflow.
- `hooks/pre-model-call-budget-check.md` — integration point before model calls.
- `tests/test_budget_guard.py` — allow/retry/no-progress regression tests.

## Installation
Requires Python 3.10+ for the deterministic script. No third-party Python package is required. Copy the package into the agent runtime repository and emit JSONL usage events matching the schema.

## Configuration
Tune `config/budget-policy.json` using representative task baselines. Defaults are safe examples, not universal provider pricing recommendations. If cost enforcement matters, the integrating runtime must compute `estimated_cost_usd` using its current provider pricing source.

## Usage
Run:

`python3 scripts/budget_guard.py usage-ledger.jsonl --policy config/budget-policy.json`

Integrate the command or equivalent library logic at the hook described in `hooks/pre-model-call-budget-check.md`.

## Workflow
Observe → measure baseline → attribute sources → diagnose burn path → set evidence-backed thresholds → implement hierarchical reservations and guard → measure again → independently verify. The workflow permits at most two implementation/policy revisions after the first attempt.

## Metrics
Tokens/task, estimated cost/task, token velocity, retry-token ratio, no-progress tokens, source share, completion rate, and quality regression rate.

## Verification
Run `python3 -m pytest tests/test_budget_guard.py` if pytest is available. Integration verification must additionally prove all model-call paths emit usage, child reservations cannot oversubscribe the parent, and representative tasks still satisfy project acceptance criteria.

## Safety
The circuit breaker MUST NOT discard security, authorization, verification, or correctness-critical context merely to lower token use. Hard budgets are not automatically raised after a stop. Invalid telemetry fails closed for unattended execution.

## Failure handling
Detection: guard returns stop/invalid or integration misses a model-call path. Evidence: preserve sanitized ledger and reason code. Retry: maximum two implementation revisions with a changed hypothesis. Fallback: disable unattended execution on the affected path. Escalation: human/platform owner. Stop condition: telemetry cannot be trusted or quality/security regresses.

## Definition of Done
**Implemented:** every model path is budgeted and child reservations are hierarchical. **Measured:** before/after task metrics and source attribution exist. **Verified:** runaway fixtures stop, representative tasks remain acceptable, invalid telemetry blocks unattended continuation, and an independent verifier has no blocking finding.

## Customization
Add provider-specific price calculation outside the deterministic guard, extend allowed progress markers, or establish workload-specific policies. Preserve the invariant that child spend is bounded by parent budget and that hard-cap bypass requires explicit approval.

## Schema example

`examples/usage-event.example.json` is a synthetic instance of `schemas/usage-event.schema.json` for contract smoke tests. It contains no production data and demonstrates shape only; validate it with the package's documented checker or a Draft 2020-12 JSON Schema validator before adapting it.
