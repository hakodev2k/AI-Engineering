# Workload Characterization Rules
## Purpose
Ensure database performance work starts from representative demand rather than intuition.
## Scope
Production and pre-production database workloads, capacity tests, and tuning investigations.
## MUST
- Baseline request mix, concurrency, data volume, read/write ratio, latency distribution, and peak behavior before material tuning.
- Identify critical business transactions and their measurable service objectives.
- Record the observation window and known workload anomalies.
## MUST NOT
- Extrapolate steady-state results to burst or batch workloads without evidence.
- Treat a single average metric as representative of a multi-modal workload.
## SHOULD
- Maintain reproducible workload profiles for important systems.
## Exceptions
Emergency mitigation may proceed with incomplete characterization when delay increases impact; assumptions, risk, and follow-up validation MUST be recorded.
## Verification
Review workload captures, query telemetry, concurrency measurements, data-size evidence, and documented SLOs.