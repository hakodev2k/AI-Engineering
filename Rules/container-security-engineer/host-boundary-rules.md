# Host Boundary Rules

## Purpose
Protect container hosts from workload compromise and reduce paths from a compromised container to node-level control.

## Scope
Applies to container runtimes, host namespaces, device access, runtime sockets, kernel exposure, node services, and host-mounted resources.

## MUST
- Container workloads MUST be prevented from accessing runtime control sockets unless that access is explicitly required and approved.
- Host namespace sharing MUST be limited to workloads with a documented host-level function.
- Node services exposed to containers MUST require authentication and least-privilege authorization where supported.
- Container hosts MUST receive security updates according to risk and workload criticality.
- High-risk node agents MUST be isolated and reviewed as privileged infrastructure components.

## MUST NOT
- MUST NOT expose Docker, containerd, CRI, or equivalent control sockets to ordinary application containers.
- MUST NOT assume container isolation protects an unpatched vulnerable host kernel.
- MUST NOT grant device or host filesystem access without evaluating whether it creates a host-escape path.

## SHOULD
- Separate high-risk privileged workloads onto dedicated nodes or stronger isolation boundaries.
- Use sandboxed runtimes or virtualized isolation where threat models justify the overhead.

## Exceptions
Exceptions require documented host-level need, attack-path analysis, compensating controls, monitoring, and explicit approval.

## Verification
Inspect runtime socket mounts, namespace settings, node exposure, patch status, privileged daemonsets, and host security telemetry.