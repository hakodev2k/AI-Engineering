# API Strategy Rules

## Purpose
Ensure API portfolios evolve from explicit product and platform intent rather than isolated implementation choices.

## Scope
Applies to public, partner, internal, synchronous, asynchronous, and event-driven APIs governed by the organization.

## MUST
- Every material API MUST have a defined audience, business capability, ownership boundary, lifecycle state, and support expectation.
- New APIs MUST justify why an existing contract cannot safely satisfy the requirement.
- Governance decisions MUST distinguish external compatibility obligations from internal implementation freedom.
- API strategy changes MUST document effects on consumers, security, operability, cost, and migration effort.
- Cross-domain APIs MUST have an accountable owner for conflict resolution and contract stewardship.

## MUST NOT
- Teams MUST NOT create duplicate APIs for the same capability solely to avoid coordination.
- Governance MUST NOT mandate technology choices without a documented interoperability, risk, or lifecycle reason.
- An API MUST NOT be treated as an implementation detail once independent consumers depend on it.

## SHOULD
- API portfolios SHOULD prefer a small number of stable capability-oriented contracts over endpoint proliferation.
- Strategic exceptions SHOULD be time-bounded when they create permanent platform inconsistency.

## Exceptions
Exceptions require documented context, alternatives considered, consumer impact, risk, exit plan, and accountable approval.

## Verification
Review API catalog entries, architecture decisions, ownership metadata, consumer inventories, and change proposals. Confirm each API has clear purpose, ownership, lifecycle, and non-duplicative scope.