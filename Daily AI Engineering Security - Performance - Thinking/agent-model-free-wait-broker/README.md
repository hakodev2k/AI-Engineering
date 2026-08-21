# Agent Model-Free Wait Broker

## Topic
Remove passive wait/status polling from the LLM reasoning loop and wake the model only when new state requires a decision.

## Category
**Performance** — with direct Token/cost impact.

## Problem
Long-running builds, tests, shell commands, remote jobs, and subagents often outlive a single synchronous tool timeout. Many agent runtimes respond by repeatedly re-entering the model to issue `wait`, `status`, `write_stdin`, or equivalent calls. When the target is still running, these turns add no useful reasoning but still consume inference, tokens, credits, context, tool calls, and elapsed time.

## Evidence
Recent public Codex reports show the same failure mode across multiple wait mechanisms:
- issue #35259 reports repeated model re-entry for wait/status polling and measures 19.8% of raw local token volume in a corrected usage window as turns whose only tool action was waiting/status polling;
- issue #31935 describes long-running builds becoming dozens of repeated poll calls due to short blocking-wait guidance;
- issue #18394 reports 30-second `wait_agent` expiry causing unnecessary parent polling loops and extra model turns;
- issue #33999 reports repeated `wait(noop)` calls without a valid running exec cell;
- issue #14824 reports long tool-heavy sessions with repeated polling contributing to continuity problems.

See `evidence/research.md` for evidence, interpretation, limitations, and sources.

## Existing approach
Typical implementations keep waiting inside the normal agent loop:

```text
model -> wait/status tool -> unchanged -> model -> wait/status tool -> unchanged -> ...
```

Short fixed timeouts preserve responsiveness, and manual polling is easy to implement. However, the model itself becomes the scheduler.

## Existing limitations
- Every unchanged poll can trigger another inference request.
- Short fixed waits create predictable polling storms for 10–60 minute jobs.
- Poll messages/tool outputs grow the trace/context.
- No-op or invalid wait handles may loop instead of failing once.
- Simply increasing the timeout does not solve invalid targets, progress noise, user interruption, or observability.
- A polling runtime may not distinguish passive waiting from a status check that genuinely needs reasoning.

## Proposed improvement
Move passive waiting into a deterministic **wait broker** owned by the host/runtime:

```text
model decides work
      |
runtime starts target
      |
wait broker owns passive waiting
      |-- unchanged state --> host-side sleep/poll only
      |-- material progress --> compact wake event
      |-- completed/failed/cancelled --> terminal wake
      |-- user input/deadline/error --> explicit wake
      v
model re-enters only when a decision can be useful
```

The broker prefers event-driven completion callbacks/futures. When events are unavailable, it uses adaptive host-side polling with bounded exponential backoff. Unchanged state is never by itself a reason to call the model.

## Architecture
The package has four logical layers:

1. **Measurement** — classify wait-only model turns and quantify baseline cost.
2. **Broker** — validate targets, wait deterministically, back off, and emit wake events.
3. **Orchestration contract** — only wake the model for meaningful state changes or explicit interruption.
4. **Verification** — prove inference reduction without missed events or unacceptable detection lag.

## Package structure

```text
agent-model-free-wait-broker/
├── README.md
├── guide-intergration.md
├── config/
│   └── wait-policy.json
├── evidence/
│   └── research.md
├── examples/
│   └── sample-trace.jsonl
├── hooks/
│   └── hooks.md
├── rules/
│   └── engineering-rules.md
├── scripts/
│   ├── wait_broker.py
│   └── wait_metrics.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── test_wait_broker.py
├── verification/
│   └── verification-report.md
└── workflows/
    └── workflows.md
```

## Installation
Requires Python 3.9+ and only the standard library.

```bash
cd agent-model-free-wait-broker
python -m unittest discover -s tests -v
```

No package installation is required for the reference scripts.

## Configuration
Edit `config/wait-policy.json`.

Important controls:
- `initial_poll_seconds` — fallback polling interval before backoff;
- `max_poll_seconds` — maximum fallback poll interval;
- `backoff_multiplier` — growth factor for unchanged state;
- `max_wait_seconds` — hard bounded wait;
- `material_progress_delta` — minimum numeric progress change that may wake the model;
- `max_unchanged_polls` — secondary loop bound;
- `completion_detection_sla_seconds` — verification threshold;
- `reject_targets` — sentinel/no-op IDs that fail immediately;
- `model_reentry_on_unchanged_state` — must remain false for this design.

Tune these per target class when possible. A build process, remote deployment, and subagent may need different detection SLAs.

## Usage
### Measure current traces

```bash
python scripts/wait_metrics.py examples/sample-trace.jsonl
```

For real baselines:

```bash
python scripts/wait_metrics.py trace.jsonl --json-out baseline.json
```

### Validate a wait target
Assume a runtime adapter writes normalized state such as:

