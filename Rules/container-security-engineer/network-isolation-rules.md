# Network Isolation Rules

## Purpose
Limit container communication to required trust relationships and reduce lateral movement after compromise.

## Scope
Applies to ingress, egress, Kubernetes NetworkPolicy or equivalent controls, service-to-service paths, DNS, proxies, and external destinations.

## MUST
- Production namespaces or equivalent workload groups MUST have an explicit network-isolation strategy.
- Sensitive workloads MUST default-deny traffic where the platform supports enforceable network policy.
- Allowed ingress and egress MUST be limited to required sources, destinations, ports, and protocols.
- Internet egress from workloads handling sensitive data MUST be justified and controlled.
- Network policy changes MUST be validated against required application flows and prohibited flows.

## MUST NOT
- MUST NOT permit unrestricted east-west traffic merely because workloads share a cluster.
- MUST NOT allow broad egress as a default workaround for undocumented dependencies.
- MUST NOT assume service discovery or application authentication replaces network segmentation.

## SHOULD
- Separate administrative, data-plane, monitoring, and application traffic when the architecture warrants it.
- Observe denied and anomalous connections to improve policy without weakening it broadly.

## Exceptions
Exceptions require documented dependency, affected paths, exposure risk, compensating controls, owner, and approval.

## Verification
Inspect network policies, effective flow logs, connectivity tests, firewall rules, service dependencies, and denied-traffic telemetry.