# Main-Thread Long Task Analysis

## Purpose
Find and reduce long main-thread tasks that delay input handling and presentation, especially for poor INP cohorts.

## When to use
Use when interactions feel unresponsive, INP is poor, or traces show tasks exceeding a frame or interaction budget.

## Inputs
Performance traces, Long Tasks/LoAF data, interaction attribution, source maps, RUM INP diagnostics.

## Context to inspect
Identify interaction type, task initiator, framework scheduling, event listeners, timers, rendering work, and device class.

## Core knowledge
A long task can contain scripting, style, layout, and rendering work. Interaction latency includes input delay, processing, and presentation delay. Splitting tasks helps scheduling only if required work remains logically correct.

## Procedure
1. Locate slow interactions in field or lab data.
2. Trace the interaction from input to next paint.
3. Identify long tasks overlapping input and presentation.
4. Attribute task slices to application, framework, and third-party code.
5. Remove unnecessary synchronous work first.
6. Defer nonessential work beyond the interaction-critical window.
7. Break remaining work at safe yield points.
8. Reduce rendering and state-update fan-out.
9. Re-test rapid and repeated interactions.
10. Validate on low-end hardware and production telemetry.

## Decision points
Prefer fewer computations over more yielding. Use scheduling APIs when work can safely resume later. Avoid deferring state required for visible correctness or accessibility feedback.

## Common failure patterns
Adding debounce to hide slow handlers; optimizing only handler code while presentation delay dominates; yielding inside non-reentrant logic; ignoring third-party callbacks; validating on idle pages only.

## Verification
Confirm shorter critical tasks, reduced interaction latency, stable UI state, and improved INP distribution without lost events.

## Expected output
An interaction timeline, attributed long tasks, remediation, and before/after evidence.

## Stop conditions
Escalate when the interaction requires a product-flow redesign or an uncontrollable third party dominates latency.