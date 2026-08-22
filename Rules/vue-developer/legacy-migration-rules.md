# Legacy Migration Rules

## Purpose
Modernize Vue applications without unnecessary rewrites, hidden compatibility failures, or uncontrolled migration scope.

## Scope
Vue 2 to Vue 3, Options API to Composition API, router/store/build-tool migrations, and incremental modernization.

## MUST
- Migration scope MUST be driven by supported-platform needs, risk, maintainability, or measurable value rather than novelty alone.
- Major migrations MUST inventory incompatible APIs, critical plugins, build assumptions, browser support, and production rollback constraints.
- Behavioral equivalence for critical journeys MUST be protected by regression evidence before large structural changes.
- Incremental migration boundaries MUST define how old and new patterns interoperate and when temporary adapters will be removed.
- Dependency/framework support status and security exposure MUST inform migration priority.

## MUST NOT
- A migration MUST NOT combine unrelated product changes, broad redesign, and framework replacement without explicit risk acceptance.
- Deprecated behavior MUST NOT be replaced by guesswork when current production behavior can be observed or tested.
- A successful build MUST NOT be considered proof of migration completeness.

## SHOULD
- Prefer reversible, staged migration steps with measurable checkpoints.
- Establish regression tests before changing poorly understood legacy behavior.

## Exceptions
A rewrite may be justified when incremental compatibility cost exceeds replacement risk; the decision requires documented alternatives, evidence, and approval.

## Verification
Compare behavior, tests, bundle/runtime metrics, plugin compatibility, browser support, production telemetry, and rollback feasibility at each stage.