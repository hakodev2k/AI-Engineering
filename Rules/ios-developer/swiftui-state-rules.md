# SwiftUI State Rules

## Purpose
Keep SwiftUI rendering deterministic and state ownership explicit.

## Scope
SwiftUI views, observable models, bindings, navigation state, and environment dependencies.

## MUST
- Every mutable UI state value MUST have one identifiable owner.
- Derived values MUST be computed from source state rather than duplicated unless caching is measured and invalidation is correct.
- Environment dependencies MUST be explicit enough that previews and tests can supply controlled substitutes.
- Navigation state MUST remain consistent with domain state across restoration and deep links.
- Side effects MUST be separated from pure view rendering and have defined cancellation/lifetime behavior.

## MUST NOT
- MUST NOT mutate state during rendering in ways that can create feedback loops.
- MUST NOT use broad observable objects as dumping grounds for unrelated feature state.
- MUST NOT depend on view appearance callbacks as the sole guarantee for critical business operations.

## SHOULD
- Keep views small around coherent state and behavior boundaries.
- Prefer immutable inputs and narrow bindings.
- Model loading, empty, success, and failure states explicitly.

## Exceptions
Nonstandard ownership patterns require documented lifecycle reasoning and tests for navigation, re-rendering, and restoration.

## Verification
Use previews, unit tests for state transitions, UI tests for navigation/restoration, Instruments for excessive updates, and code review of ownership and side effects.