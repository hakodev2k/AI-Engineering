# Deployment and Rollback Rules

## Purpose
Release CDN changes with bounded risk and a tested path back to safety.

## Scope
Applies to edge configuration, edge code, certificates, routing, cache policies, and security controls.

## MUST
- Deployments MUST define success criteria and observable rollback triggers.
- Rollback artifacts or previous known-good configuration MUST be available before high-risk rollout.
- Progressive rollout MUST pause when error, latency, security, or origin-load guardrails regress materially.
- Production execution MUST occur only with appropriate human authorization.
- Post-deployment verification MUST test user-visible behavior, not only deployment status.

## MUST NOT
- MUST NOT continue rollout when guardrails indicate unexplained harm.
- MUST NOT rely on manual reconstruction as the only rollback strategy for broad changes.
- MUST NOT declare success before propagation and representative edge locations are verified.

## SHOULD
- Canary changes to limited traffic first.
- Automate rollback for unambiguous pre-approved safety thresholds where appropriate.
- Account for provider propagation delay.

## Exceptions
Urgent mitigations may use accelerated rollout under incident authority, but MUST retain explicit rollback criteria and evidence collection.

## Verification
Inspect deployment and approval records; validate canary metrics; test rollback; sample multiple POPs; confirm effective configuration and origin health after propagation.