# Throughput and Capacity Rules
## Purpose
Establish sustainable service capacity with known headroom.
## Scope
Request rates, jobs, messages, storage operations, and resource ceilings.
## MUST
- Identify saturation points and the resource limiting throughput.
- Measure sustainable throughput separately from short-lived peak throughput.
- Maintain explicit headroom for expected variance and failure scenarios.
## MUST NOT
- Publish capacity numbers without workload and resource assumptions.
- Equate maximum observed throughput with safe operating capacity.
## SHOULD
- Revalidate capacity after material architecture, workload, or infrastructure changes.
## Exceptions
Provisional estimates MUST be labeled and replaced with measured evidence before critical planning.
## Verification
Review saturation curves, utilization, queue growth, error rates, and capacity model assumptions.