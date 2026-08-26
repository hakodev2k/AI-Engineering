# Mobile Security Incident Response Rules

## Purpose
Contain and remediate mobile security incidents while preserving evidence and minimizing additional user harm.

## Scope
Credential compromise, malicious releases, abused APIs, leaked keys, dependency compromise, and active exploitation affecting mobile clients.

## MUST
- Establish incident severity from evidence, affected assets, exploitability, exposure, and user impact.
- Preserve relevant build, release, telemetry, configuration, and version evidence before destructive remediation where feasible.
- Identify which client versions remain exposed and account for mobile update latency.
- Coordinate server-side containment when waiting for client upgrades would leave users exposed.
- Require human approval for high-risk actions such as production configuration changes or secret rotation unless preauthorized incident procedures explicitly permit them.

## MUST NOT
- Assume publishing a fixed application version immediately removes exposure.
- Destroy useful evidence without an explicit incident need.
- Communicate unverified root-cause claims as facts.

## SHOULD
- Design containment controls that can be rolled back safely.
- Capture lessons as durable engineering controls and tests.

## Exceptions
Emergency deviations require accountable incident authority, recorded rationale, scope, and retrospective review.

## Verification
Review incident timeline, affected-version analysis, containment evidence, approvals, remediation tests, rollout telemetry, and post-incident actions.