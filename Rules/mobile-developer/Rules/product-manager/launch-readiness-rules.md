# Launch Readiness Rules
## Purpose
Prevent avoidable customer and operational failures at release.
## Scope
Launch criteria, rollout, support readiness, communications, rollback, and post-launch monitoring.
## MUST
- Define launch criteria, target audience, operational ownership, support readiness, monitoring, rollback or disable path, and success metrics.
- Confirm known risks and unresolved defects are accepted by accountable owners before launch.
- Monitor agreed guardrails after release and respond to material regressions.
## MUST NOT
- Launch solely because a calendar date was announced when critical readiness criteria are unmet.
- Remove rollback or kill-switch capability without explicit risk acceptance where reversibility is practical.
## SHOULD
- Prefer staged rollout for material risk when infrastructure supports it.
## Exceptions
Emergency fixes may use abbreviated launch review with incident authority and post-release verification.
## Verification
Inspect launch checklist, risk acceptance, support documentation, rollout plan, dashboards, and rollback evidence.