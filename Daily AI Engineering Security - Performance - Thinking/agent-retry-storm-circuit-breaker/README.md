# Agent Retry-Storm Circuit Breaker

## Topic
Bounded, progress-aware retry supervision for AI agents, tool calls, subagents, and workflow restarts.

## Category
**Performance** — with Token, cost, reliability, and side-effect safety implications.

## Problem

AI-agent runtimes often have several retry-capable layers: provider SDK, HTTP client, tool adapter, model loop, orchestration layer, subagent/workflow manager, and watchdog. A transient failure can therefore become many physical attempts for one logical operation. Worse, model-generated retries often receive new invocation IDs even when the tool and arguments are unchanged, so lower-layer retry limits do not see them as a single retry sequence.

Recent 2026 public issue reports show identical tool calls repeated 30–50+ times, a broken permission request retried about 128 times, actively progressing subagents killed and restarted until roughly 580k tokens were consumed, and long-lived session/tool loops draining usage. The engineering goal is not to remove retries; it is to preserve useful transient recovery while deterministically stopping no-progress amplification.

## Evidence

See [`evidence/research.md`](evidence/research.md). It documents:

- Claude Code issue #59318 (2026-05-15): repeated identical commands 30–50+ times and multi-hour tasks;
- Claude Code issue #75510 (2026-07-08): permission-request stream retried ~128 times without visible backoff;
- Claude Code issue #81359 (2026-07-26): session restart/tool-loop usage drain;
- Claude Code issue #85206 (2026-08-09): watchdog restart loop consuming about 580k tokens with no code progress;
- established distributed-systems guidance on retry caps, exponential backoff with jitter, idempotency, fail-fast behavior, and avoiding multi-layer retry amplification.

The research file separates observed evidence, interpretation, and this package's proposed engineering solution.

## Existing approach

Common approaches include SDK automatic retry, generic exponential backoff, fixed maximum attempts, prompt instructions, watchdog restart, and manual interruption.

## Existing limitations

- SDK retries do not control model-generated or workflow-level replay.
- Multiple retry layers can compound attempts.
- Fixed attempt caps do not detect semantically identical no-progress calls.
- Time-only watchdogs can kill useful long-running work and restart setup from zero.
- New invocation IDs can hide equivalence across attempts.
- Side-effecting tool calls may be replayed after ambiguous timeouts without stable idempotency.
- Retry counters can disappear when a child agent/session restarts.
- Individual logs do not automatically expose aggregate retry amplification.

## Proposed improvement

Use a persistent host-side retry supervisor:

```text
Operation
  -> canonical fingerprint
  -> classify failure
  -> verify retry owner
  -> side effect? require idempotency
  -> check attempt/run/time/token/no-progress budgets
  -> non-retryable? fail fast
  -> budget exhausted? OPEN circuit
  -> transient? capped backoff + jitter
  -> execute once
  -> observe progress/result
  -> success: close/reset appropriate state
  -> failure: bounded repeat
```

For long-running children, watchdog decisions use host-visible material progress and checkpoints rather than elapsed time alone.

## Architecture

### Logical operation fingerprint
[`scripts/retry_guard.py`](scripts/retry_guard.py) canonicalizes tool, operation type, resource, and arguments to create a stable SHA-256 fingerprint. This allows separate invocation IDs to share one retry budget when they are the same logical operation.

### Retry ownership
Exactly one orchestration layer owns logical replay. Lower-layer SDK retries may remain when understood and bounded, but the runtime must avoid independently retrying the same logical operation at several layers.

### Persistent retry state
Attempt, run, elapsed-time, token, duplicate, progress, and circuit state must survive model turns, compaction, subagent respawn, and workflow restart.

### Failure classifier
Configured transient classes may retry; permission/auth/policy/schema/invalid-input failures fail fast. Unknown errors are not automatically considered transient.

### Side-effect replay boundary
Retries of write/delete/payment/send/deploy/publish operations require a stable business-level idempotency key. Ambiguous side effects without one require human approval.

### Circuit breaker
Retry/no-progress budget exhaustion transitions the operation to `OPEN`. Recovery uses bounded `HALF_OPEN` probing rather than immediately returning to unrestricted replay.

### Trace analyzer
[`scripts/analyze_retry_trace.py`](scripts/analyze_retry_trace.py) computes physical attempts, logical operations, retry amplification factor, duplicate/no-progress attempts, estimated tokens, attempts by layer, and hotspots.

## Package structure

```text
agent-retry-storm-circuit-breaker/
├── README.md
├── guide-intergration.md
├── config/
│   └── retry-policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── hooks.md
├── rules/
│   └── engineering-rules.md
├── scripts/
│   ├── analyze_retry_trace.py
│   └── retry_guard.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── test_retry_guard.py
├── verification/
│   └── report.md
└── workflows/
    └── workflows.md
```

## Installation

Requires Python 3.10+; scripts use only the standard library.

Copy the package into the host repository or agent runtime. No secrets or third-party Python dependencies are required.

## Configuration

[`config/retry-policy.json`](config/retry-policy.json) defines default bounds:

- 4 attempts per logical operation;
- 12 retries per run;
- 120 seconds cumulative retry time per operation;
- 2 no-progress duplicates;
- 20,000 estimated retry tokens per operation;
- capped exponential backoff with full jitter;
- one HALF_OPEN probe;
- explicit retryable/non-retryable classes;
- stable idempotency key for side-effect retries.

