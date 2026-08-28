# Inference Serving Rules

## Purpose
Maintain predictable, safe, and efficient model serving.

## Scope
Applies to online inference, model servers, batching, autoscaling, routing, and runtime configuration.

## MUST
- Serving systems MUST define latency, availability, throughput, and error objectives.
- Model versions and runtime configurations MUST be traceable for every production deployment.
- Autoscaling MUST account for cold start, model load time, and accelerator saturation.
- Request admission and overload behavior MUST be explicit.

## MUST NOT
- MUST NOT deploy a model runtime without representative load validation.
- MUST NOT allow unbounded queues to hide overload.
- MUST NOT change batching or quantization settings without accuracy and latency evidence.

## SHOULD
- Capacity models SHOULD separate steady-state and burst traffic.
- Rollouts SHOULD use canary or staged exposure for material changes.

## Exceptions
Exceptions require documented risk, evidence, rollback, and approval.

## Verification
Review load tests, SLO dashboards, deployment metadata, autoscaling behavior, model-version records, and rollback tests.