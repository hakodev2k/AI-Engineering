# Break-Glass Access Rules

## Purpose
Provide emergency access without normalizing permanent privileged bypasses.

## Scope
Emergency administration, recovery, identity-provider outage, and severe incident response.

## MUST
- Break-glass access MUST be narrowly scoped, strongly protected, independently monitored, and reserved for defined emergencies.
- Activation MUST create an auditable event and trigger prompt review.
- Credentials or access used during an emergency MUST be rotated, revoked, or resecured after use as appropriate.
- Procedures MUST identify authorized decision makers and recovery steps.

## MUST NOT
- Break-glass accounts MUST NOT be used for routine administration.
- Emergency access MUST NOT depend exclusively on the same identity or secret platform whose failure it addresses.
- Testing MUST NOT leave emergency access unintentionally enabled.

## SHOULD
- Require dual control for the highest-impact emergency operations.
- Exercise break-glass procedures periodically using safe scenarios.

## Exceptions
Any deviation during an active incident must be documented retrospectively with reason, scope, evidence, and accountable incident authority.

## Verification
Review account use, monitoring alerts, exercise records, credential state after activation, access scope, and post-event reviews.