# UIKit Lifecycle Rules

## Purpose
Prevent lifecycle, containment, navigation, and resource-management defects in UIKit code.

## Scope
UIViewController, UIView, navigation, presentation, containment, scenes, and application lifecycle integration.

## MUST
- Parent-child view-controller containment MUST follow UIKit containment contracts.
- Observers, timers, callbacks, and resources MUST have lifecycle-aligned ownership and cleanup.
- Navigation and presentation MUST tolerate repeated lifecycle callbacks and interrupted transitions.
- UI mutations MUST occur on the main thread.
- Scene-based applications MUST avoid assumptions that only one window or scene exists.

## MUST NOT
- MUST NOT place expensive synchronous work on lifecycle callbacks that blocks rendering.
- MUST NOT retain controllers through closures or delegates without intentional ownership.
- MUST NOT infer permanent application state solely from transient view lifecycle events.

## SHOULD
- Keep controllers focused on orchestration and presentation concerns.
- Make restoration and deep-link entry paths explicit.
- Prefer deterministic child composition over implicit hierarchy assumptions.

## Exceptions
Lifecycle deviations require evidence from platform behavior, explicit containment/lifetime reasoning, and regression tests.

## Verification
Exercise navigation and background/foreground transitions, use memory graph debugging, UI tests, Main Thread Checker, and review observer/resource cleanup.