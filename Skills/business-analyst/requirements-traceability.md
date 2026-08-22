# Requirements Traceability

## Purpose
Maintain clear links from business objectives through requirements, rules, delivery items, tests, and released outcomes so changes can be assessed reliably.

## When to use
Use for medium-to-large initiatives, regulated work, cross-system changes, long-running programs, and scopes with frequent change.

## Inputs
Objectives, requirements, business rules, stories, designs, tests, defects, decisions, and release records.

## Preconditions
Artifacts use stable identifiers or another reliable linking mechanism.

## Context to inspect
Requirement hierarchy, dependencies, acceptance criteria, implementation scope, test evidence, change history, and release status.

## Core knowledge
Traceability should support decisions, not create administrative overhead. Focus on relationships needed to assess coverage, impact, compliance, and orphaned work.

## Procedure
1. Define the traceability levels needed for the initiative.
2. Assign stable identifiers to important requirements and rules.
3. Link detailed requirements to business objectives.
4. Link delivery items and acceptance criteria to requirements.
5. Link tests and evidence to acceptance conditions.
6. Record dependencies and derived requirements.
7. Detect requirements without implementation or tests.
8. Detect delivery work without a valid business requirement.
9. Update links when scope changes.
10. Review traceability before release and closure.

## Decision points
Use lightweight links in backlog tools for agile delivery; use a formal matrix when auditability or multi-vendor coordination demands it.

## Common failure patterns
Creating traceability once and never maintaining it, linking everything to everything, and tracking low-value details that do not support decisions.

## Verification
Confirm critical objectives have downstream coverage and delivered items have an approved source requirement and verification evidence.

## Expected output
A current traceability model showing coverage, dependencies, status, and orphaned artifacts.

## Stop conditions
Escalate when artifact ownership is unclear or delivery proceeds without an authoritative requirement baseline.