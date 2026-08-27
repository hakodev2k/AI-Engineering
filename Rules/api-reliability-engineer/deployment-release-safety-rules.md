# Deployment and Release Safety Rules

## Purpose
Limit reliability risk introduced by API releases and configuration changes.

## Scope
Applies to code, schema, infrastructure, routing, dependency, and production configuration releases affecting APIs.

## MUST
- Production changes MUST have defined success signals and rollback or containment criteria.
- High-risk releases MUST use staged exposure, canaries, or equivalent blast-radius controls where technically feasible.
- Release evaluation MUST include error rate, latency, saturation, and critical business/API outcomes.
- Breaking public-contract changes and irreversible production changes MUST require explicit human approval.
- Rollback procedures MUST account for schema and data compatibility.

## MUST NOT
- MUST NOT continue rollout when predefined reliability guardrails are materially violated without accountable approval.
- MUST NOT assume deployment success means service success.
- MUST NOT make irreversible migrations depend on untested emergency recovery.

## SHOULD
- Changes SHOULD be small enough to attribute failures quickly.
- Automated rollback SHOULD be used only when signals are reliable and rollback itself is safe.

## Exceptions
Exceptions require urgency, risk, alternatives considered, safeguards, approver, and post-change verification.

## Verification
Review deployment records, canary metrics, rollback tests, change diffs, schema compatibility tests, and incident history.