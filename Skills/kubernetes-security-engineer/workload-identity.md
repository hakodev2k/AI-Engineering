# Workload Identity

## Purpose
Give Kubernetes workloads authenticated, least-privilege access to cluster and external services without static shared credentials.

## When to use
Use for cloud APIs, internal services, databases, secret stores, and Kubernetes API access.

## Inputs
Workload identity, service account, target resource, trust configuration, token audiences, authorization requirements, and cloud identity mappings.

## Preconditions
Know the workload owner and exact target permissions.

## Context to inspect
Inspect service-account token projection, automount settings, federation/OIDC trust, token audience/expiry, cloud role mappings, namespace constraints, and pod mutation.

## Core knowledge
Workload identity separates machine authentication from authorization. Short-lived audience-bound tokens reduce credential theft impact, but weak federation conditions can turn identity mapping into cluster-wide escalation.

## Procedure
1. Assign a dedicated Kubernetes service account.
2. Disable unnecessary token automount.
3. Define target permissions minimally.
4. Configure federation/trust with restrictive subject and audience conditions.
5. Use short-lived projected tokens.
6. Validate token exchange and authorization.
7. Test cross-namespace and wrong-audience denial.
8. Monitor identity use and rotate trust configuration safely.

## Decision points
Prefer federation over static cloud keys. Use separate identities for materially different privilege sets rather than accumulating permissions.

## Common failure patterns
Shared service accounts; wildcard federation subjects; default service-account use; overly broad cloud roles; accepting arbitrary audiences.

## Verification
Prove the intended workload can access only required resources and that another pod/service account cannot impersonate it.

## Expected output
A dedicated, short-lived workload identity with tested least privilege and observable use.

## Stop conditions
Escalate when identity-provider constraints cannot express the required tenant or workload boundary.