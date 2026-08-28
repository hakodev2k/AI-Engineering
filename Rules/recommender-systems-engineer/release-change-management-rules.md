# Release and Change Management Rules

## Purpose
Control recommendation-system changes so model, data, configuration, and serving updates remain reversible, attributable, and safe.

## Scope
Applies to model releases, feature launches, index migrations, ranking configuration, dependency upgrades, data-pipeline changes, and traffic shifts.

## MUST
- Every production change MUST identify the affected model, feature, index, configuration, or service versions and its expected user impact.
- Material changes MUST define rollout stages, success criteria, guardrails, rollback criteria, and an accountable owner before execution.
- Model and configuration rollouts MUST support fast identification of the active version for any investigated request or time window.
- Changes that alter public behavior, policy enforcement, sensitive-data use, or major dependencies MUST receive the appropriate human review before production execution.
- Rollback procedures MUST be validated before high-risk or difficult-to-reverse changes.

## MUST NOT
- MUST NOT perform an irreversible production migration without an approved recovery or compensating strategy.
- MUST NOT combine multiple unrelated high-risk changes when doing so prevents attribution of regressions.
- MUST NOT bypass experiments, staged rollout, or required approval solely to meet a delivery deadline.

## SHOULD
- High-risk releases SHOULD use canary or limited-cohort validation before broad traffic exposure.
- Release records SHOULD link evaluation evidence, experiment results, configuration diffs, and operational dashboards.

## Exceptions
Exceptions require documented urgency, alternatives considered, residual risk, rollback or containment plan, and explicit approval by the responsible authority.

## Verification
Inspect release records, Git or configuration diffs, model registry entries, rollout dashboards, approval evidence, canary results, and rollback tests.