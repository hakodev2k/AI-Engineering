# Navigation and State Rules
## Purpose
Make navigation and screen state deterministic across deep links, restoration, and user flows.
## Scope
Navigation stacks, routes, deep links, screen state, transient UI state, and flow coordination.
## MUST
- Navigation destinations MUST validate required route parameters before use.
- Deep links MUST enforce the same authorization and validation as in-app navigation.
- State ownership MUST have a single authoritative source for each mutable concern.
## MUST NOT
- Sensitive screens MUST NOT be reachable solely because a route can be constructed.
- Navigation logic MUST NOT duplicate irreversible business side effects on back/forward restoration.
## SHOULD
- Navigation state SHOULD be serializable or reconstructable when restoration is a product requirement.
## Exceptions
Purely decorative transient state may remain local and non-restorable.
## Verification
Test direct deep links, invalid links, back navigation, restoration, authentication transitions, and duplicate navigation events.