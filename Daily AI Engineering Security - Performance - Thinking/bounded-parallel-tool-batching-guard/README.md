# Bounded Parallel Tool Batching Guard

A guidance package for reducing avoidable agent turns, latency, and token use by batching only tool calls that are already justified, independent, non-conflicting, and safe to execute concurrently.

## Status

This is a reference-only package. It contains no executable runtime integration and requires no installation. The host agent or orchestration platform must provide tool-call telemetry, concurrency primitives, permission enforcement, and cancellation behavior.

## Contents

```text
bounded-parallel-tool-batching-guard/
├── README.md
├── evidence/research.md
├── rules/batching-safety.md
├── skills/batching-analysis.md
└── templates/batch-plan.md
```

## When to use

Use this guard for read-heavy workflows with repeated searches, metadata reads, independent API lookups, or other static calls where outer model/tool cycles dominate cost or latency. Keep execution sequential when results are adaptive, writes can conflict, an approval or wait boundary exists, or one call determines whether the next call is necessary.

## Adoption workflow

1. Read the evidence and define a comparable baseline workload.
2. Apply `rules/batching-safety.md` as the non-negotiable eligibility policy.
3. Follow `skills/batching-analysis.md` to classify calls and build bounded stages.
4. Record the plan and measurements with `templates/batch-plan.md`.
5. Compare outer cycles, calls, tokens, latency, errors, and task coverage.
6. Accept the change only when coverage is unchanged or improved and no security, permission, cancellation, or reliability boundary is weakened.

## Integration requirements

The runtime must preserve a result for every batched call, correlate outputs to inputs, propagate cancellation, expose partial failures, and bound concurrency. Prefer all-settled behavior when partial results remain useful. Do not batch approval requests, destructive operations, waits, resumptions, or mutations against the same resource.

## Verification

A valid evaluation contains the fixed task and environment, baseline and optimized measurements, eligibility rationale for every call, coverage comparison, failures, retry count, and accept/reject decision. Stop after two unsuccessful optimization attempts.
