# Network Policy Rules
## Purpose
Limit lateral movement and make workload communication intentional.
## Scope
Ingress, egress, NetworkPolicy, CNI policy, DNS, and external destinations.
## MUST
- Define allowed communication paths for sensitive or production namespaces.
- Apply default-deny posture where the networking implementation and workload model support it.
- Explicitly permit required DNS, telemetry, control-plane, and external dependencies.
- Validate policy behavior before enforcing changes broadly.
## MUST NOT
- Open unrestricted ingress or egress merely to bypass troubleshooting.
- Assume NetworkPolicy is enforced without verifying CNI support.
## SHOULD
- Model policy from observed and documented dependency flows.
## Exceptions
Temporary broad access requires owner, expiry, monitoring, and follow-up restriction.
## Verification
Inspect policies and CNI capabilities; run connectivity tests for allowed and denied paths; review flow logs where available.