# Production Change Safety Rules

## Purpose
Prevent fraud-control changes from causing uncontrolled loss, customer harm, security weakening, or irreversible operational impact.

## Scope
Production rules, models, thresholds, feature pipelines, configuration, integrations, and emergency controls.

## MUST
- Production changes MUST define expected impact, validation evidence, monitoring, owner, and rollback or containment path.
- High-risk deployments, security-control weakening, irreversible data changes, and material access changes MUST require explicit human approval before execution.
- Rollouts MUST use progressive exposure when blast radius is material and progressive delivery is feasible.
- Post-deployment verification MUST confirm both fraud outcomes and system health.
- Emergency changes MUST be documented and retrospectively reviewed.

## MUST NOT
- MUST NOT disable fraud or security controls merely to unblock delivery without authorized risk acceptance.
- MUST NOT execute destructive data operations, force pushes, history rewrites, or irreversible migrations without explicit approval and recovery planning.
- MUST NOT declare a deployment successful solely because it completed technically.

## SHOULD
- Changes SHOULD be reversible by configuration or version rollback where practical.
- Release windows SHOULD reflect monitoring and responder availability for high-risk changes.

## Exceptions
Exceptions require reason, context, evidence, alternatives considered, blast radius, recovery plan, verification, and accountable approval.

## Verification
Inspect pull requests, approvals, deployment records, canary metrics, fraud and false-positive dashboards, rollback tests, incident records, and post-change reviews.