```json
{"status":"running","progress":0.35,"version":4}
```

Then:

```bash
python scripts/wait_broker.py validate \
  --target-id build-42 \
  --state-file state.json \
  --policy config/wait-policy.json
```

### Wait outside the model loop

```bash
python scripts/wait_broker.py wait \
  --target-id build-42 \
  --state-file state.json \
  --policy config/wait-policy.json \
  --events-out .wait-events.jsonl
```

The reference script demonstrates deterministic polling. Production runtimes should prefer native event/future subscriptions when available.

## Workflow
Use `workflows/workflows.md`:

1. Observe current long-running tasks.
2. Baseline wait-only inference.
3. Diagnose fixed polling, invalid targets, or missing event integration.
4. Define expected reduction and detection SLA.
5. Integrate broker for one target class.
6. Re-measure the same workload.
7. If metrics do not improve, tune at most two bounded iterations.
8. Independently verify before broad rollout.

At runtime, the LLM exits the loop after launching a target. The broker owns passive waiting until a real wake condition exists.

## Skills
`skills/core-skills.md` provides executable procedures for:
- Wait-Only Baseline Profiling;
- Deterministic Wait Brokerage;
- Wait Regression Verification.

Each skill defines triggers, inputs, procedures, decisions, metrics, failure handling, verification, and stop conditions.

## Rules
`rules/engineering-rules.md` defines observable MUST / MUST NOT / SHOULD controls. The central rule is:

> Do not invoke the model solely because a timer expired while target state is unchanged.

## Subagents
Delegation is intentionally non-overlapping:
- **Performance Investigator** owns baseline evidence.
- **Runtime Implementer** owns broker integration.
- **Independent Verification Agent** owns the final release evidence.

The implementer is not the sole verifier.

## Hooks
`hooks/hooks.md` defines:
- pre-wait target validation;
- deterministic wait brokerage;
- post-wake freshness validation;
- metrics collection;
- release regression gating.

## Metrics
Primary metrics:
- wait-only model turns / total model turns;
- wait-only input tokens / total input tokens;
- wait/status tool calls per target;
- host polls per target;
- model re-entries avoided;
- completion-detection lag;
- missed terminal/cancellation events;
- invalid target count;
- broker error rate.

The default verification goal for qualifying long-running fixtures is at least **80% reduction** in wait-only model turns and wait-only input tokens, with zero missed terminal/cancellation events and detection lag within SLA.

## Verification
See `verification/verification-report.md`.

Run:

```bash
python -m unittest discover -s tests -v
python scripts/wait_metrics.py examples/sample-trace.jsonl
```

Static tests verify contracts; they do not prove production savings. Production status should be reported as:
- **Implemented** — broker and instrumentation exist;
- **Measured** — before/after telemetry exists;
- **Verified** — reduction, event coverage, cancellation, and detection SLA gates all pass under independent review.

## Safety
This package changes scheduling, not privileges.

It must not bypass:
- tool permission checks;
- human approval gates;
- sandbox restrictions;
- destructive-action protections;
- secret/data-output controls;
- cancellation authorization.

A model-free wait is safe only when the runtime still surfaces failures, cancellations, deadlines, and user input promptly.

## Failure handling
### Invalid/no-op target
Fail immediately; never enter a model/tool polling loop.

### Provider read failure
Retry in host code with a bounded retry count. After the threshold, emit `broker_error`.

### No state change for too long
Back off up to the configured maximum, then stop at `max_unchanged_polls` or `max_wait_seconds` and emit a deadline wake.

### Detection SLA regression
Rollback the changed policy/adapter. Do not compensate by reintroducing frequent model polling.

### Missed terminal/cancellation event
Block release and restore the last known-safe wait path until the provider/wake contract is corrected.

## Definition of Done
The topic is complete when:
- public evidence and current limitations are documented;
- a real workload baseline is captured;
- wait target/state semantics are documented;
- broker integration exists for at least one target class;
- tests pass;
- before/after metrics are collected;
- target wait-only inference reduction is met or an evidence-backed alternative threshold is approved;
- completion detection remains within SLA;
- terminal/failure/cancellation events are not missed;
- invalid targets fail once, not loop;
- rollback is available;
- independent verification is complete;
- no blocking correctness/security issue remains.

## Customization
Extend target adapters rather than changing the model-facing contract. Good target classes include:
- OS processes;
- CI jobs;
- test runners;
- build systems;
- remote deployments;
- subagents;
- batch data jobs;
- asynchronous API tasks.

For event-capable systems, replace polling with callbacks/futures while preserving the same wake schema and metrics. For non-numeric progress, use semantic milestones instead of arbitrary percentages.

## Scope note
This package addresses inference wasted on **passive waiting**. It does not replace progress guards for repeated active tool actions, cancellation guards for orphan processes, lifecycle join barriers, or idempotency controls for retried side effects. Those are separate failure classes.