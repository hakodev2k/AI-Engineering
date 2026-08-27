# Linux Capabilities and Privilege

## Purpose
Minimize container process privilege using Linux capabilities, securebits, no-new-privileges, identities, and runtime policy.

## When to use
Use for runtime defaults, privileged workload review, permission failures, or hardening.

## Inputs
OCI process spec, required operations, current capabilities, UID/GID, kernel settings, security policy.

## Context to inspect
Inspect bounding, permitted, effective, inheritable, and ambient sets; setuid transitions; `noNewPrivileges`; device and namespace context.

## Core knowledge
Capabilities split root privilege but many remain powerful. Bounding sets constrain future acquisition. User namespaces change capability scope. Privileged containers commonly bypass multiple independent controls.

## Procedure
1. Identify the exact privileged operations required.
2. Inspect all capability sets, not only effective.
3. Remove capabilities from a conservative baseline.
4. Reproduce failures and map them to kernel authorization checks.
5. Add only the minimum capability when justified.
6. Set non-root identity where possible.
7. Enable no-new-privileges unless incompatible.
8. Check interactions with user namespaces, devices, seccomp, and LSMs.
9. Test exec and child-process privilege behavior.
10. Record rationale for every non-default grant.

## Decision points
Prefer redesign or narrow host service delegation over broad capabilities. `CAP_SYS_ADMIN` should be treated as near-root and requires exceptional justification.

## Common failure patterns
Using privileged mode as a fix, adding capabilities without scope analysis, overlooking ambient capabilities, assuming non-root means unprivileged, and ignoring exec transitions.

## Verification
Inspect effective process credentials/capabilities and demonstrate required operations succeed while prohibited operations fail.

## Expected output
A least-privilege process specification with explicit evidence.

## Stop conditions
Stop when requested privilege enables broad host control or policy approval is required.