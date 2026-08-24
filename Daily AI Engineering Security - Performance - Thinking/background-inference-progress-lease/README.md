# Background Inference Progress Lease

## Topic
Bound background model calls with durable progress leases so internal workers cannot consume unbounded tokens while idle or making no observable progress.

## Category
Token

## Problem
Background memory, continuation, polling, review, and maintenance workers can remain model-active after useful work stops. Successful requests and cached input can mask a runaway loop until quota or context is exhausted.

## Evidence
See `evidence/research.md`. Current August 2026 reports include a 1,911-request Codex background-memory loop, an automatic continuation no-progress loop, and full-context polling after long-running command execution.

## Existing approach
Retries, timeouts, cancellation, compaction, caching, and generic loop detection help but do not universally bind every background model request to a durable progress signal and cumulative token/request budget.

## Existing limitations
A successful model response is not equivalent to progress; wall-time limits can permit many calls; child workers may outlive foreground state; restart/reconnect can reset in-memory counters; cached tokens still represent avoidable request/quota pressure.

## Proposed improvement
Require each background worker to hold a finite lease containing owner state, purpose, request/token budgets, no-progress allowance, duplicate fingerprint allowance, and an observable progress version. Re-entry is denied when the owner is terminal, the budget is exhausted, or progress has remained unchanged for the configured bound.

## Architecture
- `evidence/research.md` — current signals, existing approaches, gap, root causes.
- `skills/progress-lease-analysis.md` — reusable analysis/decision procedure.
- `rules/background-model-call-rules.md` — enforceable invariants.
- `subagents/lease-verifier.md` — independent verification role.
- `workflows/measure-diagnose-enforce-verify.md` — bounded implementation workflow.
- `hooks/pre-dispatch-lease-check.md` — deterministic pre-model-call gate contract.
- `scripts/progress_lease_analyzer.py` — dependency-free JSONL policy analyzer.
- `tests/test_progress_lease_analyzer.py` — progressing, stalled, terminal, and token-budget regressions.

## Actual package tree
```text
background-inference-progress-lease/
├── README.md
├── evidence/research.md
├── hooks/pre-dispatch-lease-check.md
├── rules/background-model-call-rules.md
├── scripts/progress_lease_analyzer.py
├── skills/progress-lease-analysis.md
├── subagents/lease-verifier.md
├── tests/test_progress_lease_analyzer.py
└── workflows/measure-diagnose-enforce-verify.md
```

## Installation
Requires Python 3.9+ only for the reference analyzer/tests. The policy itself is runtime-agnostic.

## Configuration
Start with explicit finite limits appropriate to the worker. The analyzer defaults are 50 requests, 2,000,000 input tokens, 3 consecutive no-progress calls, and 3 identical request fingerprints. Production values MUST be derived from baseline workloads rather than copied blindly.

## Usage
Run:

`python scripts/progress_lease_analyzer.py trace.jsonl`

Records require `worker_id`, `owner_id`, `purpose`, `request_fingerprint`, `progress_version`, `input_tokens`, and `owner_state`.

Run regression fixtures:

`python tests/test_progress_lease_analyzer.py`

## Workflow
Follow `workflows/measure-diagnose-enforce-verify.md`: Observe → baseline → diagnose → hypothesis → implement → measure again → bounded revision → independent verification.

## Metrics
Requests/job, tokens/job, no-progress streak, duplicate rate, output-version changes/request, owner-terminal-to-worker-stop latency, prevented calls/tokens, completion regression rate.

## Verification
**Implemented** means the gate and durable counters exist. **Measured** means before/after telemetry has been collected. **Verified** requires regression fixtures plus representative trace evidence showing runaway calls are bounded while progressing workers still complete.

## Safety
This package does not reduce required task context merely to save tokens. It blocks unjustified model re-entry, not correctness-critical context. Hard budgets may be extended only by explicit policy/operator decision.

## Failure handling
Detection: analyzer/gate violation or inconsistent lifecycle/counters. Evidence: persisted trace and reason. Retry: at most two evidence-driven threshold/progress-signal revisions. Fallback: stop optional worker or escalate required work. Stop: terminal owner, hard budget, repeated no progress, or unverifiable counters.

## Definition of Done
Evidence documented; baseline captured; progress signal defined; durable budgets enforced; fixtures pass; before/after metrics show reduced waste without material completion regression; independent verifier approves; no blocking risk remains.

## Customization
Replace the JSONL reference evaluator with an atomic database/metrics-backed implementation while retaining the same fields and invariants. Define progress per worker purpose; do not use generic assistant text as the signal.
