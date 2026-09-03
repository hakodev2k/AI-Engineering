# Change Governance Rules

## Purpose
Make production flag changes intentional, reviewable, and reversible.

## Scope
Applies to manual edits, API-based configuration changes, automation, imports, and policy changes.

## MUST
- Production-impacting changes MUST identify purpose, expected effect, owner, and rollback action.
- High-risk changes MUST receive independent review or required approval before execution.
- Large configuration changes MUST provide a preview or dry-run when technically feasible.
- Automated changes MUST be attributable to a specific workflow and source revision.
- Change history MUST be retained long enough to support rollback and incident investigation.

## MUST NOT
- MUST NOT perform unreviewed broad production edits merely to save time.
- MUST NOT hide configuration changes inside unrelated deployment steps.
- MUST NOT treat a successful platform response as proof that resulting application behavior is correct.

## SHOULD
- Routine changes SHOULD be policy-validated automatically before execution.

## Exceptions
Emergency incident changes may use defined emergency authority and require post-incident review.

## Verification
Inspect approvals, configuration diffs, preview output, audit trails, workflow identity, and post-change validation evidence.