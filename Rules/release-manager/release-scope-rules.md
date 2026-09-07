# Release Scope Rules

## Purpose
Control exactly what enters a release so approved scope remains traceable and late changes do not introduce unmanaged risk.

## Scope
Applies from release candidate formation through production completion.

## MUST
- Release scope MUST identify every deployable artifact, configuration change, schema/data change, feature activation, and externally visible contract change included in the release.
- Every scoped change MUST trace to an approved requirement, defect, operational need, or risk treatment and an accountable owner.
- Scope changes after readiness review MUST trigger impact assessment and re-evaluation of affected gates.
- Removed or deferred items MUST be reflected consistently in release notes, deployment inputs, and stakeholder expectations.
- The final production scope MUST be compared with the approved candidate before execution.

## MUST NOT
- Unreviewed changes MUST NOT be added because they appear low risk or convenient.
- Scope MUST NOT rely on ambiguous labels such as “latest” when immutable versions or commit identifiers are available.
- Release Managers MUST NOT conceal scope uncertainty to preserve a target date.

## SHOULD
- Scope SHOULD be minimized when reducing blast radius improves recovery or diagnosis.
- Closely coupled changes SHOULD be explicitly grouped with their dependency rationale.

## Exceptions
Emergency scope additions require documented urgency, evidence, risk, validation, compensating controls, accountable approval, and post-release review.

## Verification
Compare approved tickets/changes, immutable artifact identifiers, configuration manifests, migration inventory, feature flags, release notes, and deployment diff. Any mismatch blocks approval until reconciled.