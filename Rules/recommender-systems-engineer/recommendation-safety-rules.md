# Recommendation Safety Rules

## Purpose
Prevent recommendation logic from amplifying unsafe, prohibited, or otherwise ineligible content and actions.

## Scope
Applies to candidate eligibility, safety classifiers, policy filters, ranking constraints, fallback behavior, and safety-sensitive surfaces.

## MUST
- Safety and policy eligibility rules MUST be enforced at a defined stage with documented precedence over optimization objectives.
- Safety-critical classifiers and filters MUST have versioned thresholds, owners, and rollback procedures.
- Fallback and degraded modes MUST preserve mandatory safety exclusions.
- Safety regressions MUST be included in experiment guardrails and incident criteria.
- Changes that weaken a safety control MUST require explicit human approval.

## MUST NOT
- MUST NOT suppress safety signals merely to improve engagement, coverage, or revenue metrics.
- MUST NOT bypass policy filters during backfills, exploration, cold start, or outage recovery.
- MUST NOT claim a safety improvement without validation evidence.

## SHOULD
- Defense in depth SHOULD be used for high-risk surfaces where one classifier failure could cause serious harm.
- Safety decisions SHOULD be auditable without exposing sensitive user data.

## Exceptions
Exceptions require documented policy basis, bounded scope, evidence, rollback readiness, and authorized approval.

## Verification
Inspect filter ordering, threshold configuration, policy tests, experiment guardrails, degraded-mode tests, incident runbooks, and approval records.