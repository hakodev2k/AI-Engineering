# Internationalization Release Governance Rules

## Purpose
Ensure locale launches and internationalization changes reach production with explicit readiness evidence, reversibility, and accountable approval.

## Scope
Applies to new locale launches, locale removal, translation updates, runtime internationalization changes, routing changes, and production configuration affecting language behavior.

## MUST
- A new locale MUST have documented readiness criteria covering resource completeness, critical-flow testing, fallback behavior, typography, accessibility, security-sensitive text, and operational ownership.
- Locale-affecting releases MUST identify rollback or containment options before production execution.
- Breaking changes to translation keys, locale routes, stored localized data, or public contracts MUST include compatibility and migration analysis.
- Production locale enablement, locale removal, or high-risk internationalization configuration changes MUST require human approval from the accountable owner.
- Release evidence MUST distinguish verified facts from known gaps, accepted risks, and deferred work.

## MUST NOT
- A locale MUST NOT be marked production-ready solely because translation files are complete.
- Known critical defects in authentication, payments, consent, security warnings, or core navigation MUST NOT be waived without explicit risk acceptance.
- An AI agent MUST NOT execute production locale enablement, destructive resource removal, or irreversible migration without authorized human approval.

## SHOULD
- Locale launches SHOULD use staged exposure when rollback, telemetry, or user impact warrants it.
- Post-release monitoring SHOULD compare localized critical journeys with established baselines.

## Exceptions
Exceptions require rationale, evidence, risk owner, compensating controls, expiration/review date, and explicit approval appropriate to the impact.

## Verification
Inspect release checklists, test results, localization coverage reports, approvals, migration/rollback plans, telemetry, deployment diffs, and post-release defect signals.