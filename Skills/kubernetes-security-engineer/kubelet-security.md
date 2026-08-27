# Kubelet Security

## Purpose
Secure kubelet APIs and credentials to prevent node-level workload control and secret exposure.

## When to use
Use during cluster hardening, node reviews, networking changes, or investigation of node/API access paths.

## Inputs
Kubelet configuration, network rules, certificates, authorization settings, node identities, and monitoring data.

## Preconditions
Know cluster version and managed-service constraints.

## Context to inspect
Inspect anonymous authentication, webhook authentication/authorization, read-only ports, TLS certificates, serving endpoints, credential rotation, API-server-to-kubelet access, and firewall paths.

## Core knowledge
The kubelet controls pod execution on its node. Weak authentication or broad network exposure can enable command execution and credential theft independent of normal application boundaries.

## Procedure
1. Inventory kubelet listeners and reachable networks.
2. Disable anonymous and legacy insecure access.
3. Require authenticated TLS.
4. Use webhook authorization where appropriate.
5. Restrict network sources to control-plane/approved administration.
6. Validate certificate rotation.
7. Review node identity permissions.
8. Monitor failed and unusual kubelet API access.

## Decision points
Prefer network isolation plus strong authentication rather than relying on either alone. Preserve only required health/metrics access through controlled channels.

## Common failure patterns
Internet/reachable kubelet ports; anonymous access; stale client certificates; overprivileged node identities; monitoring exceptions that bypass auth.

## Verification
Probe from allowed and denied network locations and identities; confirm privileged endpoints require valid authorization.

## Expected output
A minimally exposed, authenticated, authorized kubelet surface with tested access boundaries.

## Stop conditions
Escalate immediately if unauthenticated or unauthorized command-capable kubelet access is found.