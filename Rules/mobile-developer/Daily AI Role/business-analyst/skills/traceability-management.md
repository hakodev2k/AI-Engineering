# Traceability Management

## Purpose
Maintain evidence-backed links from business goals through requirements, decisions, acceptance criteria, implementation scope, and verification.

## Trigger
Requirement creation/change, release review, audit request, defect dispute, or scope reconciliation.

## Inputs
Goals, requirements, decision records, acceptance criteria, delivery items, test evidence, release scope.

## Procedure
1. Assign stable IDs to requirements and decisions.
2. Link each requirement to an objective and source/evidence.
3. Link business rules and acceptance criteria to requirements.
4. Link delivery/test artifacts when available.
5. Flag orphan requirements, untested high-risk criteria, stale decisions, and implementation items with no approved requirement.
6. Update links on every approved change rather than duplicating IDs.
7. Preserve superseded states for auditability.

## Outputs
Traceability matrix, orphan report, stale-link report, release coverage view.

## Quality criteria
A reviewer can explain why an item exists, who approved it, what verifies it, and what changes if it is removed.

## Stop conditions
Stop when all in-scope high-risk requirements have source, owner, acceptance, and verification linkage.