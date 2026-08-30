# Runtime Hardening

## Purpose
Reduce the attack surface and privilege of platform-hosted workloads and runtime infrastructure so compromise is contained and exploitation paths are limited.

## When to use
Use when defining runtime standards, onboarding new workload classes, reviewing privileged workloads, hardening nodes or containers, or investigating runtime escape risk.

## Inputs
Runtime configuration, container or VM settings, workload manifests, kernel and host controls, service accounts, filesystem mounts, capabilities, network access, and platform policies.

## Context to inspect
Inspect root execution, Linux capabilities, seccomp/AppArmor/SELinux profiles, host namespaces, privileged mode, device access, writable filesystems, metadata endpoints, node permissions, and workload identity.

## Core knowledge
Runtime hardening should minimize privileges actually available after deployment. Build-time scanning does not compensate for dangerous runtime settings. Control-plane and host-level workloads require stronger isolation because compromise may bypass tenant boundaries.

## Procedure
1. Classify workloads by trust and required privilege.
2. Identify unnecessary root execution and capabilities.
3. Remove privileged mode, host namespaces, host networking, and host mounts unless explicitly required.
4. Apply restrictive syscall and mandatory-access-control profiles where supported.
5. Use read-only filesystems and minimal writable paths where practical.
6. Restrict access to node, metadata, device, and kernel interfaces.
7. Separate sensitive platform workloads from untrusted tenant workloads when blast radius warrants it.
8. Patch and minimize runtime images and host software.
9. Enforce workload identity and avoid embedded credentials.
10. Monitor unexpected process, privilege, and filesystem behavior.
11. Test representative escape and privilege-escalation attempts.
12. Encode hardened defaults in platform templates and admission policy.

## Decision points
Allow elevated runtime privilege only for capabilities that cannot be implemented safely another way. Prefer dedicated isolated nodes or environments for exceptional high-privilege workloads.

## Common failure patterns
Running everything as root, broad capability sets, privileged daemonsets, writable host mounts, unrestricted metadata access, and one-off hardening not encoded in platform defaults.

## Verification
Verify effective runtime privileges, policy enforcement, negative deployment tests, node isolation, and runtime telemetry for representative workloads.

## Expected output
A hardened runtime baseline, enforced exceptions, tested isolation, and reusable secure platform defaults.

## Stop conditions
Stop and escalate when a workload requires host-equivalent privilege without dedicated isolation, runtime controls are unsupported, or evidence suggests active escape or host compromise.