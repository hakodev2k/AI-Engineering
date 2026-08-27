# LSM Integration

## Purpose
Integrate container runtimes correctly with Linux Security Modules such as SELinux and AppArmor and diagnose policy-related failures.

## When to use
Use for runtime labeling/profile support, denied-access incidents, multi-tenant hardening, or host-policy compatibility.

## Inputs
OCI security settings, audit logs, labels/profiles, host LSM mode, filesystem paths, workload behavior.

## Context to inspect
Identify active LSMs, runtime-generated labels/profile names, mount labels, process domains, policy ownership, and audit records.

## Core knowledge
LSMs provide mandatory access control beyond Unix permissions and capabilities. SELinux labeling and AppArmor path/profile models differ. Runtime code should integrate with host policy rather than silently disabling enforcement.

## Procedure
1. Confirm active LSM and enforcement mode.
2. Reproduce the denial with audit evidence.
3. Identify process security context and target object.
4. Determine whether runtime labeling/profile assignment is correct.
5. Distinguish policy bug from workload requesting prohibited access.
6. Make the narrowest policy/runtime correction.
7. Test create, exec, bind mounts, volumes, and cleanup.
8. Verify labels are released/reused safely.
9. Test host reboot/runtime restart where label state matters.
10. Document required policy modules or profiles.

## Decision points
Fix incorrect labeling in runtime code; change security policy only when access is legitimately required. Never make permissive/unconfined the default workaround.

## Common failure patterns
Disabling enforcement, relabeling shared host content unsafely, stale MCS/category allocation, missing profile cleanup, and ignoring audit logs.

## Verification
Confirm expected access succeeds, prohibited access remains denied, audit logs are clean for intended paths, and labels/profiles survive lifecycle operations.

## Expected output
A policy-compatible runtime integration or precise denial RCA.

## Stop conditions
Stop before changing organization-wide MAC policy without authorization or when relabeling could affect unrelated workloads.