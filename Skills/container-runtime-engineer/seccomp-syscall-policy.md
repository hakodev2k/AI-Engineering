# Seccomp and Syscall Policy

## Purpose
Create, review, and troubleshoot syscall filtering for container workloads using seccomp while balancing exploit reduction and compatibility.

## When to use
Use for default profiles, workload hardening, blocked-syscall incidents, or kernel attack-surface reduction.

## Inputs
OCI seccomp profile, workload syscall traces, architecture, kernel/runtime versions, threat model, failure logs.

## Context to inspect
Inspect default action, allowed/denied syscalls, argument filters, architecture mappings, capabilities, and whether failures surface as EPERM, kill, trap, or notification.

## Core knowledge
Seccomp constrains syscalls, not filesystem/network authorization. Allowlisting provides stronger reduction but has compatibility cost. Profiles must account for libc/runtime evolution and architecture-specific syscall behavior.

## Procedure
1. Establish threat model and compatibility target.
2. Start from a maintained baseline profile.
3. Reproduce workload under representative tests.
4. Trace denied syscalls with safe diagnostic tooling.
5. Determine why each denied syscall is required.
6. Prefer narrow syscall/argument allowance over broad profile relaxation.
7. Test startup, steady state, shutdown, debugging, and upgrade paths.
8. Validate interactions with capabilities and LSMs.
9. Add regression tests for expected denials.
10. Version the policy with compatibility notes.

## Decision points
Use deny-by-default for tightly controlled workloads; use hardened baseline deny lists when ecosystem variability is high. Never allow a syscall solely because an error disappeared.

## Common failure patterns
Disabling seccomp to fix compatibility, architecture omissions, overbroad `unconfined`, ignoring new runtime syscalls, and confusing seccomp denials with permission errors elsewhere.

## Verification
Prove workload functionality and intentional syscall denials. Re-test after runtime, libc, or kernel upgrades.

## Expected output
A minimal justified seccomp policy plus tests and compatibility rationale.

## Stop conditions
Stop when the required relaxation materially changes the threat model or production tracing requires unapproved elevated access.