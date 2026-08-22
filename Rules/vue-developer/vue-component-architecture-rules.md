# Vue Component Architecture Rules

## Purpose
Keep Vue components cohesive, testable, reusable, and safe to evolve.

## Scope
Vue components, composables, feature boundaries, props, emits, slots, and shared UI abstractions.

## MUST
- Components MUST have a clear responsibility and ownership boundary.
- Public props, emitted events, and slots MUST form an intentional, documented contract when reused outside a local feature.
- Business workflows MUST NOT be hidden inside generic presentational components.
- Shared components MUST avoid dependencies on feature-specific stores, routes, or API clients unless that dependency is explicit by design.
- Large components MUST be decomposed when independent responsibilities can be isolated without obscuring the workflow.

## MUST NOT
- Components MUST NOT mutate props.
- Components MUST NOT reach into another component's private state through refs as routine application architecture.
- Generic components MUST NOT encode one consumer's business assumptions as invisible behavior.

## SHOULD
- Prefer composition through props, emits, slots, and composables over inheritance-like abstractions.
- Keep feature-specific orchestration close to the feature and reusable primitives domain-neutral.

## Exceptions
Tightly coupled components may intentionally share implementation details when they form one documented compound component and the coupling is verified by tests.

## Verification
Review component dependencies, public contracts, state ownership, tests, and change impact across consumers.