# Change Impact Rules

## Purpose
Prevent software changes from silently invalidating compliance assumptions, controls, or evidence.

## Scope
Applies to code, architecture, infrastructure, dependencies, data flows, configuration, vendors, and operating processes.

## MUST
- Material changes MUST be assessed for impact on applicable obligations, controls, evidence, and certifications before release.
- Change assessment MUST identify affected control owners and required re-verification.
- Compliance-sensitive changes MUST have explicit acceptance criteria before implementation is considered complete.
- High-risk changes MUST preserve rollback or another approved recovery path when feasible.

## MUST NOT
- MUST NOT assume a previously compliant state remains valid after material architecture or data-flow changes.
- MUST NOT close change review while required compliance evidence is missing.

## SHOULD
- Integrate impact checks into engineering change and pull-request workflows.

## Exceptions
Urgent changes require documented urgency, bounded risk, temporary controls, and post-change verification.

## Verification
Review change records, architecture diffs, control mappings, release gates, re-test results, and approvals.