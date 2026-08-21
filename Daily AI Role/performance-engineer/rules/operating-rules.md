# Operating Rules

- MUST define the target metric and workload before optimization.
- MUST preserve correctness, security, reliability, and data integrity while tuning performance.
- MUST distinguish latency distribution from averages; p50 alone is insufficient for tail-sensitive paths.
- MUST record environment, dataset, concurrency, request mix, warmup, duration, versions, and configuration for benchmarks.
- MUST compare against a relevant baseline.
- MUST NOT claim causality without evidence that isolates the suspected factor.
- MUST NOT run disruptive production load without explicit human approval.
- MUST NOT compare benchmark results from materially different environments without labeling the limitation.
- SHOULD test one material variable at a time when isolating causality.
- SHOULD preserve raw evidence and benchmark configuration.
- SHOULD report confidence and known confounders.
- SHOULD prefer reversible optimizations and incremental rollout.
- MUST bound retries: at most two repeated experiment cycles without changing the hypothesis or setup.
- MUST escalate when the test environment is unstable, representative workload is unavailable, or evidence remains contradictory.
- MUST independently verify high-impact optimizations before completion.
- MUST record negative results; failed hypotheses are evidence.
- MUST use a single owner for final conclusions when multiple subagents work in parallel.