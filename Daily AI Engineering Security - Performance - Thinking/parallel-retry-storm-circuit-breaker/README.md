# Parallel Retry Storm Circuit Breaker

**Category:** Performance  
**Run date:** 2026-09-06 (UTC+7)

## Problem
Parallel agent fan-out can amplify shared 429/5xx pressure into synchronized retries, excessive model/tool calls, large token waste, and total-run loss. The opposite configuration—too little retry—can also abort useful long-running workflows on transient throttling.

## Evidence
See `evidence/research.md` for current public reports, existing approaches, remaining limitations, root-cause analysis, and direct source links. Observed evidence, interpretation, and proposed solution are separated.

## Existing approach
Common controls include SDK exponential backoff, `Retry-After`, fixed retry counts, provider cooldown, sequential fallback, hard agent/iteration caps, queues, and manual reruns.

## Existing limitations
Per-call retry policies do not coordinate shared provider pressure across parallel branches. Concurrency may remain high after correlated throttling; zero-delay retry headers may create hot loops; hidden fixed retry budgets can be too small; and aggregate failure can discard successful partial work.

## Proposed improvement
Add a workflow-level circuit breaker with finite global and per-branch retry budgets, a nonzero delay floor plus jitter, correlated-failure detection, adaptive concurrency, half-open probes, and partial-result checkpoints.

## Actual package tree
```text
parallel-retry-storm-circuit-breaker/
├── README.md
├── evidence/research.md
├── skills/retry-pressure-analysis.md
├── rules/retry-performance.md
├── subagents/benchmark-verifier.md
├── workflows/measure-adapt-verify.md
├── hooks/post-failure-pressure.md
├── scripts/retry_storm_guard.py
├── config/circuit.example.json
├── examples/throttled-events.jsonl
└── tests/test_retry_storm_guard.py
```

## Installation
Python 3.10+; standard library only.

## Configuration
Copy `config/circuit.example.json` and set a workload/provider-appropriate event window, retryable-failure threshold, global attempt budget, failure ratio, minimum retry delay, and half-open probe concurrency. Provider quotas and `Retry-After` remain authoritative constraints; the configured minimum prevents zero-delay hot loops.

## Usage
```bash
python scripts/retry_storm_guard.py --config config/circuit.example.json --events examples/throttled-events.jsonl
python -m unittest tests/test_retry_storm_guard.py
```
Exit 0 = CLOSED, 3 = HALF_OPEN/restrict concurrency, 4 = OPEN/stop new automatic retries, 1 = invalid input/configuration.

## Workflow
Measure -> diagnose correlated pressure -> form hypothesis -> adapt circuit/concurrency -> replay -> measure again -> preserve partial outputs -> independently verify. See `workflows/measure-adapt-verify.md`.

## Metrics
Requests/sec; active concurrency; retries/task; model/tool calls/task; tokens/task; wasted-token ratio; 429/5xx rate; useful-result rate; partial-results preserved; recovery rate; latency; throughput; cost/task.

## Verification
**Implemented:** executable circuit evaluator, rules, hook, workflow, fixture, tests, and independent verifier instructions exist.  
**Measured:** integration must compare baseline and guarded traces on the same workload/dependency conditions.  
**Verified:** throttling fixtures open/reduce pressure within configured bounds, zero-delay retry does not hot-loop, healthy workloads retain allowed parallelism, partial successful outputs survive aggregate failure, and useful-output efficiency meets acceptance criteria.

## Safety
Never bypass provider rate limits, authentication, authorization, or data-security controls to increase throughput. Non-retryable security/validation failures remain terminal for the branch. Dangerous downstream actions still require their normal approval policy.

## Failure handling
Detection: circuit OPEN, global budget exhaustion, retry-delay-floor violations, or benchmark regression. Evidence: timestamped event trace and before/after metrics. Retry policy: finite branch/workflow budgets; optimization may iterate at most twice. Fallback: preserve completed branch results and use bounded sequential/reduced-concurrency execution when appropriate. Escalation: platform/dependency owner. Stop condition: dependency remains unhealthy after bounded half-open probes or second optimization attempt fails.

## Definition of Done
Evidence documented; baseline captured; failure classes identified; retry/concurrency control implemented; deterministic tests pass; before/after calls/tokens/latency/throughput captured; partial results preserved; provider limits honored; Benchmark Verifier reports PASS; no blocking issue remains.

## Customization
Extend retryable error classification and event fields for a specific provider, and wire real concurrency reduction/cooldown into orchestration. Preserve finite budgets, nonzero delay, correlated-pressure handling, and comparable measurement.