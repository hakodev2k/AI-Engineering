# GPU Inference Workload Rules

## Purpose
Protect latency, throughput, availability, and cost objectives for production inference running on shared GPU infrastructure.

## Scope
Applies to online and batch inference, model serving, batching, replicas, accelerator placement, warmup, autoscaling, and failover.

## MUST
- Inference capacity MUST be sized from measured request patterns, model memory, batch behavior, latency objectives, and failure headroom.
- Serving changes MUST be validated for tail latency, throughput, error rate, memory use, and startup or model-load behavior.
- Autoscaling signals MUST reflect workload demand and accelerator saturation rather than CPU metrics alone when GPU resources are the limiting factor.
- Critical inference services MUST define behavior for accelerator loss, node loss, and capacity exhaustion.
- Model and runtime placement MUST respect hardware compatibility and required numerical behavior.

## MUST NOT
- Average latency MUST NOT be used alone to claim service-objective compliance when tail latency is material.
- Aggressive batching MUST NOT violate request latency or isolation requirements merely to increase utilization.
- Production traffic MUST NOT be moved to a new accelerator generation without representative validation.

## SHOULD
- Warm capacity SHOULD be maintained where cold-start or model-load time threatens availability objectives.
- Utilization tuning SHOULD consider latency and queue depth together.

## Exceptions
Exceptions require documented service impact, measurement evidence, bounded duration, and owner approval.

## Verification
Review load tests, latency distributions, scaling events, model-load metrics, failover tests, utilization traces, and production SLO evidence.