# Production Testing

## Purpose
Control the exceptional case where AI red-team validation must occur in production.

## Scope
Live models, agents, users, data, integrations, and production infrastructure.

## MUST
- Obtain explicit human approval specifying target, technique, window, blast radius, monitoring, and abort criteria.
- Use the minimum privileges, traffic, and side effects needed to answer the test question.
- Coordinate rollback or containment ownership before execution.

## MUST NOT
- Perform destructive actions, data deletion, access expansion, or security-control weakening without specific approval.
- Expose real users to undisclosed material risk merely to improve test realism.

## SHOULD
Use canaries, shadow paths, feature flags, synthetic identities, and rate limits.

## Exceptions
Emergency validation still requires accountable authorization and post-action documentation.

## Verification
Review approval records, telemetry, test traffic, side effects, abort readiness, and cleanup confirmation.