These are starting defaults, not universal production values. Tune only after collecting a baseline and preserve finite bounds.

## Usage

### 1. Capture a baseline

Export runtime events as JSONL and run:

```bash
python scripts/analyze_retry_trace.py retry-trace.jsonl --output retry-report.json
```

### 2. Fingerprint a logical operation

```bash
python scripts/retry_guard.py fingerprint --operation operation.json
```

### 3. Decide before another attempt

```bash
python scripts/retry_guard.py decide \
  --operation operation.json \
  --state retry-state.json \
  --policy config/retry-policy.json
```

The host handles the emitted decision. The script itself does not execute tools, sleep, or mutate external systems.

### 4. Persist state

Persist counters and circuit state before retrying. Never reset them merely because the model creates a new tool-call ID or a child agent restarts.

### 5. Run tests

```bash
python -m unittest tests/test_retry_guard.py
```

## Workflow

Primary flow in [`workflows/workflows.md`](workflows/workflows.md):

**Observe → Baseline → Diagnose → Hypothesize → Guard → Measure → Compare → Independently Verify**

Per-operation failure flow:

**Fingerprint → Retry Owner → Classify → Idempotency → Budgets → Backoff/Fail/Open → Execute Once → Observe Progress → Bounded Repeat**

Every remediation and retry loop is bounded.

## Skills

[`skills/core-skills.md`](skills/core-skills.md) contains executable procedures for:

- retry baseline and ownership audit;
- logical operation fingerprinting;
- bounded retry decisions;
- progress-aware watchdog recovery.

Each skill includes trigger, inputs, preconditions, required context, tools, procedure, decisions, constraints, outputs, metrics, verification, failure handling, and stop conditions.

## Rules

[`rules/engineering-rules.md`](rules/engineering-rules.md) defines enforceable **MUST / MUST NOT / SHOULD** rules. Core invariants include finite budgets, one retry owner, persistent counters, idempotency for side-effect replay, fail-fast non-transient classes, no counter reset through respawn, and no weakening correctness/security to reduce retries.

## Subagents

[`subagents/subagents.md`](subagents/subagents.md) defines:

- Retry Evidence Analyst;
- Reliability Planner;
- Implementation Agent;
- Independent Verification Agent;
- Orchestrator.

The implementing agent is not the sole final verifier.

## Hooks

[`hooks/hooks.md`](hooks/hooks.md) defines pre-task retry ownership validation, pre-retry deterministic decision, side-effect replay protection, progress-aware watchdog handling, post-run trace analysis, and final verification.

## Metrics

Always establish a baseline first. Track:

- physical attempts;
- logical operations;
- retry amplification factor;
- duplicate/no-progress attempts;
- tool/model-call count;
- estimated retry tokens;
- retry wall-clock time;
- transient recovery rate;
- circuit opens and false opens;
- restart-from-zero count;
- checkpoint reuse rate.

Do not claim performance improvement without before/after measurement.

## Verification

See [`verification/report.md`](verification/report.md).

Distinguish:

- **Implemented:** guard logic, scripts, policy, workflows and tests exist;
- **Measured:** package behavior and target-runtime baseline/canary metrics have been collected;
- **Verified:** required tests pass and guarded canary reduces waste without unacceptable loss of transient recovery.

The regression suite covers fingerprint stability, semantic fingerprint differences, transient retry, non-retryable failure, unknown failure, all configured budget classes, side-effect idempotency, and already-open circuits.

## Safety

- The scripts do not execute arbitrary tools or external side effects.
- Secret values should be redacted before trace persistence.
- Permission/auth/policy failures are non-retryable by default.
- Destructive or ambiguous side-effect replay without stable idempotency requires human approval.
- Circuit counters cannot be reset through model/session/subagent restart.
- Retry optimization never justifies weakening security, verification, or correctness.

## Failure handling

On guard or verification failure:

1. preserve the raw trace, current state, and negative evidence;
2. emit a deterministic reason code;
3. fail fast or open the circuit according to policy;
4. retry implementation remediation at most twice and only for named defects;
5. rerun the failing fixture and full suite;
6. if unresolved, mark the integration blocked instead of increasing limits indefinitely.

For ambiguous side effects, stop and require reconciliation or explicit approval.

## Definition of Done

The integrated solution is complete only when:

- current public evidence and current approaches are documented;
- a target-runtime retry baseline exists;
- every operation family has one declared retry owner;
- retry state persists across model/child/session restarts;
- all retry budgets are finite and enforced;
- side-effect replay has idempotency or explicit approval;
- contract tests pass;
- guarded canary metrics are collected and compared with baseline;
- retry amplification/token/time waste improves on representative storms;
- transient recovery remains within accepted tolerance;
- independent verification is complete;
- no blocking issue remains.

## Customization

Extend the operation schema with provider request IDs, HTTP status, checkpoint IDs, model name, cost estimates, resource-specific idempotency fields, dependency recovery signals, and distributed circuit storage.

Keep three invariants:

1. **one logical retry budget survives physical invocation changes;**
2. **a retry requires a plausible path to new progress;**
3. **no side effect is replayed automatically when its prior outcome is ambiguous and idempotency is absent.**