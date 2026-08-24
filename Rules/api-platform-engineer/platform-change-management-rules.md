# Platform Change Management

## Purpose
Control cross-cutting changes whose blast radius spans many APIs and teams.

## Scope
Shared policies, gateways, runtimes, templates, libraries, and platform defaults.

## MUST
- Cross-cutting changes MUST identify affected consumers, compatibility risk, rollout stages, and rollback.
- Default changes MUST be tested against representative existing workloads.
- Large dependency or runtime migrations MUST have explicit approval and measurable exit criteria.
- Temporary compatibility modes MUST have owners and retirement conditions.

## MUST NOT
- MUST NOT assume a shared-platform change is safe because one service passes.
- MUST NOT force migration without documented support window except for approved critical risk.

## SHOULD
- Changes SHOULD be opt-in before becoming defaults when uncertainty or blast radius is high.

## Exceptions
Accelerated changes require evidence of urgency, compensating controls, and approval.

## Verification
Review impact inventory, migration telemetry, compatibility tests, approvals, and rollback readiness.