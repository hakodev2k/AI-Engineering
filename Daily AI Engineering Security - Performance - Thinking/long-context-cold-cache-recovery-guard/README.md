# Long-Context Cold-Cache Recovery Guard

**Category:** Token

Long agent sessions can become unrecoverable when live context has crossed a provider's ordinary context boundary and the prompt cache later goes cold. In that state, a normal turn may fail on a large uncached request and `/compact` may fail for the same reason because compaction itself must ingest the oversized history.

## Problem and evidence

The package addresses a current failure mode reported in Claude Code long-context sessions: sessions above the standard 200k boundary can repeatedly fail with `ECONNRESET` once cache reuse disappears, including attempts to compact; separate 2026 reports show compaction hangs while consuming very large token volumes and long-context cap/accounting can be misresolved on non-first-party providers. See `evidence/research.md`.

Existing approaches rely on reactive compaction, provider retry, cache reuse, or manual `/clear`. Those are insufficient when recovery itself needs the same oversized uncached request.

## Proposed improvement

Treat long-context recovery as a preflight control rather than an emergency action. The guard measures context occupancy, reserve, cache health, and recent transport failures before another expensive turn. It selects `allow`, `compact`, `export-and-fork`, or `block`. It never deletes required context automatically.

## Architecture

```text
.
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/pre-request-context-health.md
├── rules/context-recovery-rules.md
├── scripts/context_recovery_guard.py
├── skills/cold-cache-context-triage.md
├── subagents/context-recovery-reviewer.md
├── tests/test_context_recovery_guard.py
└── workflows/proactive-evacuation.md
```

## Installation

Requires Python 3.10+ and only the standard library. Copy the directory intact.

## Usage

```bash
python scripts/context_recovery_guard.py telemetry.json --policy config/policy.json
```

Exit codes: `0` allow, `10` compact, `20` export-and-fork, `30` block, `2` invalid input/configuration.

## Workflow

Run the pre-request hook before high-cost model turns, then follow the proactive evacuation workflow. When evacuation is selected, persist a compact evidence/state artifact outside the model transcript and start a fresh session only after verifying that required task state is captured.

## Metrics

Measure tokens/task, live context tokens, cache hit ratio, cache age, failed oversized requests, recovery latency, retries avoided, cost/task, and post-recovery quality/regression rate. Do not claim improvement without before/after data.

## Safety

The guard MUST NOT lower security controls or discard correctness-critical context. `export-and-fork` preserves required goals, facts, decisions, pending operations, approvals, file/workspace state, and verification status before creating a fresh context. Human approval is required before abandoning a session that owns uncommitted or irreversible side effects.

## Verification

```bash
python -m unittest tests/test_context_recovery_guard.py
```

Verification requires deterministic classification, the oversized cold-cache transport-failure fixture to choose `export-and-fork`, and healthy contexts to remain `allow`.

## Failure handling

Malformed telemetry blocks optimization with exit `2`. Missing cache information is treated conservatively; it never proves cache health. Retry analysis at most twice after collecting fresh telemetry. If state cannot be exported safely, stop rather than clearing context.

## Definition of Done

Implemented: guard, policy, workflow, hook, rules, reviewer, and tests exist. Measured: baseline and post-change token/latency/retry metrics are captured. Verified: tests pass, required context is preserved, retries are bounded, and recovery reduces failed oversized requests without increasing correctness regressions.