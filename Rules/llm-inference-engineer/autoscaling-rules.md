# Autoscaling Rules

## Purpose
Scale inference capacity safely despite expensive startup, model-loading delays, and bursty token workloads.

## Scope
Applies to horizontal and vertical scaling, replica counts, warm pools, scaling signals, cooldowns, and model-loading behavior.

## MUST
- Autoscaling signals MUST reflect actual serving pressure such as queue depth, token rate, latency, or resource saturation.
- Scale-up logic MUST account for model download and initialization time.
- Scale-down MUST preserve sufficient headroom for expected bursts and in-flight requests.
- Minimum capacity MUST be defined for critical models and traffic classes.
- Autoscaling changes MUST be validated under burst, sustained, and recovery scenarios.

## MUST NOT
- MUST NOT scale solely from CPU utilization when accelerators or queues are the bottleneck.
- MUST NOT terminate workers with in-flight requests unless graceful draining or equivalent safety exists.
- MUST NOT rely on cold starts that exceed published SLOs without an explicit degraded-mode plan.

## SHOULD
- Warm capacity SHOULD be maintained when startup latency is materially longer than acceptable request latency.
- Different models SHOULD use independent scaling policies when their resource profiles differ substantially.

## Exceptions
Exceptions require documented workload evidence, user impact, operational mitigation, and approval if availability risk increases.

## Verification
Review scaling policies, startup telemetry, load-test results, drain behavior, minimum replica configuration, and production scaling events.