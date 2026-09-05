# Kubernetes Pod Security Rules

## Purpose
Enforce secure pod-level defaults and prevent workload specifications from bypassing container isolation boundaries.

## Scope
Applies to pods, deployments, jobs, daemonsets, stateful workloads, security contexts, namespaces, and pod-security admission controls.

## MUST
- Production workloads MUST satisfy an approved pod-security baseline appropriate to their risk.
- Security contexts MUST explicitly constrain user identity, privilege escalation, capabilities, and filesystem behavior where supported.
- Host namespaces, host networking, host PID/IPC, privileged mode, and hostPath access MUST require explicit technical justification and approval.
- Namespace-level policy MUST prevent lower-trust workloads from weakening higher-trust security requirements.
- Workload changes that relax pod security settings MUST receive security review.

## MUST NOT
- MUST NOT disable pod-security admission broadly to unblock one incompatible workload.
- MUST NOT run privileged daemon workloads cluster-wide unless their host-level authority is required and approved.
- MUST NOT assume namespace separation alone provides strong security isolation.

## SHOULD
- Enforce restricted or equivalently hardened defaults for ordinary application workloads.
- Apply policy through admission controls rather than documentation alone.

## Exceptions
Exceptions require exact incompatible settings, risk analysis, reduced blast radius, compensating controls, owner, and expiration or review date.

## Verification
Inspect pod specs, admission configuration, effective security contexts, policy violations, namespace labels, and cluster audit logs.