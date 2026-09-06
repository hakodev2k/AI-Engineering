# Performance and Quality Regression Gates

## Purpose
Prevent inference optimizations from shipping latency, throughput, memory, cost, or model-quality regressions by enforcing measurable release gates.

## When to use
Use in CI/CD or release qualification for model, runtime, kernel, compiler, driver, quantization, and serving-configuration changes.

## Inputs
Reference build, candidate build, benchmark workloads, quality evaluations, SLO thresholds, statistical tolerance, and release policy.

## Context to inspect
Inspect model hashes, runtime/compiler versions, hardware identity, benchmark variance, evaluation slices, decoding parameters, warmup state, and historical performance data.

## Core knowledge
Performance results are noisy and must be compared under controlled conditions. A speedup that changes model behavior is not equivalent optimization. Gates should distinguish hard safety/SLO failures from small statistical variance and should test critical workload slices rather than one aggregate score.

## Procedure
1. Freeze reference and candidate configurations.
2. Run identical representative performance cohorts.
3. Measure latency percentiles, throughput, memory, and unit cost.
4. Run quality evaluations using identical prompts and decoding policy where determinism permits.
5. Compare critical task and long-context slices separately.
6. Quantify run-to-run variance before setting thresholds.
7. Define hard-block, warning, and informational regressions.
8. Require investigation for unexplained improvements as well as regressions.
9. Store benchmark metadata and artifacts for later comparison.
10. Gate release only on reproducible evidence.

## Decision points
Use relative thresholds for stable metrics and absolute SLO gates for user-facing limits. Require stricter quality protection for high-stakes workloads than for low-risk generation.

## Common failure patterns
Running reference and candidate on different hardware, ignoring variance, changing multiple decoding settings, using tiny benchmark sets, and accepting throughput gains with p99 regressions.

## Verification
Re-run failed or borderline comparisons and confirm the same outcome. Verify candidate configuration metadata exactly matches what will be deployed.

## Expected output
Automatable release gates plus a regression report with reproducible evidence.

## Stop conditions
Stop when benchmark environments are not comparable, evaluation data is invalid, or the candidate cannot be identified reproducibly.