# Container Runtime Rules

## Purpose
Establish safe runtime requirements for containerized workloads on the platform.

## Scope
Applies to container images, runtime configuration, resource limits, health checks, filesystem access, and workload execution.

## MUST
- Workloads MUST define resource requests/limits or equivalent capacity controls appropriate to the platform.
- Containers MUST run with the least privileges required.
- Health checks MUST represent meaningful workload readiness and liveness conditions.
- Images MUST be traceable to source and build provenance.

## MUST NOT
- MUST NOT run privileged containers by default.
- MUST NOT use mutable production image tags without immutable resolution.
- MUST NOT depend on local ephemeral state for durable data.

## SHOULD
- Prefer minimal, maintained base images.
- Prefer read-only filesystems where workloads permit.

## Exceptions
Elevated runtime privileges require explicit threat assessment, narrow scope, approval, and compensating controls.

## Verification
Use admission policy, image metadata, runtime security scans, configuration review, deployment tests, and resource telemetry.