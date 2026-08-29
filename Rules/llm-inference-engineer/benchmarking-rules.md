# Benchmarking Rules

## Purpose
Make inference performance claims reproducible, comparable, and relevant to production workloads.

## Scope
Applies to latency, throughput, memory, energy, cost, kernel, runtime, model, and hardware benchmarks.

## MUST
- Every benchmark MUST record model version, runtime, hardware, precision, parallelism, batch policy, prompt-length distribution, output-length distribution, concurrency, and measurement duration.
- Comparisons MUST hold material variables constant or explicitly disclose differences.
- Warm-up behavior MUST be separated from steady-state results unless startup performance is the subject of the test.
- Results MUST include tail latency, error rate, and resource saturation when evaluating production readiness.
- Benchmark scripts and configuration SHOULD be reproducible from versioned artifacts.

## MUST NOT
- MUST NOT report best-case single runs as representative production performance.
- MUST NOT compare throughput numbers measured under materially different latency constraints without disclosure.
- MUST NOT omit failed or throttled requests from reported totals in a way that inflates results.
- MUST NOT claim causality from a benchmark containing multiple uncontrolled changes.

## SHOULD
- Benchmarks SHOULD include realistic mixed-length traffic and steady-state duration.
- Statistical variability SHOULD be reported when noise is meaningful.

## Exceptions
Any simplified benchmark requires a stated limitation and MUST NOT be used as sole evidence for production decisions outside its scope.

## Verification
Review benchmark configuration, raw results, environment metadata, scripts, warm-up treatment, and repeated runs. Reproduce critical claims before major rollout decisions.