# Container and Kubernetes Testing Rules

## Purpose
Assess containerized workloads and orchestration boundaries without destabilizing shared clusters.

## Scope
Covers images, registries, workload identities, admission controls, RBAC, secrets, namespaces, nodes, network policy, and cluster APIs.

## MUST
- MUST identify cluster ownership, namespaces, node boundaries, workload criticality, and shared-tenant constraints before active testing.
- MUST test RBAC and workload identity from explicitly authorized principals.
- MUST validate container escape or node-impact hypotheses using the least invasive method sufficient to establish risk.
- MUST track every pod, job, service account, secret, image, or other resource created during testing and remove it.
- MUST treat cluster credentials and secret objects as sensitive even when obtained through an authorized path.

## MUST NOT
- MUST NOT drain nodes, delete workloads, alter scheduling, or disrupt cluster control-plane components without explicit approval.
- MUST NOT deploy privileged or host-mounted workloads unless specifically authorized.
- MUST NOT access unrelated namespace data merely because cluster permissions allow it.

## SHOULD
- SHOULD evaluate namespace isolation, admission policy, image provenance, runtime privilege, and network segmentation as connected controls.
- SHOULD use dedicated test namespaces when compatible with objectives.

## Exceptions
Node-level, privileged, or control-plane tests require human approval, monitoring, containment, and rollback.

## Verification
Review cluster audit logs, RBAC evidence, manifests, resource diffs, test identities, runtime telemetry, and cleanup inventories.