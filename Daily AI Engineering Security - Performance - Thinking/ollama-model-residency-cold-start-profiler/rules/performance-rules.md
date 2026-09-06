# Performance Rules

- A baseline MUST be captured before changing keep-alive, preloading, scheduler, concurrency, or model settings.
- Cold and warm requests MUST be distinguished using observed load duration, not subjective user reports.
- A recommendation MUST report sample size, runtime version, model, configured keep-alive, and concurrency.
- A latency improvement MUST NOT be claimed from a single request.
- Candidate and baseline traces SHOULD use comparable workload and context-length distributions.
- A keep-alive increase MUST NOT be accepted if it causes unbounded or undocumented VRAM/RAM pressure.
- Unexpected eviction before configured expiry MUST be treated as a runtime/policy mismatch and SHOULD trigger version/regression investigation.
- Optimization retries MUST be bounded to three hypotheses per run.
- The verifier MUST reject results when sample size is below 20, required fields are missing, or more than 5% of durations are negative/invalid.
- Completion MUST distinguish Implemented, Measured, and Verified.
