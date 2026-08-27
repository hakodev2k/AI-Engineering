# Secret Rotation

## Purpose
Design and execute secret rotation without breaking consumers, losing rollback capability, or leaving old credentials valid longer than necessary.

## When to use
Use for scheduled rotation, suspected exposure, personnel changes, policy changes, or migration to stronger credentials.

## Inputs
- Secret type and owner
- Consumers and dependencies
- Rotation API or manual process
- Availability requirements
- Revocation constraints

## Context to inspect
Inspect all consumers, caches, replicas, deployment cadence, failover paths, credential overlap support, and audit history.

## Core knowledge
Safe rotation is a state transition, not merely generating a new value. Senior practice accounts for propagation delay, dual-validity windows, rollback, dependency ordering, and revocation proof.

## Procedure
1. Confirm scope and all known consumers.
2. Determine whether the provider supports overlap or versioned credentials.
3. Create the replacement with equivalent or reduced privilege.
4. Distribute it through the authoritative secret path.
5. Update consumers in a controlled order.
6. Observe authentication success and error rates.
7. Verify every consumer has switched.
8. Revoke the previous credential.
9. Confirm old credential use fails.
10. Record evidence and next rotation date.

## Decision points
Use overlapping validity when zero downtime is required and the provider supports two credentials. Use coordinated cutover when overlap would materially increase risk. Emergency rotation should prioritize containment over convenience.

## Common failure patterns
- Revoking before consumers update
- Forgetting disaster-recovery consumers
- Rotating the stored value but not external provider credentials
- Infinite overlap between old and new credentials
- No proof that the old credential stopped working

## Verification
Verify new authentication succeeds across representative consumers, old authentication fails after revocation, monitoring is clean, and no stale references remain.

## Expected output
A completed rotation with cutover evidence, revocation proof, affected systems, and follow-up actions.

## Stop conditions
Stop when consumer inventory is incomplete, the provider cannot safely overlap credentials and downtime is unapproved, or evidence indicates unknown active consumers.