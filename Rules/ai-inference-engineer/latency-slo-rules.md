# Latency SLO Rules

## Purpose
Maintain predictable inference latency using evidence from representative workloads.

## Scope
End-to-end latency, queueing, preprocessing, model execution, postprocessing, streaming first-token latency, and tail latency.

## MUST
- Production services MUST define measurable latency objectives for relevant workload classes.
- Latency MUST be decomposable into queue, preprocessing, execution, and postprocessing components where practical.
- Changes claiming latency improvement MUST include before/after measurements on target hardware.
- Tail latency MUST be evaluated under representative concurrency and input-size distributions.
- Streaming systems MUST distinguish time-to-first-token from inter-token latency and total completion time.

## MUST NOT
- MUST NOT report average latency alone when p95 or p99 behavior affects the SLO.
- MUST NOT improve benchmark latency by excluding realistic queueing or preprocessing costs without clearly labeling the scope.
- MUST NOT relax SLOs silently.

## SHOULD
- Segment latency by model version, hardware class, request size, and batching policy.
- Use controlled load tests before major capacity or scheduler changes.

## Exceptions
SLO changes require documented business impact, evidence, mitigation, and approval.

## Verification
Review benchmark methodology, dashboards, percentile metrics, load-test artifacts, and release gates.