# Service Demand Model Rules
## Purpose
Translate business and product demand into resource demand.
## Scope
Request rates, concurrency, data volume, CPU, memory, storage, IOPS, bandwidth, and downstream load.
## MUST
- Each critical service MUST define measurable demand drivers and resource conversion factors.
- Models MUST identify nonlinear thresholds and dependencies that can invalidate simple ratios.
- Conversion factors MUST be refreshed from representative production or benchmark evidence.
## MUST NOT
- MUST NOT assume traffic growth maps linearly to every resource.
- MUST NOT hide dependency amplification such as fan-out or retries.
## SHOULD
- Models SHOULD expose sensitivity to the most uncertain conversion factors.
## Exceptions
Alternative models require rationale and validation evidence.
## Verification
Compare modeled resource demand with telemetry at multiple load levels and investigate residual error.