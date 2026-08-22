# Pod Security

## Purpose
Harden pod execution against privilege escalation, host compromise, and unnecessary kernel capabilities.

## When to use
Security baselines, workload onboarding, or privileged workload reviews.

## Inputs
Container runtime needs, filesystem behavior, ports, device access, and security requirements.

## Context to inspect
SecurityContext, Pod Security Admission labels, capabilities, host namespaces, volumes, seccomp, AppArmor/SELinux, and image user.

## Core knowledge
Container isolation is not a security boundary equivalent to a VM. Most applications do not require root, privilege, host namespaces, or broad Linux capabilities.

## Procedure
1. Determine minimum runtime privileges.
2. Run as non-root where feasible.
3. Disable privilege escalation.
4. Drop capabilities and add only required ones.
5. Use read-only root filesystem when compatible.
6. Apply seccomp and platform MAC controls.
7. Avoid hostPath/host namespaces unless justified.
8. Enforce namespace policy and test workloads.

## Decision points
Grant exceptions only for documented technical requirements and isolate high-privilege workloads more strongly.

## Common failure patterns
Privileged containers for convenience, root-by-default images, writable filesystem assumptions, unrestricted hostPath, and blanket policy exceptions.

## Verification
Admission tests reject prohibited specs and representative workloads function under hardened settings.

## Expected output
Enforced pod-security baseline plus documented exceptions.

## Stop conditions
Escalate workloads that require host-level privilege or weaken cluster isolation.