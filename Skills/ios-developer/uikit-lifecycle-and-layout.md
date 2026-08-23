# UIKit Lifecycle and Layout

## Purpose
Build and troubleshoot UIKit screens with correct controller/view lifecycle behavior, Auto Layout constraints, containment, and resource management.

## When to use
Use for UIKit features, legacy maintenance, mixed SwiftUI/UIKit applications, layout warnings, or lifecycle defects.

## Inputs
Screen requirements, supported devices, trait environments, existing controller hierarchy.

## Context to inspect
Containment, presentation, constraints, safe areas, trait changes, reuse, observers, delegates, and lifecycle callbacks.

## Core knowledge
Controller containment and view lifecycle are contracts. Auto Layout requires a solvable constraint system across dynamic type, rotation, multitasking, and content changes.

## Procedure
1. Identify controller ownership and presentation model.
2. Place setup in appropriate lifecycle phases.
3. Define constraints from semantic layout requirements.
4. Respect safe areas and readable content where applicable.
5. Handle trait/content-size changes.
6. Manage observers/delegates according to lifetime.
7. Verify reusable views reset all state.
8. Resolve ambiguous/unsatisfiable constraints at their source.
9. Test transitions and memory release.

## Decision points
Prefer stack/compositional layout when it simplifies dynamic content; custom layout only for requirements standard primitives cannot express efficiently.

## Common failure patterns
Manual frame/constraint conflicts, incorrect child containment, retained controllers, reuse artifacts, lifecycle-dependent races, and fixed dimensions that break accessibility.

## Verification
Run on multiple size classes, Dynamic Type sizes, rotations, and presentation paths; inspect constraint logs and memory graph.

## Expected output
Stable lifecycle, warning-free layout, and predictable containment across supported configurations.

## Stop conditions
Stop when required behavior depends on undocumented private APIs or unsupported OS behavior.