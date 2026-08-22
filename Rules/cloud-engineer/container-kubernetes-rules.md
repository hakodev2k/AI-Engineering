# Container and Kubernetes Rules
## Purpose
Operate containerized cloud workloads with controlled security and reliability.
## Scope
Images, registries, orchestration, Kubernetes clusters, workloads, policies, and runtime configuration.
## MUST
- Images MUST originate from trusted sources and be scanned for relevant vulnerabilities before production promotion.
- Workloads MUST define appropriate resource requests, limits, health behavior, and identity boundaries where applicable.
- Cluster and workload changes affecting production MUST be version-controlled and recoverable.
## MUST NOT
- MUST NOT run privileged containers or broad host access without documented necessity and approval.
- MUST NOT rely on mutable image tags for reproducible production deployment.
## SHOULD
- Minimize image contents and runtime privileges.
## Exceptions
Exceptions require threat/risk analysis, compensating controls, duration, and approval.
## Verification
Inspect manifests, admission policies, image digests, scans, RBAC, runtime settings, resource metrics, and deployment history.