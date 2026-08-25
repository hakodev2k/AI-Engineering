# Approval-Wait Latency Attribution Guard

**Category:** Thinking / Performance

## Problem
Approval-gated agent actions can spend seconds or minutes waiting for a human and then execute in milliseconds. If the entire interval is labeled or reasoned about as tool execution, the agent can conclude that the command/API/tool is slow and optimize the wrong thing.

## Evidence
Current evidence and interpretation are documented in `evidence/research.md`. The package is motivated by a 2026-08-15 Codex report of approval dwell influencing performance conclusions, plus current OpenAI Agents SDK lifecycle documentation that models approval as a pause before execution.

## Existing approach
Many systems expose a single elapsed duration or generic span. Human-in-the-loop frameworks already have explicit interruption/resume boundaries, but those boundaries are not automatically guaranteed to be preserved in performance evidence.

## Existing limitations
A combined duration hides approval dwell, queueing, execution, and post-processing. A model can use that ambiguous measurement as a false fact and make unnecessary changes.

## Proposed improvement
Treat latency as a typed lifecycle. Record approval and execution timestamps separately, validate causal ordering deterministically, and block performance claims that lack valid execution bounds.

## Architecture
- Research defines the real failure and source evidence.
- Policy defines timing validity and regression thresholds.
- Skill defines the reusable investigation procedure.
- Rules make attribution requirements observable.
- Investigator measures and diagnoses.
- Independent verifier checks claims.
- Workflow bounds optimization loops.
- Hook runs a deterministic post-run gate.
- Script validates traces and computes phase metrics.
- Tests cover approval-dwell separation, impossible ordering, and regressions.

## Actual package tree
```text
approval-wait-latency-attribution-guard/
├── README.md
├── config/
│   └── latency-policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── post-run-latency-check.md
├── rules/
│   └── timing-boundaries.md
├── scripts/
│   └── latency_attribution.py
├── skills/
│   └── latency-attribution.md
├── subagents/
│   ├── performance-investigator.md
│   └── verification-agent.md
├── tests/
│   └── test_latency_attribution.py
└── workflows/
    └── measure-diagnose-verify.md
```

## Installation
Requires Python 3.10+ and only the standard library. Copy the package directory intact.

## Configuration
Edit `config/latency-policy.json` only with reviewed thresholds. Keep `diagnosis_metric` as execution time unless the investigation explicitly targets approval UX.

## Usage
Validate a JSONL trace:

```bash
python scripts/latency_attribution.py trace.jsonl --policy config/latency-policy.json --strict
```

Each trace record requires `call_id`, `approval_required`, `requested_ms`, `execution_start_ms`, and `execution_end_ms`. Approval-gated records also require `approval_required_ms` and `approval_decision_ms`. Optional fields are `postprocess_end_ms` and `baseline_execution_ms`.

Run tests:

```bash
python -m unittest tests/test_latency_attribution.py
```

## Workflow
Follow `workflows/measure-diagnose-verify.md`: Observe → validate timing → measure baseline → diagnose phase → form hypothesis → implement → measure again → independently verify. A hypothesis gets at most two optimization attempts.

## Metrics
- `approval_wait_ms`
- `tool_execution_ms`
- `postprocess_ms`
- `total_wall_ms`
- execution p50/p95
- invalid-trace rate
- before/after execution change percentage

## Verification
A performance claim is **Implemented** when instrumentation/change exists, **Measured** when equivalent before/after traces exist, and **Verified** only when the independent verifier confirms valid boundaries, tests, and metric semantics.

## Safety
This package MUST NOT reduce approval coverage to improve latency. Approval dwell may be optimized as UX/orchestration only while preserving required human decisions.

## Failure handling
**Detection:** script/test failure or insufficient timestamps. **Evidence:** preserve raw trace and blocking reasons. **Retry policy:** at most two optimization attempts per hypothesis. **Fallback:** restore the last verified implementation and instrument missing boundaries. **Escalation:** send unresolved instrumentation/security conflicts to a human owner. **Stop condition:** invalid evidence, two failed attempts, or required approval would be weakened.

## Definition of Done
- `evidence/research.md` is complete and sourced.
- Baseline execution metrics are captured when optimizing.
- Timing order passes the deterministic gate.
- Approval dwell is reported separately.
- Improvement is measured on equivalent workload.
- Tests pass.
- Independent verifier accepts the claim.
- Required approval boundaries are unchanged.
- No blocking issue remains.

## Customization
Adapters may translate OpenTelemetry spans, SDK traces, JSON logs, or proprietary events into this package's normalized timestamps. Do not change the semantic boundary between approval and execution.
