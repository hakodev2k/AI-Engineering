# Deployment and Rollback

## Purpose
Prevent gateway releases from creating uncontrolled edge outages.

## Scope
Gateway binaries, images, plugins, configuration bundles, and rollout strategy.

## MUST
- Every production release MUST have defined health signals, rollback criteria, and a verified rollback mechanism.
- Deployment strategy MUST account for connection draining and long-lived traffic where relevant.
- Compatibility with current configuration and critical plugins MUST be validated before broad rollout.
- Production deployment execution MUST require appropriate human authorization.

## MUST NOT
- MUST NOT treat rollback as viable if it has never been validated for the changed artifact class.
- MUST NOT continue rollout when agreed abort criteria are met without explicit incident authority.
- MUST NOT combine unrelated high-risk changes when separation materially improves diagnosis or rollback.

## SHOULD
- Progressive rollout SHOULD precede full deployment.
- Release evidence SHOULD include gateway and upstream health.

## Exceptions
Emergency deployment requires incident justification, accountable authorization, and immediate verification.

## Verification
Review release manifest, compatibility tests, canary metrics, drain behavior, rollback test evidence, and post-deployment synthetic checks.