# Browser Platform and Web APIs

## Purpose
Use browser capabilities correctly by understanding document lifecycle, events, storage, networking, workers, observers, permissions, and compatibility constraints.

## When to use
Use when integrating browser APIs, diagnosing lifecycle/event bugs, implementing storage, background work, media, clipboard, notifications, or performance-sensitive DOM behavior.

## Inputs
Feature requirements, target browsers, permission model, privacy constraints, and current browser API usage.

## Context to inspect
DOM event listeners, timers, observers, storage, service/workers, fetch usage, lifecycle hooks, feature detection, and cleanup paths.

## Core knowledge
Browser APIs have lifecycle, security, privacy, and main-thread implications. Event propagation, task/microtask scheduling, same-origin policy, storage limits, and permission requirements directly affect correctness.

## Procedure
1. Identify the native capability required.
2. Verify browser support and security context requirements.
3. Define permission and fallback behavior.
4. Understand lifecycle and event-order semantics before coding.
5. Avoid unnecessary main-thread work.
6. Register listeners/observers with explicit cleanup ownership.
7. Feature-detect optional capabilities.
8. Handle denied permissions and unavailable APIs gracefully.
9. Test page hide/show, navigation, multiple tabs, and constrained environments where relevant.
10. Measure runtime impact for high-frequency APIs.

## Decision points
Use native APIs before dependencies when semantics are simple and compatibility is acceptable. Use workers only when off-main-thread work justifies serialization and coordination cost.

## Common failure patterns
Listener leaks, assuming API availability, blocking the main thread, abusing local storage for sensitive data, misunderstanding event propagation, and ignoring permission denial.

## Verification
Supported browsers execute required behavior, cleanup occurs, fallback paths work, permissions are handled, and performance traces show no unacceptable main-thread impact.

## Expected output
A browser-native integration with compatibility, lifecycle, privacy, fallback, and performance behavior defined.

## Stop conditions
Stop when the required capability is unavailable in supported browsers, permission requirements conflict with product policy, or sensitive storage behavior lacks security approval.