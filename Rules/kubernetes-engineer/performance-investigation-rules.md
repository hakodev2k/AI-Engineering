# Performance Investigation Rules
## Purpose
Diagnose Kubernetes performance problems from evidence across application and platform layers.
## Scope
Latency, throughput, CPU, memory, scheduling, networking, storage, and control-plane effects.
## MUST
- Establish a reproducible symptom, time window, baseline, and affected scope before broad tuning.
- Correlate workload metrics with node, scheduler, network, storage, and dependency evidence where relevant.
- Measure before and after material performance changes under comparable conditions.
- Distinguish resource saturation from application inefficiency and downstream latency.
## MUST NOT
- Claim Kubernetes is the root cause solely because an application runs in Kubernetes.
- Apply cluster-wide tuning from a single unverified hypothesis.
## SHOULD
- Change one major variable at a time during controlled experiments.
## Exceptions
Urgent mitigations may precede complete diagnosis when reversible and monitored.
## Verification
Review benchmark/load-test results, traces, metrics, events, profiles where available, and documented comparison methodology.