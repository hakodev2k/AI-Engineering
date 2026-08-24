# Kernel and Boot Rules

## Purpose
Protect bootability, kernel compatibility, and recoverability when changing low-level host behavior.

## Scope
Applies to kernels, modules, bootloaders, initramfs, kernel command lines, sysctl settings, and reboot-required changes.

## MUST
- Kernel upgrades MUST be evaluated for workload, driver, filesystem, security-module, and observability compatibility.
- Boot-critical changes MUST have a tested recovery path such as a previous kernel, rescue environment, console access, or image replacement.
- Runtime kernel tuning MUST be documented with the problem, expected effect, scope, and validation method.
- Reboot-required changes MUST be coordinated with redundancy, maintenance, and service-health requirements.
- Custom modules MUST have provenance, compatibility, and security implications reviewed.

## MUST NOT
- Bootloader, initramfs, or root-device changes MUST NOT be applied fleet-wide without representative validation.
- Kernel safety controls MUST NOT be weakened solely to suppress an application symptom.
- A tuning value MUST NOT be copied from another environment without confirming workload and kernel applicability.

## SHOULD
- Prefer supported vendor kernels unless a measured requirement justifies divergence.
- Keep a known-good boot option where the platform permits it.
- Treat persistent sysctl configuration as code rather than ad hoc runtime state.

## Exceptions
Emergency recovery may justify temporary deviation, but the change, evidence, rollback state, owner, and follow-up remediation MUST be recorded.

## Verification
Inspect active and configured kernel versions, boot entries, module state, sysctl sources, reboot requirements, console/recovery access, and post-reboot service health. Validate tuning with workload metrics rather than host-level assumptions alone.