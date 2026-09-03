# Third-Party Model Rules

## Purpose
Manage security risk from externally developed models and hosted model services.

## Scope
Applies to open-source, commercial, partner-provided, pretrained, foundation, and hosted third-party models.

## MUST
- Record model origin, version, license or usage constraints, security posture, and intended trust boundary before adoption.
- Evaluate third-party models against project-specific security requirements instead of relying only on vendor or community claims.
- Review update mechanisms and prevent automatic production adoption of unreviewed model versions.
- Define exit, rollback, and incident-contact paths for critical third-party dependencies.

## MUST NOT
- Treat vendor certification, popularity, or benchmark quality as complete security evidence.
- Send sensitive inputs to hosted models without approved data-handling and contractual controls.
- Accept opaque model updates that can silently change production behavior.

## SHOULD
- Pin model versions and monitor security advisories, ownership changes, and repository compromise indicators.
- Maintain alternative models or degraded modes for critical services where feasible.

## Exceptions
Expedited adoption requires explicit risk acceptance, bounded exposure, compensating controls, and follow-up review.

## Verification
Inspect provenance records, contracts where applicable, version pins, evaluation results, update settings, and dependency monitoring.