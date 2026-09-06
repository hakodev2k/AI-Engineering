# Governance and Ownership Rules

## Purpose
Keep graph domains accountable, reviewable, and sustainable across organizational boundaries.

## Scope
Domain ownership, stewardship, approval boundaries, documentation, deprecation, risk acceptance, and decision records.

## MUST
- Every production graph domain MUST have an accountable technical or data owner.
- Material semantic changes MUST identify approvers from affected domains or consumers.
- Ownership transfers MUST preserve unresolved risks, exceptions, and operational responsibilities.
- Significant architecture or ontology decisions MUST record constraints, alternatives, and consequences.
- Temporary exceptions MUST have an owner and expiry or review date.

## MUST NOT
- MUST NOT publish shared graph semantics with no accountable owner.
- MUST NOT treat lack of consumer feedback as proof that a breaking change is safe.
- MUST NOT leave deprecated graph elements indefinitely without migration or retirement ownership.

## SHOULD
- Maintain discoverable documentation for domain boundaries and review expectations.
- Periodically review stale ownership and unresolved exceptions.

## Exceptions
Emergency temporary ownership requires explicit escalation and follow-up assignment.

## Verification
Inspect ownership metadata, decision records, approval history, exception registers, and deprecation tracking.