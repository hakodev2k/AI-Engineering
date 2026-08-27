# Node Hardening

## Purpose
Reduce node compromise and container-escape impact by hardening Kubernetes worker and control-plane hosts.

## When to use
Use for node image design, baseline reviews, new runtime features, vulnerability response, and privileged workload onboarding.

## Inputs
OS image, kubelet/runtime configuration, host services, kernel settings, patch policy, access model, and workload requirements.

## Preconditions
Identify immutable versus mutable node management and cloud/provider responsibilities.

## Context to inspect
Inspect SSH/admin access, kernel and OS patches, filesystem permissions, kubelet endpoints, container runtime, metadata service, host firewall, swap/cgroups, audit configuration, and local credentials.

## Core knowledge
A node compromise can expose every workload and credential reachable on that node. Minimize host functionality, interactive access, privilege, and credential lifetime.

## Procedure
1. Start from a maintained minimal node image.
2. Remove unnecessary services/packages.
3. Restrict administrative access and use centralized identity.
4. Harden kubelet/runtime endpoints and permissions.
5. Apply timely OS/kernel/runtime patches.
6. Restrict cloud metadata access where supported.
7. Protect host files and credentials.
8. Separate sensitive workload classes with scheduling/isolation when justified.
9. Monitor node integrity and anomalous processes.

## Decision points
Prefer immutable replacement over in-place drift-prone changes when infrastructure supports it. Use dedicated node pools for workloads requiring exceptional host privilege.

## Common failure patterns
Long-lived SSH keys; exposed kubelet; privileged debugging left enabled; stale node images; broad metadata credentials.

## Verification
Compare nodes against baseline, test endpoint reachability, inspect patch level, and verify unauthorized workload access to host/cloud credentials is blocked.

## Expected output
A reproducible hardened node baseline with controlled exceptions.

## Stop conditions
Drain/isolate and escalate nodes showing compromise indicators or unsupported critical vulnerabilities.