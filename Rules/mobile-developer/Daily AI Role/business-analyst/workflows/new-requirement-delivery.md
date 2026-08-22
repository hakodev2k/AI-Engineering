# New Requirement Delivery Workflow

## Trigger
A stakeholder requests new or materially changed business behavior.

## Goal
Produce an approved, testable, traceable requirement package.

## Stages
1. **Intake** — capture objective, requester, deadline, impact hypothesis, evidence, and scope boundary.
2. **Discovery** — Elicitation Specialist gathers facts/rules/questions while Process Modeler inspects current workflow in parallel when process impact exists.
3. **Synthesis checkpoint** — Business Analyst consolidates findings, separates facts from assumptions, and identifies blocking decisions.
4. **Definition** — write requirements, rules, examples, non-goals, and acceptance criteria.
5. **Independent review** — Acceptance Verifier and Traceability Reviewer run in parallel.
6. **Resolution** — fix ambiguity; route business decisions to named owners. Maximum two review-repair cycles before escalation.
7. **Approval** — obtain approval from authorized stakeholder for scope/business rules.
8. **Handoff** — publish baseline, dependencies, risks, open non-blocking questions, and acceptance package.

## Shared source of truth
`requirements` and `decisions` use stable IDs from `schemas/requirement.schema.json` and `templates/decision-record.md`.

## Failure handling
If required decision evidence is unavailable, status becomes `blocked` rather than guessed.

## Definition of Done
Objective linked; scope explicit; business rules testable; acceptance reviewed; conflicts resolved/escalated; owner/approval recorded; traceability complete.