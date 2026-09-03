# Bundle and Dependency Rules

## Purpose
Prevent unnecessary client payload and dependency cost from degrading loading and runtime performance.

## Scope
Applies to application bundles, code splitting, tree shaking, polyfills, package dependencies, and shared chunks.

## MUST
- Measure transferred, parsed, and executed cost of material client dependencies.
- Review bundle diffs for significant additions before release.
- Ensure code splitting follows actual user journeys and does not create excessive request waterfalls.
- Remove duplicate or obsolete dependency versions when they materially increase client cost.

## MUST NOT
- Add a large dependency for trivial functionality without evaluating smaller alternatives.
- Treat tree shaking as effective without inspecting produced artifacts.
- Hide bundle growth by excluding shared or dynamically loaded code from reporting.

## SHOULD
- Prefer platform capabilities and narrowly scoped modules when they meet requirements.
- Establish route- or feature-specific size budgets.

## Exceptions
Exceptions require measured cost, alternatives considered, business or technical justification, mitigation, and reviewer approval.

## Verification
Use bundle analyzers, source maps, build manifests, dependency graphs, network traces, and CI size-diff checks.