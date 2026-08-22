# UI Architecture Rules
## Purpose
Keep presentation logic, state transitions, and side effects understandable as mobile features grow.
## Scope
Screens, view models/presenters, state stores, UI events, side effects, and reusable components.
## MUST
- UI state transitions MUST have an identifiable owner and source of truth.
- Business-critical side effects MUST be separated from rendering so they can be tested and deduplicated.
- Screen components MUST define lifecycle ownership for subscriptions and asynchronous work.
## MUST NOT
- UI callbacks MUST NOT contain duplicated domain rules that diverge across screens.
- Global mutable state MUST NOT be introduced without explicit ownership and reset semantics.
## SHOULD
- Presentation architecture SHOULD favor predictable unidirectional state flow when complexity warrants it.
## Exceptions
Small isolated screens may use simpler local state when no cross-screen or persistence concerns exist.
## Verification
Review state ownership, dependency direction, lifecycle cleanup, unit tests, and duplicate business logic.