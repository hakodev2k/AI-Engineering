# Memory Attribution Rules

- Performance investigation MUST establish a workload-matched baseline before claiming improvement.
- Monitoring MUST include the root process and its descendants when the host can spawn helpers/tools.
- Process executable/name MUST NOT be treated as proof of allocation origin.
- A single point-in-time RSS value MUST NOT be called a leak; growth requires repeated samples.
- Native/external memory SHOULD be investigated when RSS materially exceeds language heap metrics.
- Candidate and baseline SHOULD use comparable duration, workload, sampling interval and enabled integrations.
- The profiler MUST exclude processes outside the root lineage for each timestamp.
- Thresholds MUST be declared before interpreting the candidate run and MUST NOT be loosened merely to pass.
- Optimization success MUST include a post-change measurement.
- Retry/reproduction attempts MUST be bounded to two after the initial run.
- The verifier SHOULD be independent from the implementer for high-impact runtime changes.
