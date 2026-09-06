# Deployment and Rollout Rules

## Purpose
Release inference changes progressively with measurable validation and reliable rollback.

## Scope
Model releases, runtime releases, configuration changes, canaries, traffic splitting, shadowing, rollback, and promotion.

## MUST
- Production rollouts MUST identify the exact model, runtime, image, configuration, and hardware target being promoted.
- High-impact changes MUST use staged rollout or an equivalent mechanism that limits blast radius.
- Promotion criteria MUST include correctness, latency, error, saturation, and resource evidence relevant to the change.
- Rollback procedures MUST be executable without requiring reconstruction of the previous deployment state.
- Breaking serving contracts MUST have approved consumer migration before broad promotion.

## MUST NOT
- MUST NOT promote solely because a deployment is technically healthy while model-serving SLOs regress materially.
- MUST NOT overwrite the only known-good artifact or configuration during rollout.
- MUST NOT continue expansion after defined rollback thresholds are crossed without explicit approval.

## SHOULD
- Use shadow traffic for changes that can be evaluated safely without affecting responses.
- Keep deployment annotations aligned with observability timelines.

## Exceptions
Emergency rollout requires incident authority, minimized blast radius, rollback readiness, and post-change review.

## Verification
Inspect deployment manifests, canary metrics, promotion gates, rollback drills, artifact identities, and traffic-split history.