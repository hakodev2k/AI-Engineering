# Performance and Scale Rules

## Purpose
Ensure automation remains safe and predictable at production fleet size.

## Scope
Execution duration, controller load, device control-plane load, concurrency, memory, queues, and fleet scaling.

## MUST
- Scale-sensitive workflows MUST be tested or modeled at representative target counts before broad production use.
- Performance claims MUST be supported by before/after measurement under comparable conditions.
- Concurrency MUST be bounded by measured controller, network, external-service, and device capacity.
- Queues and worker pools MUST expose saturation and backlog signals.
- Large state collection MUST use pagination, streaming, batching, or bounded memory strategies where applicable.

## MUST NOT
- MUST NOT optimize by removing required safety validation without equivalent protection.
- MUST NOT assume faster parallel execution is safer when devices share control-plane or failure-domain constraints.
- MUST NOT claim scalability from small lab runs alone.

## SHOULD
- Rollout scheduling SHOULD avoid synchronized load spikes and respect maintenance windows.
- Performance tests SHOULD include degraded dependencies and slow devices.

## Exceptions
Temporary capacity overrides require measured headroom, bounded duration, monitoring, abort thresholds, and owner approval.

## Verification
Review benchmarks, fleet-size tests, concurrency settings, queue metrics, memory profiles, device CPU/control-plane telemetry, and abort behavior under saturation.