# Cloud and Container Application Security Rules

## Purpose
Ensure application deployments preserve security boundaries across cloud identity, network, container, and managed-service configuration.

## Scope
Applies where application teams define or influence cloud resources, containers, workload identities, ingress/egress, and runtime configuration.

## MUST
- Workload identities MUST be scoped to the minimum resources and actions required by the application.
- Internet exposure, ingress, egress, and administrative endpoints MUST be intentional and reviewable.
- Container images MUST use maintained bases, minimize unnecessary packages/tools, and avoid embedded credentials.
- Applications MUST not depend on mutable local container state for security-critical persistence unless explicitly designed for it.
- Cloud metadata, instance credentials, internal control planes, and privileged service endpoints MUST be protected from attacker-controlled server-side requests.
- Security-relevant infrastructure configuration MUST be versioned or otherwise reviewable and tested where practical.

## MUST NOT
- MUST NOT run application containers as privileged or with broad host access without a documented requirement and approval.
- MUST NOT expose databases, queues, admin consoles, or debug endpoints publicly by default.
- MUST NOT grant wildcard cloud permissions merely to resolve authorization failures.

## SHOULD
- SHOULD use read-only filesystems, dropped capabilities, non-root execution, and network restrictions where compatible.
- SHOULD separate workloads and identities by trust boundary and environment.

## Exceptions
Exceptions require threat analysis, least-privilege alternative considered, compensating controls, duration, and accountable approval.

## Verification
Inspect IAM policies, infrastructure code, image scans, runtime security context, network rules, public exposure, SSRF protections, and deployment configuration.