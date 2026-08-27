# Kubernetes Incident Response

## Purpose
Contain, investigate, eradicate, and recover from Kubernetes security incidents while preserving evidence and cluster integrity.

## When to use
Use for suspected credential theft, malicious pods, cryptomining, escape, persistence, unauthorized API actions, or supply-chain compromise.

## Inputs
Alert/incident description, audit/runtime/cloud logs, cluster state, image digests, identities, network telemetry, and response authority.

## Preconditions
Establish incident command, evidence retention, and production-change authorization.

## Context to inspect
Inspect affected pods/nodes/namespaces, service accounts, RBAC changes, secrets access, exec events, image provenance, admission changes, DaemonSets/operators, webhooks, and cloud identity use.

## Core knowledge
Deleting a pod may destroy evidence without removing persistence. Kubernetes incidents often cross cluster, cloud IAM, registry, CI/CD, and node boundaries.

## Procedure
1. Validate signal and establish timeline.
2. Preserve relevant logs/configuration/artifact metadata.
3. Identify compromised identities and blast radius.
4. Contain network/identity/workload access proportionally.
5. Search for persistence and lateral movement.
6. Rotate/revoke exposed credentials.
7. Remove malicious artifacts and fix root cause.
8. Rebuild compromised nodes/workloads from trusted sources when appropriate.
9. Verify controls and monitor recurrence.
10. Produce lessons and durable remediations.

## Decision points
Isolate rather than terminate when evidence value is high and risk can be contained. Rebuild nodes after credible host compromise rather than trusting cleanup alone.

## Common failure patterns
Deleting evidence; rotating only one credential; missing cloud/CI scope; restoring vulnerable manifests; declaring recovery before persistence search.

## Verification
Confirm unauthorized access paths are closed, credentials revoked, trusted artifacts redeployed, persistence absent, and monitoring stable.

## Expected output
Evidence-backed timeline, containment, eradication, recovery, and corrective actions.

## Stop conditions
Escalate immediately for control-plane/etcd compromise, uncertain host integrity, or cross-environment credential exposure.