# Workflow — Benchmark, Diagnose, Optimize, Verify

## Trigger
Lifecycle/memory alert, SDK serving change, stateless factory optimization, or suspected delayed close failure.

## Goal
Improve measurable serving performance without unsafe server/transport reuse and detect delayed lifecycle regressions before release.

## Inputs
Serving code, representative workload, `config/thresholds.json`, baseline environment, and `evidence/research.md`.

## Baseline
Collect warmup plus measured requests with server identity, heap samples, latency, success/failure, and an explicit teardown record. Capture Node version, SDK version, concurrency, CPU/memory limits, and request fixture.

## Context
Fresh server lifetime is an isolation requirement in the documented stateless serving model. Reuse safe dependencies, not protocol-bearing request/session objects.

## Stages
1. **Observe** — map server factory and lifecycle callbacks.
2. **Measure baseline** — collect JSONL metrics and teardown evidence.
3. **Diagnose** — analyze duplicate identities, heap slope, p95, errors, teardown.
4. **Form hypothesis** — identify construction hotspots or retained lifecycle owners.
5. **Implement improvement** — move safe pools/caches/config outside the factory, remove accidental singleton capture, or add fail-fast fresh-factory guard.
6. **Measure again** — exact workload/environment where feasible.
7. **Improved?** — compare analyzer outputs. If no, re-evaluate with a new evidence-backed hypothesis.
8. **Verify** — independent verifier confirms thresholds and isolation.

## Responsible agent
Performance investigator/implementer owns stages 1–7. `subagents/performance-verifier.md` owns final verification.

## Tools
Load generator, process/heap metrics, instrumentation, `scripts/analyze_lifecycle.py`, `scripts/fresh_factory_guard.mjs`, source inspection.

## Outputs
Baseline report, diagnosis, implementation change, after report, teardown evidence, independent verification status.

## Checkpoints
- C1 documented lifecycle matches SDK guidance.
- C2 baseline reaches required measured volume.
- C3 duplicate identity count known.
- C4 after-run thresholds pass.
- C5 explicit teardown passes.
- C6 independent verifier returns `verified`.

## Metrics
Heap growth MB/1k requests, p95 latency regression, error rate, duplicate server identities, clean teardown, and optionally throughput.

## Retry policy
Maximum two correction cycles. Benchmark noise may justify at most two reruns, but previous failed evidence remains part of the record.

## Stop conditions
Complete only at C1–C6. Stop and escalate when retries are exhausted, lifecycle requirements are unclear, teardown remains nondeterministic, or an optimization requires weakening isolation/security.

## Failure path
Preserve metrics/logs, identify the first failing threshold, collect a heap snapshot or lifecycle ownership evidence, and form one new hypothesis before retrying.

## Verification
Verifier checks workload equivalence, analyzer inputs, actual factory identity behavior, teardown, and safety boundaries.

## Definition of Done
Implemented: safe lifecycle change exists. Measured: comparable before/after evidence exists. Verified: thresholds and teardown pass under independent review.