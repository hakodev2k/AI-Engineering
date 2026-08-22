# Legacy System Assessment

## Purpose
Assess legacy systems objectively to decide what to retain, remediate, modernize, replace, isolate, or retire.

## When to use
Use before modernization initiatives, acquisitions, cloud migration, major refactoring, or end-of-life decisions.

## Inputs
Architecture, codebase, runtime versions, dependencies, incidents, support costs, usage, business criticality, roadmap.

## Preconditions
Business owners and operational owners can provide evidence.

## Context to inspect
Change frequency, failure history, security exposure, unsupported dependencies, data stores, integrations, deployment process, test coverage, vendor contracts.

## Core knowledge
Legacy does not mean bad. Replacement risk can exceed maintenance risk. Evaluate business value, change pressure, operational risk, and technical constraints separately.

## Procedure
1. Identify business capabilities served.
2. Measure usage and criticality.
3. Inventory technology and external dependencies.
4. Assess maintainability and change lead time.
5. Review incidents, vulnerabilities, and support status.
6. Map data and integration coupling.
7. Estimate cost of keep, remediate, migrate, replace, and retire options.
8. Identify quick risk-reduction steps.
9. Select treatment strategy by component/capability.
10. Document evidence and revisit triggers.

## Decision points
Retain stable systems with low change pressure when risk is acceptable. Replace when business value, support risk, or change constraints justify migration cost.

## Common failure patterns
Rewrite by instinct, ignoring hidden integrations, underestimating data migration, confusing old technology with business irrelevance.

## Verification
Recommendation traces to measured business and technical evidence.

## Expected output
Legacy assessment and prioritized modernization treatment plan.

## Stop conditions
Stop when usage, ownership, or critical dependency information is unavailable.