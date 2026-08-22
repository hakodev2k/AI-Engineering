# Container and Kubernetes Rules
## Purpose
Operate ECS and EKS workloads with controlled supply chain, isolation, and lifecycle behavior.
## Scope
ECS, EKS, ECR, task definitions, pods, nodes, images, scheduling, and upgrades.
## MUST
- Use immutable image references for controlled releases and scan images for known critical vulnerabilities.
- Define resource requests or limits and health behavior appropriate to the scheduler.
- Separate workload permissions using task or pod identities rather than node-wide credentials where supported.
- Test cluster, node, runtime, and add-on upgrades before production rollout.
## MUST NOT
- Run privileged containers without documented necessity and security approval.
- Place secrets directly in container images or task definitions as plaintext.
## SHOULD
- Minimize image size and attack surface and automate patch cadence.
## Exceptions
Exceptions require threat analysis, owner, duration, compensating controls, and approval.
## Verification
Inspect image digests, scan results, IAM bindings, workload specs, resource settings, upgrade tests, and runtime security evidence.