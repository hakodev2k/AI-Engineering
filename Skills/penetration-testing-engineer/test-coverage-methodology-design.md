# Test Coverage and Methodology Design

## Purpose
Design risk-driven penetration-test coverage that is explainable, repeatable, and appropriate to the available time, access, and architecture.

## When to use
Use during assessment planning and continuously as new attack surfaces or constraints emerge.

## Inputs
Scope, objectives, architecture, asset criticality, test window, identities, prior findings, and methodology requirements.

## Context to inspect
Inspect entry points, trust boundaries, privileged workflows, sensitive data, technology stack, integrations, prior incidents, and areas excluded from automated testing.

## Core knowledge
Methodologies such as OWASP WSTG/ASVS, PTES-style phases, and platform-specific guides provide coverage structure; they do not replace risk-based prioritization. Coverage should trace objectives to tested controls and documented limitations.

## Procedure
1. Translate engagement objectives into security questions.
2. Map questions to assets, roles, and trust boundaries.
3. Select relevant methodology sections and platform-specific checks.
4. Prioritize high-impact attack paths and business workflows.
5. Allocate manual vs automated testing deliberately.
6. Define evidence and completion criteria per area.
7. Track tested, partially tested, blocked, and not-applicable areas.
8. Adapt when discoveries change risk priorities.
9. Perform a gap review before ending active testing.
10. Document material limitations in the report.

## Decision points
Spend depth where risk and uncertainty are highest rather than distributing time equally. Skip irrelevant checklist items with rationale.

## Common failure patterns
Checklist-only testing, undocumented gaps, excessive breadth with no validation depth, ignoring business logic, and treating tool execution as coverage.

## Verification
Every important asset/trust boundary maps to tested security questions or an explicit limitation, and critical workflows received manual analysis.

## Expected output
A risk-driven coverage matrix with methodology mapping, status, evidence expectations, and limitations.

## Stop conditions
Escalate when scope/time constraints make agreed objectives unattainable or critical coverage requires prohibited techniques.