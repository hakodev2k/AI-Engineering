# BPF Loader and Lifecycle Management

## Purpose
Build robust user-space loading, attachment, reconciliation, and cleanup for eBPF programs and maps.

## When to use
Use when creating or hardening an eBPF agent/daemon.

## Inputs
BPF objects, hooks, map lifecycle, privileges, target kernels, deployment/restart behavior.

## Context to inspect
Inspect libbpf/bindings, pin paths, links, capability setup, systemd/container lifecycle, upgrade strategy, and stale resource handling.

## Core knowledge
Successful initial attach is only one state. Production loaders must reconcile desired vs actual attachments across crashes, upgrades, partial failures, and kernel capability differences.

## Procedure
1. Probe required kernel capabilities before loading.
2. Open object and configure maps/program constants.
3. Load with complete error/verifier logging.
4. Attach links transactionally where possible.
5. Publish readiness only after required hooks are active.
6. Reconcile pinned resources and previous instances.
7. Handle partial attach rollback.
8. Define graceful detach and crash recovery.
9. Implement upgrade compatibility for maps/events.
10. Expose loader and attachment health.

## Decision points
Pin only resources requiring persistence/sharing. Prefer link-based lifecycle where supported. Treat optional probes separately from required readiness.

## Common failure patterns
Readiness before attach, stale pins, duplicate attachments, leaked resources, all-or-nothing startup for optional features, and poor verifier logs.

## Verification
Crash/restart/upgrade tests, partial-failure injection, stale-resource scenarios, and capability-missing targets must behave predictably.

## Expected output
A reconciliatory loader with deterministic readiness, rollback, and cleanup.

## Stop conditions
Stop when required privileges/capabilities are unavailable or safe lifecycle ownership cannot be established.