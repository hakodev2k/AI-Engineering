# Testing and Production Parity Rules
## Purpose
Make pre-production database performance evidence predictive enough for safe decisions.
## Scope
Performance test environments, datasets, configuration, topology, and test execution.
## MUST
- Document material differences between test and production in data size, distribution, configuration, hardware, topology, and concurrency.
- Use representative data distributions and query parameters for critical performance tests.
- Test failure, contention, and peak conditions when they materially affect the target behavior.
## MUST NOT
- Present toy-data benchmarks as production evidence without explicit limitations.
- Copy sensitive production data into test systems without approved protection and governance.
## SHOULD
- Reproduce production plan and statistics characteristics without requiring exact infrastructure parity.
## Exceptions
Synthetic datasets are acceptable when they preserve the performance-relevant statistical properties.
## Verification
Inspect environment manifests, data profiles, workload generators, configuration diffs, privacy controls, and test reports.