# Vector Index Design

## Purpose
Ensure vector indexes meet retrieval, latency, memory, and operability requirements using measured evidence.

## Scope
Applies to ANN index selection, configuration, construction, rebuilds, and production changes.

## MUST
- Index algorithms and parameters MUST be selected against explicit recall, latency, throughput, memory, and build-time targets.
- Candidate configurations MUST be benchmarked on representative data and query distributions before production adoption.
- Index build inputs, embedding dimensions, distance metric, algorithm, parameters, and software version MUST be reproducible.
- Production index changes MUST define rollback or safe rebuild procedures.
- Capacity headroom MUST account for index growth, replicas, compaction, and rebuild operations.

## MUST NOT
- MUST NOT select index parameters solely from vendor defaults or synthetic microbenchmarks.
- MUST NOT claim an index is faster or more accurate without comparable measurements.
- MUST NOT perform an irreversible production index replacement without approved recovery steps.
- MUST NOT mix incompatible vector dimensions or metrics in one index contract.

## SHOULD
- Index tuning SHOULD optimize end-to-end retrieval objectives rather than isolated ANN latency.
- Multiple operating points SHOULD be retained when workloads require different recall/latency trade-offs.
- Rebuild procedures SHOULD be exercised before they are needed operationally.

## Exceptions
Exceptions require documented workload context, evidence, risk, alternatives considered, validation plan, and approval when production safety is affected.

## Verification
Review benchmark artifacts, index metadata, build manifests, capacity calculations, deployment diffs, rollback tests, and production latency/recall telemetry.