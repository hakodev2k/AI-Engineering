# Offline Operation and Recovery

## Purpose
Design edge AI behavior that remains safe, bounded, and useful during network loss, cloud outages, sensor faults, storage pressure, runtime crashes, and device restarts.

## When to use
Use when the product must operate outside reliable connectivity or when AI participates in autonomous or user-visible functions that cannot simply fail closed on every remote dependency issue.

## Inputs
Offline requirements, cloud dependencies, local storage limits, model/runtime lifecycle, retry policies, sensor dependencies, watchdog behavior, and safe-degradation rules.

## Preconditions
Define which functions are mandatory offline and which may be disabled or degraded.

## Context to inspect
Caches, credential expiry, retry queues, local model availability, fallback models, watchdogs, service supervision, filesystem durability, state checkpoints, and reconnect synchronization.

## Core knowledge
Offline resilience requires explicit partial-failure semantics. Retries must be bounded, local state may become stale, and recovery after reconnect can create duplicate work or version conflicts. A device should retain a known-good inference path even when updates or cloud augmentation fail.

## Procedure
1. Enumerate remote dependencies and classify each as mandatory, optional, or deferred.
2. Define offline behavior per dependency.
3. Ensure a known-good local model and configuration survive reboot.
4. Bound retry frequency, queued data, and local storage.
5. Define safe behavior for expired credentials or stale remote configuration.
6. Add watchdog/restart behavior for hung inference services.
7. Protect state updates against partial writes and power loss.
8. Define fallback behavior for sensor loss, model-load failure, and accelerator failure.
9. Make reconnect synchronization idempotent.
10. Resolve version conflicts explicitly rather than last-write-wins by accident.
11. Test long outages, repeated restarts, full disks, and reconnect storms.

## Decision points
Prefer local known-good behavior over unbounded attempts to restore cloud quality. Buffer data only when delayed delivery has real value and storage/privacy budgets permit it. Use fallback models when reduced quality is safer than no inference.

## Common failure patterns
Infinite retry loops, disk exhaustion, mandatory cloud feature flags, expired credentials disabling local logic, update failure removing the previous model, and duplicate uploads on reconnect.

## Verification
Run extended offline tests, force process/device restarts, fill storage, corrupt pending operations, restore connectivity, and verify bounded recovery without lost safety invariants.

## Expected output
A documented degradation and recovery strategy with bounded queues, durable known-good state, and tested reconnect semantics.

## Stop conditions
Stop when safe offline behavior is undefined or critical local recovery depends on unavailable remote services.