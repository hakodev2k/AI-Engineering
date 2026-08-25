# Container and Kubernetes Security

## Purpose
Reduce image, runtime, orchestration, and cluster attack surface in cloud environments.

## Scope
Container images, registries, clusters, nodes, workloads, admission controls, and runtime privileges.

## MUST
- Images MUST come from trusted sources and be scanned for relevant vulnerabilities before promotion.
- Workloads MUST run with the minimum filesystem, Linux capability, host, network, and cloud identity privileges required.
- Cluster administrative access MUST be strongly authenticated, least-privilege, and audited.
- High-risk admission or runtime security exceptions MUST be reviewed before production use.

## MUST NOT
- MUST NOT run privileged containers or mount sensitive host paths without documented necessity and approval.
- MUST NOT embed cloud credentials or secrets in images.
- MUST NOT expose orchestration control planes unnecessarily.

## SHOULD
- Prefer immutable images, non-root execution, signed artifacts, and enforceable admission policy.

## Exceptions
Require workload-specific reason, threat impact, compensating controls, duration, and approval.

## Verification
Inspect manifests, effective security contexts, IAM bindings, registry provenance, scan results, admission policies, cluster audit logs, and exposure.