# Deterministic Tool Failure Circuit Breaker

**Category:** Performance

## Problem
AI-agent harnesses can waste large amounts of time, tokens, and tool capacity by retrying the same deterministic failure or dead permission/transport path without any changed condition that could make the next attempt succeed.

## Evidence
See `evidence/research.md`. Recent public reports include repeated deterministic Codex tool failures, a Claude Code permission stream retried roughly 128 times, and false no-output retries producing duplicate responses. Current OpenAI guidance for tool-heavy workflows also recommends explicit retry and stopping limits.

## Existing approach
Generic exponential backoff, provider SDK retry, global max-turn limits, model-directed self-correction, and manual cancellation.

## Existing limitations
Backoff alone cannot fix validation/policy/not-found failures; global limits allow one incident to consume most of the task budget; retries may preserve identical arguments and error state; unknown side effects can be dangerous to replay.

## Proposed improvement
Classify every failure before retry, fingerprint the call/error pair, enforce per-incident budgets, block identical deterministic retries, require progress/new evidence, and reconcile unknown side effects before replay.

## Architecture
- `skills/tool-failure-classification.md` defines classification and decisions.
- `rules/retry-policy.md` defines bounded retry invariants.
- `subagents/retry-auditor.md` independently verifies incidents.
- `workflows/classify-break-recover.md` defines Measure → Diagnose → Recover → Measure again.
- `hooks/pre-retry-gate.md` blocks disallowed retries.
- `scripts/retry_guard.py` deterministically applies the circuit-breaker policy.

## Package tree
```text
README.md
evidence/research.md
skills/tool-failure-classification.md
rules/retry-policy.md
subagents/retry-auditor.md
workflows/classify-break-recover.md
hooks/pre-retry-gate.md
scripts/retry_guard.py
```

## Installation
Requires Python 3.9+. Store incident state outside volatile model context so retry counters survive turns and compaction.

## Configuration
Define tool-specific error mappings, transient retry budgets, idempotency/reconciliation mechanisms, and side-effecting tool classes. Defaults in this package permit no more than two transient retries and block repeated deterministic incidents after the repeated failure unless relevant state changes.

## Usage
Create `incident.json` with `tool`, `arguments`, `error_class`, `error_fingerprint`, `attempts`, plus optional `side_effecting`, `outcome_reconciled`, and `changed_since_failure`; run:
`python3 scripts/retry_guard.py incident.json`

Exit 0 allows the bounded retry; exit 2 indicates invalid input; exit 3 opens/keeps the circuit and blocks retry.

## Workflow
Observe → capture baseline → classify → form a changeable hypothesis → retry/fallback/reconcile → measure again → independently verify. Remediation is bounded to two changed attempts.

## Metrics
Calls/task, duplicate failed calls, retries/incident, tool/model latency, tokens/task, recovery rate, task success, and regression rate.

## Verification
Run the same representative transient and deterministic fixtures before and after integration. Improvement is **Measured** only when calls/latency/tokens decrease. It is **Verified** only when final task correctness is equal or better, side-effect safety is preserved, and the independent Retry Auditor passes.

## Safety
Never replay an unknown side effect blindly. Never turn authorization, policy, approval, or validation failures into transient errors just to improve throughput. Circuit breaking must not weaken security.

## Failure handling
Detection: repeated incident fingerprint, budget exhaustion, unknown side-effect status. Evidence: incident ledger. Retry: bounded per class. Fallback: changed arguments/tool/path or safe direct escalation. Escalation: human/operator when no safe fallback exists. Stop after budget exhaustion or two non-improving remediation attempts.

## Definition of Done
Current evidence documented; baseline captured; classifier integrated; retry fingerprints persisted; budgets enforced; repeated deterministic calls blocked; unknown side effects reconciled; before/after metrics collected; task-level tests/evals pass; independent audit passes; no blocking issue remains.

## Customization
Add tool-specific classifiers, provider status codes, jitter/backoff, and reconciliation adapters while preserving incident identity, bounded budgets, progress requirements, and independent outcome verification.