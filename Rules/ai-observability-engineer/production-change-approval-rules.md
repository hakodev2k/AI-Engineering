# Production Change Approval Rules

## Purpose
Define authority boundaries for observability changes that can alter production behavior, security posture, telemetry availability, cost, or incident detection.

## Scope
Applies to production instrumentation, collectors, sampling, retention, dashboards used for release gates, alerting, access controls, exporters, and telemetry backends.

## MUST
- Changes that can materially weaken production detection, security auditability, privacy controls, or telemetry availability MUST receive human approval from the accountable owner before execution.
- Production changes MUST have a documented impact assessment, validation plan, rollback or recovery path, and post-change verification.
- Destructive telemetry-store changes, major retention reductions, disabling critical alerts, weakening redaction, or broadening sensitive-data access MUST require explicit approval.
- An AI agent MAY analyze, recommend, generate configuration, or prepare a change, but MUST distinguish those actions from executing it.
- Emergency changes MUST be documented after stabilization and reviewed for residual risk.

## MUST NOT
- An AI agent MUST NOT silently execute production configuration changes, disable security controls, or remove critical telemetry beyond its granted authority.
- Critical alerts MUST NOT be disabled merely to unblock deployment or reduce noise without approved risk handling.
- Irreversible deletion of required audit or incident evidence MUST NOT occur without approved retention and legal/governance checks where applicable.

## SHOULD
- Prefer reversible, scoped, canary changes with measurable success criteria.
- Use peer review for high-impact schema, collector, or alerting changes.

## Exceptions
Only documented emergency procedures or pre-authorized low-risk change classes may bypass normal approval, and their scope MUST remain bounded.

## Verification
Inspect change tickets or approval records, configuration diffs, deployment logs, rollback plans, access changes, and post-change telemetry validation.