# Privacy Production Change Approval Rules

## Purpose
Prevent high-risk privacy-impacting production changes from exceeding authorized engineering scope.

## Scope
Applies to production deployments and configuration changes affecting personal-data collection, access, retention, deletion, sharing, residency, encryption, or privacy controls.

## MUST
- Changes that materially broaden personal-data access, collection, sharing, retention, or processing purpose MUST receive accountable human approval before production execution.
- Destructive data operations, irreversible migrations, bulk exports, security-control weakening, and residency changes MUST have explicit approval and rollback or recovery planning where possible.
- Change plans MUST distinguish analysis, recommendation, preparation, and execution authority.
- High-risk changes MUST include verification criteria and post-change evidence.

## MUST NOT
- An AI agent or automation MUST NOT silently execute a privacy-sensitive production action beyond explicitly granted authority.
- Approval MUST NOT be inferred from prior unrelated approvals.
- Emergency urgency MUST NOT justify undocumented permanent weakening of privacy controls.

## SHOULD
- High-risk changes SHOULD be reversible, staged, and observable.
- Two-person review SHOULD be used for changes with large data-subject or disclosure blast radius.

## Exceptions
Emergency actions require the narrowest feasible scope, documented incident context, authorized decision maker, and retrospective review.

## Verification
Inspect change records, approvals, diffs, deployment logs, rollback plans, audit events, and post-change validation results.