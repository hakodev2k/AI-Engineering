# Skill: First-Event Baselining

## Purpose
Establish reproducible headless latency evidence before diagnosing or changing an AI CLI/runtime.

## Trigger
Upgrade evaluation or a measured increase in non-interactive latency.

## Inputs
Fixed command, fixed stdin fixture, model/tool/schema settings, candidate version, baseline version, timeout and threshold policy.

## Preconditions
Use the same host class, authentication mode, region/network path where practical, prompt and environment for compared runs. Record unavoidable differences.

## Allowed tools
Shell/process runner, `scripts/measure_first_event.py`, version/checksum commands, read-only system diagnostics.

## Constraints
MUST NOT optimize before collecting a baseline. MUST NOT compare unlike prompts/models as if they were a version regression. MUST NOT hide failures by increasing timeout during the comparison.

## Procedure
1. Capture client/runtime version and benchmark fixture hash.
2. Run at least one warmup and five measured samples for the known baseline.
3. Repeat unchanged for the candidate.
4. Compare median and p95 first-byte latency plus failure rate.
5. If a regression exists, isolate binary startup separately from AI invocation and record the earliest changed milestone available.
6. Form one root-cause hypothesis at a time; alter only one relevant variable per diagnostic experiment.
7. Re-measure after any mitigation.

## Decision points
No material regression: continue normal verification. Regression above policy: block rollout and investigate or retain current version. High variance: increase sample count; do not average away timeouts.

## Expected output
Baseline JSON, candidate JSON, comparison verdict, environment notes and a bounded hypothesis list.

## Metrics
Median/p95 first-byte and total latency, failure rate, regression ratios.

## Verification
A separate reviewer confirms fixture equality, sample sufficiency and threshold application.

## Failure handling
On provider/network outage, mark the benchmark invalid and retain raw samples. Maximum two benchmark retries after confirming the environment is healthy.

## Stop conditions
Stop when the upgrade passes configured thresholds or when a reproducible blocking regression is documented with no safe mitigation in two diagnostic iterations.
