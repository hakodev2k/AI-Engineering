# eBPF Security Hardening

## Purpose
Reduce privilege, tampering, data exposure, and unsafe-program risks in eBPF deployments.

## When to use
Use during security review, production deployment, or privilege redesign of eBPF agents.

## Inputs
Threat model, deployment topology, capabilities, kernel settings, program/map inventory, sensitive fields.

## Context to inspect
Inspect CAP_BPF/CAP_PERFMON/CAP_SYS_ADMIN usage, unprivileged BPF settings, bpffs permissions, pinned objects, loader identity, event contents, and update channels.

## Core knowledge
The verifier provides memory-safety guarantees within its model, not application authorization or data minimization. Load/attach privileges and writable maps are security boundaries.

## Procedure
1. Inventory programs, maps, links, pins, and required operations.
2. Minimize process capabilities after initialization.
3. Restrict bpffs and pinned-object permissions.
4. Separate read-only telemetry consumers from policy writers.
5. Minimize sensitive kernel/user data collected.
6. Validate object provenance and deployment integrity.
7. Protect configuration/policy update channels.
8. Audit attachment and map mutation paths.
9. Test compromise scenarios and recovery.

## Decision points
Drop privileges after attach when lifecycle permits. Split privileged loader from unprivileged consumer when the reduced attack surface justifies complexity.

## Common failure patterns
Permanent broad capabilities, world-accessible pins, secrets in events, writable policy maps exposed to consumers, and assuming verifier acceptance equals secure behavior.

## Verification
Capability inspection, permission tests, unauthorized mutation attempts, sensitive-data review, and restart/upgrade tests.

## Expected output
A least-privilege deployment with documented trust boundaries.

## Stop conditions
Stop if required privileges cannot be constrained to an acceptable threat model.