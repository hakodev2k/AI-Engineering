# Compiler Performance Rules

## Purpose
Control compile-time, memory, and generated-code performance with evidence.

## Scope
Compiler throughput, latency, peak memory, algorithmic complexity, and output performance.

## MUST
- Performance claims MUST include reproducible before/after measurements.
- Changes to hot compiler paths MUST consider asymptotic behavior and realistic input sizes.
- Generated-code performance work MUST preserve correctness and compare equivalent configurations.
- Regressions beyond project thresholds MUST be investigated before release.

## MUST NOT
- MUST NOT optimize compile time by skipping required correctness checks.
- MUST NOT benchmark only a favorable microcase when broad impact is claimed.
- MUST NOT hide performance regressions by changing benchmark inputs without review.

## SHOULD
- Benchmarks SHOULD include large real-world and adversarial inputs.
- Measurements SHOULD separate noise from statistically meaningful change.

## Exceptions
Accepted regressions require documented benefit, evidence, owner, and approval.

## Verification
Use benchmark suites, profiles, allocation metrics, time traces, generated-code benchmarks, and CI regression tracking.