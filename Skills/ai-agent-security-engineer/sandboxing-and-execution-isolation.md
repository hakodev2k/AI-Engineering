# Sandboxing and Execution Isolation

## Purpose
Contain code execution, browser automation, file manipulation, and other high-risk agent capabilities so compromise or model error cannot freely affect host systems or sensitive networks.

## When to use
Use when agents execute code, run shell commands, install packages, browse arbitrary sites, transform files, or interact with untrusted artifacts.

## Inputs
Execution workloads, required files, network dependencies, runtime platform, privilege requirements, data classifications, and performance constraints.

## Preconditions
Define the minimum filesystem, process, network, identity, and resource access required for the task.

## Context to inspect
Container or VM configuration, namespaces, seccomp/AppArmor/SELinux, user privileges, mounts, network policy, metadata endpoints, secrets injection, resource quotas, and teardown behavior.

## Core knowledge
A sandbox is a blast-radius control, not a guarantee of harmless execution. Strong isolation combines least privilege, ephemeral environments, restricted mounts, egress controls, resource limits, secret minimization, and lifecycle cleanup.

## Procedure
1. Classify execution risk and attacker-controlled inputs.
2. Select an isolation boundary appropriate to impact: process, container, microVM, VM, or dedicated host.
3. Run as an unprivileged identity.
4. Mount only required files and prefer read-only access.
5. Block host sockets, device access, metadata services, and unnecessary kernel capabilities.
6. Restrict outbound network destinations and protocols.
7. Inject only task-specific short-lived credentials.
8. Apply CPU, memory, disk, process, and execution-time limits.
9. Destroy the environment after use unless persistence is explicitly required.
10. Capture security-relevant execution telemetry.
11. Test escape attempts, fork bombs, disk exhaustion, secret discovery, SSRF, and prohibited egress.
12. Reassess isolation when new capabilities are introduced.

## Decision points
Prefer stronger isolation when inputs are adversarial or execution is general-purpose. Accept lighter isolation only when the workload is tightly constrained and host impact is low.

## Common failure patterns
Privileged containers, writable host mounts, unrestricted egress, persistent credentials, Docker socket exposure, shared mutable workspaces, and missing resource quotas.

## Verification
Demonstrate that the workload cannot reach prohibited files, host interfaces, credentials, or network destinations and that resource abuse is terminated safely.

## Expected output
A documented sandbox profile with allowed resources, denied capabilities, lifecycle rules, and isolation test evidence.

## Stop conditions
Escalate when required functionality needs host-level privileges or network access that defeats the intended containment boundary.