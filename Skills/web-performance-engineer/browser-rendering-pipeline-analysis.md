# Browser Rendering Pipeline Analysis

## Purpose
Diagnose performance problems caused by style calculation, layout, paint, compositing, and main-thread scheduling.

## When to use
Use for jank, expensive scrolling, slow rendering, animation issues, large DOM regressions, or unexplained render delay.

## Inputs
Browser traces, DOM/CSS, screenshots, interaction recordings, paint/layout events, layer information.

## Context to inspect
Identify the affected interaction, render path, DOM size, style invalidation scope, layout dependencies, animation properties, and device capability.

## Core knowledge
Rendering work is coupled: DOM or style changes may trigger style recalculation, layout, paint, and compositing. Layout reads after writes can force synchronous layout. Compositor-friendly properties reduce main-thread work but excessive layers consume memory.

## Procedure
1. Record a trace reproducing the user-visible symptom.
2. Isolate the critical frame or interaction window.
3. Separate scripting, style, layout, paint, and composite cost.
4. Identify invalidation sources and affected node counts.
5. Find forced synchronous layouts and repeated read/write cycles.
6. Inspect large paints and unnecessary layer promotion.
7. Reduce work at the source before adding scheduling workarounds.
8. Test on representative low-end hardware.
9. Compare frame timing and user-centric metrics before and after.

## Decision points
Prefer structural DOM/CSS fixes over blanket `will-change`. Use containment when boundaries are semantically safe. Move animation to transform/opacity only when visual behavior remains correct.

## Common failure patterns
Optimizing JavaScript while layout dominates; excessive DOM depth; animating layout properties; universal layer promotion; measuring only on desktop; hiding symptoms with throttling or debouncing.

## Verification
Confirm lower render cost in traces, reduced dropped frames, unchanged visual output, and no memory or accessibility regression.

## Expected output
A trace-backed rendering diagnosis and minimal corrective changes.

## Stop conditions
Escalate when the root cause requires a redesign of component/layout architecture or browser-specific behavior cannot be reproduced reliably.