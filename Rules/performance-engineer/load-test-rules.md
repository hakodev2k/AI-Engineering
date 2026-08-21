# Load Test Rules
## Purpose
Validate behavior under realistic concurrent demand.
## Scope
Load, stress, spike, soak, and capacity tests.
## MUST
- Model realistic request mix, concurrency, arrival patterns, data volume, and think time.
- Define pass/fail criteria and monitor dependent systems during tests.
- Separate load-generator saturation from system-under-test saturation.
## MUST NOT
- Run disruptive load against production without explicit approval and safeguards.
- Interpret synthetic traffic as representative when workload assumptions are unverified.
## SHOULD
- Include ramp-up, steady-state, and recovery phases.
## Exceptions
Simplified workloads require documented limitations.
## Verification
Review workload model, generator metrics, server telemetry, dependency telemetry, and test report.