# Change Control and Approval Rules

## Purpose
Control high-impact analytical changes that can alter decisions, financial reporting, or public-facing metrics.

## Scope
Metric logic, governed dashboards, recurring reports, semantic definitions, and high-impact analytical workflows.

## MUST
- Review material definition, filter, source, and aggregation changes before release.
- Assess downstream impact and backward compatibility.
- Record rationale, evidence, approver, effective date, and rollback plan for high-impact changes.
- Obtain human approval before publishing breaking metric changes, destructive source changes, or changes that weaken privacy or access controls.

## MUST NOT
- MUST NOT silently rewrite historical meaning of a governed metric.
- MUST NOT bypass review because a change appears analytically simple.

## SHOULD
- Use staged validation and side-by-side comparison for material changes.

## Exceptions
Emergency corrections may use expedited approval when ongoing publication is materially harmful, followed by retrospective review.

## Verification
Inspect change records, diffs, approvals, impact analysis, comparison results, and rollback evidence.