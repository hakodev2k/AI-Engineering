# Change Impact Analysis

## Purpose
Assess how a proposed change affects processes, users, rules, systems, data, integrations, controls, tests, and operations before implementation.

## When to use
Use for scope changes, requirement changes, production defects, policy changes, integration changes, and late-stage requests.

## Inputs
Change request, current requirements, process models, dependencies, data flows, system context, tests, and operational procedures.

## Preconditions
The proposed change is described clearly enough to identify affected behavior.

## Context to inspect
Upstream and downstream dependencies, interfaces, roles, business rules, reports, training, permissions, data migration, release plans, and support impacts.

## Core knowledge
Impact analysis prevents local optimization. A Senior BA looks beyond the requested screen or field and traces consequences across the end-to-end business flow.

## Procedure
1. Clarify the requested change and reason.
2. Identify directly affected requirements and rules.
3. Trace affected processes and actors.
4. Identify data and integration impacts.
5. Review controls, permissions, reports, and audit implications.
6. Assess testing and regression scope.
7. Identify operational, training, and communication impacts.
8. Estimate risk, urgency, and dependency consequences with relevant teams.
9. Document alternatives, including no-change or phased options.
10. Present the impact assessment to the decision owner.

## Decision points
Prefer phased or backward-compatible changes when immediate replacement creates disproportionate operational or integration risk.

## Common failure patterns
Assessing only the requesting feature, ignoring downstream consumers, and treating effort estimate as the whole impact assessment.

## Verification
Confirm all known dependency paths have been reviewed and owners of material impacts have validated the assessment.

## Expected output
A change-impact record with affected areas, risks, dependencies, options, regression scope, and decision recommendation.

## Stop conditions
Escalate when dependency information is incomplete enough that material impact cannot be bounded.