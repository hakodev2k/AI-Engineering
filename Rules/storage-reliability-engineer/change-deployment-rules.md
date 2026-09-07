# Change and Deployment Rules

## Purpose
Control storage changes that can affect durability, compatibility, or availability.

## Scope
Applies to software, firmware, configuration, topology, policy, and storage control-plane changes.

## MUST
- Define expected impact, validation, rollback, and abort criteria before production changes.
- Stage high-risk changes through progressively larger scopes with health gates.
- Obtain human approval for production configuration changes, destructive actions, irreversible migrations, and security weakening.

## MUST NOT
- Roll out broadly when canary evidence is unhealthy or ambiguous.
- Combine unrelated high-risk changes that prevent causal attribution.
- Force a change through failed safety gates solely to meet schedule pressure.

## SHOULD
- Prefer reversible, automated, auditable changes.
- Freeze or slow rollout when redundancy is already degraded.

## Exceptions
Emergency changes require incident authority, documented rationale, bounded blast radius, and retrospective review.

## Verification
Inspect change records, diffs, approvals, canary metrics, rollback tests, and post-deployment health evidence.