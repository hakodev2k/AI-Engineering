# Skill: Technical Onboarding

## Purpose
Move a new customer from purchased intent to a validated technical implementation path with measurable first value.

## Trigger
New customer, new product/module, major expansion, reimplementation, or ownership transfer.

## Inputs
Business outcomes, stakeholder map, target use cases, architecture, identity/security constraints, environments, dependencies, deadlines, product capabilities, and known risks.

## Preconditions
A named customer owner and internal owner exist; the intended outcome is specific enough to test.

## Procedure
1. Restate desired outcomes and measurable success signals.
2. Inventory stakeholders, environments, integrations, data flows, permissions, and dependencies.
3. Classify gaps as missing context, configuration, product limitation, security constraint, or external dependency.
4. Build milestone sequence: access → minimal integration → validation → pilot → production readiness → adoption.
5. Parallelize documentation review, architecture review, and prerequisite checks where independent.
6. At each checkpoint capture evidence, unresolved questions, owner, due date, and impact.
7. Review production-readiness risks before recommending go-live.
8. Verify first value with observable customer behavior or business evidence, not task completion alone.

## Decisions
Choose the smallest reversible path that validates the highest-risk assumption first. Escalate any required roadmap, contract, security exception, or destructive change.

## Outputs
Onboarding plan, milestone status, risk list, dependency map, readiness decision, and handoff.

## Quality criteria
No hidden prerequisite; each milestone has owner/evidence; assumptions are labeled; customer outcome remains traceable.

## Failure handling
After two equivalent blocked attempts, stop, document evidence, identify the blocking owner, and escalate.

## Stop conditions
Missing authorization, unresolved security/privacy issue, incompatible product capability, or customer objective that cannot be validated safely.