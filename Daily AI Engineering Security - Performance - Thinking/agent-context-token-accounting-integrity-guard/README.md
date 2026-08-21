# Agent Context Token Accounting Integrity Guard

## Topic
Prevent corrupted or semantically ambiguous token counters from driving context compaction and eviction.

## Category
Token

## Problem
Agent runtimes often track provider usage, session totals, cache usage, estimated prompt size, and current context occupancy. If these quantities are merged or mislabeled, cumulative usage can be mistaken for the size of the next prompt. Recent OpenClaw reports show premature compaction, repeated compaction, impossible context percentages, and session-state risk from this failure mode.

## Evidence
See `evidence/research.md` for public issue evidence, existing approaches, limitations, root-cause analysis, interpretation, and proposed mitigation.

## Existing approach
Store provider usage in session metadata, maintain a total token counter/freshness flag, and trigger compaction when that value crosses a threshold. Use estimates when exact tokenization is unavailable.

## Existing limitations
Billing usage and current context occupancy are not interchangeable. Multi-call tool loops repeatedly bill overlapping input context. Compaction can mutate transcript state independently from metadata. Freshness does not guarantee semantic correctness, and fallback estimators may have language-dependent error.

## Proposed improvement
Use typed accounting fields and require an integrity check before lossy context management. Current occupancy must state its measurement source and bind to the current transcript revision. Cumulative usage stays separately observable. Post-compaction snapshots must be remeasured before another automatic compaction decision.

## Architecture
`skills/token-accounting-diagnosis.md` defines evidence-driven diagnosis. `rules/token-accounting-invariants.md` defines enforceable semantics. `config/accounting-policy.json` sets tolerances. `hooks/pre-compaction-integrity.md` invokes `scripts/accounting_guard.py`. The Accounting Verifier independently replays regression fixtures.

## Package tree
```text
agent-context-token-accounting-integrity-guard/
├── README.md
├── config/
│   └── accounting-policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-compaction-integrity.md
├── rules/
│   └── token-accounting-invariants.md
├── scripts/
│   └── accounting_guard.py
├── skills/
│   └── token-accounting-diagnosis.md
├── subagents/
│   └── accounting-verifier.md
├── tests/
│   └── test_accounting_guard.py
└── workflows/
    └── measure-diagnose-verify.md
```

## Installation
Python 3.10+; no third-party dependencies. Copy the package into the agent runtime repository. Adapt the runtime's accounting snapshot to the documented JSON shape and call the hook before automatic compaction/eviction.

## Configuration
`config/accounting-policy.json` controls accepted measurement sources, estimator tolerance, transcript-revision binding, post-compaction remeasurement, and whether integrity failures block automatic compaction. Keep `allow_cumulative_usage_as_occupancy` false.

## Usage
Validate a snapshot:

```bash
python3 scripts/accounting_guard.py snapshot.json --policy config/accounting-policy.json
```

Exit codes: `0 safe`, `2 invalid`, `3 integrity failure`.

Run regression tests:

```bash
python3 -m unittest tests/test_accounting_guard.py
```

## Workflow
Use `workflows/measure-diagnose-verify.md`: Observe → measure baseline → classify metric semantics → form hypothesis → implement typed accounting → measure again → independently verify. Diagnosis/implementation retries are bounded to two revisions after the initial attempt.

## Metrics
Track false compaction triggers, compactions per long session, current occupancy vs provider input difference, estimator error, stale snapshot rejection, token usage/task, cost/task, latency, context utilization, and regression rate. Saving tokens is not success if critical context is lost.

## Verification
**Implemented** means typed fields, revision binding, and the pre-compaction hook exist in the runtime. **Measured** means before/after reproductions and accounting metrics have been collected. **Verified** means the independent verifier demonstrates run-sum inflation, stale revision, post-compaction stale state, cache mixing, and estimator-error fixtures fail safely while valid current-input snapshots pass.

## Safety
This guard blocks lossy automatic compaction when measurement integrity is uncertain. It does not delete transcript data, change model context limits, or claim exact tokenization where none is available. Do not weaken safeguards merely to reduce token usage.

## Failure handling
Detection: invariant failure, impossible ratio, unknown source, stale revision, excessive estimator error, or failed post-compaction remeasurement. Evidence: preserve the typed snapshot, transcript revision hash, and provider usage metadata. Retry: at most one evidence recollection plus two bounded implementation hypotheses. Fallback: keep the session intact and use explicit operator recovery. Escalation: runtime/context-management owner. Stop condition: automatic lossy context management remains blocked while integrity cannot be established.

## Definition of Done
- Current public evidence documented.
- Baseline reproduction captured.
- Current occupancy and cumulative usage are separate semantic fields.
- Measurement source is explicit.
- Transcript revision binding is enforced.
- Post-compaction remeasurement is enforced.
- Cumulative usage alone cannot trigger compaction.
- Regression tests pass.
- Before/after metrics collected.
- Independent verification has no blocking findings.

## Customization
Add provider-specific usage adapters or exact tokenizer integrations, but preserve the core contract: billing/cumulative usage is distinct from current context occupancy, estimates declare uncertainty, and destructive context management fails safe when measurement integrity is unknown.