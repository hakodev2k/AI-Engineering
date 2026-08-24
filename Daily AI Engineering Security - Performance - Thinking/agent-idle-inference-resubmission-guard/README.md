# Agent Idle Inference Resubmission Guard

**Category:** Token

## Problem
Background/internal agent workers can keep issuing full model requests after observable work has reached a terminal or idle state. Because large prefixes are often cached, the loop can look cheap per request while still consuming enormous cached-input volume, quota, latency, and provider capacity.

## Evidence and existing approach
See `evidence/research.md`. Existing controls such as retry limits, status-poll backoff, prompt caching, and task-level spend caps reduce damage but do not enforce the key invariant: **no inference request without a new progress-bearing trigger**.

## Proposed improvement
Introduce a deterministic admission gate before every internal/background model request. A request is admissible only when at least one fresh trigger exists: pending user/input event, changed external state, unresolved model follow-up, newly completed tool result requiring interpretation, or an explicit bounded retry whose cause changed. Terminal or idle state is a hard no-op.

## Architecture
```
agent-idle-inference-resubmission-guard/
├── README.md
├── evidence/research.md
├── rules/inference-admission.md
├── skills/idle-loop-diagnosis.md
├── subagents/token-verifier.md
├── workflows/measure-gate-verify.md
├── hooks/pre-inference-admission.md
├── scripts/audit_idle_inference.py
└── tests/test_audit_idle_inference.py
```

## Installation
Python 3.10+; no external packages.

## Configuration
Telemetry is JSONL. Each record may include `ts`, `thread_id`, `turn_id`, `event`, `needs_follow_up`, `has_pending_input`, `state_changed`, `retry_reason_changed`, `input_tokens`, and `cached_input_tokens`.

## Usage
`python scripts/audit_idle_inference.py telemetry.jsonl --max-idle-requests 0`

Exit codes: `0` no policy violation, `2` idle inference detected, `3` invalid telemetry.

## Workflow
Follow `workflows/measure-gate-verify.md`: capture baseline request/token volume, diagnose triggers, add admission gate, replay comparable workload, and independently verify that legitimate continuations still run.

## Metrics
Idle inference requests/task, cached-input tokens wasted while idle, requests after terminal state, time-to-quiescence, legitimate continuation false-block rate, tokens/task, cost/task, latency/task.

## Verification
Run `python -m unittest tests/test_audit_idle_inference.py`. Production verification additionally requires before/after telemetry from comparable workloads.

## Safety and correctness
The guard MUST NOT suppress a request that has new user input, a fresh tool result requiring interpretation, a changed external state, or a justified bounded retry. Token savings never justify losing required context or correctness.

## Failure handling
If event semantics are ambiguous, do not silently drop work: enter a blocked diagnostic state, preserve the trigger evidence, and request operator review. Retry analysis is bounded to two remediation cycles.

## Definition of Done
Implemented: admission predicate runs before background/internal inference. Measured: baseline and post-change telemetry exist. Verified: idle requests fall to zero (or an explicitly approved nonzero threshold), token volume decreases, legitimate continuation tests pass, and independent verification finds no critical lost-work regression.

## Customization
Map host-specific state into the canonical trigger fields. Prefer explicit event IDs and monotonic state versions over text comparison.