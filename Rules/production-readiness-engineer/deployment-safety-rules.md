# Deployment Safety Rules
## Purpose
Reduce avoidable production failures during deployment.
## Scope
Production deployment mechanisms, rollout plans, feature activation, and release execution.
## MUST
- Production deployment MUST use a defined, reviewed procedure appropriate to risk.
- High-impact deployments MUST use staged rollout or equivalent containment when feasible.
- Automation MUST fail safely and surface actionable failure state.
- Release artifacts MUST be traceable to reviewed source and a known build.
- Preconditions, post-deployment checks, and abort criteria MUST be defined before execution.
- Human approval MUST be required when project policy or risk level demands it.
## MUST NOT
- Unreviewed local artifacts MUST NOT be substituted for approved production artifacts.
- Health checks or security controls MUST NOT be bypassed merely to complete deployment.
- An AI agent MUST NOT initiate production deployment without explicit authorization.
## SHOULD
- Prefer immutable artifacts and progressive delivery.
## Exceptions
Emergency deviations require incident context, approval, compensating controls, and post-event review.
## Verification
Inspect pipeline config, artifact provenance, approvals, rollout plan, deployment logs, and post-deploy checks.