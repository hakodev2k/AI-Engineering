# Change and Approval Rules

## Purpose
Ensure high-risk integration changes do not silently exceed technical authority or operational risk tolerance.

## Scope
Applies to production routing, destructive data operations, security changes, breaking contracts, credential rotation, large dependency changes, and irreversible migrations.

## MUST
- Work MUST distinguish analyze, recommend, prepare, and execute authority.
- Production deployment, destructive data correction, irreversible migration, breaking public contract, security weakening, secret rotation, and high-risk access changes MUST require explicit human approval when applicable.
- Change proposals MUST identify affected systems, blast radius, dependencies, validation, rollback or containment, and owner.
- Approval evidence MUST be captured in an auditable system for material production changes.
- Emergency actions MUST be retrospectively reviewed when normal approval controls are bypassed under an authorized emergency procedure.

## MUST NOT
- MUST NOT force-push, rewrite shared history, delete production data, disable security controls, or alter production routing merely because an automated agent can technically perform the action.
- MUST NOT interpret silence as approval.
- MUST NOT expand implementation scope beyond the authorized change without review.

## SHOULD
- Changes SHOULD be reversible and incrementally deployable where practical.
- Riskier changes SHOULD require stronger evidence and narrower blast radius.

## Exceptions
Emergency exceptions MUST state urgency, authority, risk, containment, evidence, and required follow-up review.

## Verification
Inspect change records, approvals, diffs, deployment history, audit logs, rollback plans, and incident or emergency authorization records.