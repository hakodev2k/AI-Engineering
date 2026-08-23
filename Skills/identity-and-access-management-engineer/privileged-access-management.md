# Privileged Access Management

## Purpose
Control administrative and high-impact access with stronger approval, authentication, session, credential, and audit controls.

## When to use
Use for infrastructure admins, production access, directory admins, database admins, break-glass paths, and sensitive support operations.

## Inputs
Privileged roles, systems, approval rules, session tooling, credential stores, emergency requirements, audit obligations.

## Context to inspect
Admin groups, standing privileges, vaults, bastions, JIT/JEA controls, session recording, emergency accounts, credential rotation.

## Core knowledge
Privileged access should be time-bound, attributable, purpose-limited, strongly authenticated, and observable. Standing privilege increases blast radius.

## Procedure
1. Inventory privileged identities and permissions.
2. Remove shared administrator accounts where attribution is required.
3. Separate admin identities from daily-use identities.
4. Replace standing access with just-in-time elevation where practical.
5. Require stronger MFA and device posture.
6. Define approval and ticket linkage for sensitive roles.
7. Vault and rotate privileged credentials.
8. Record or log privileged sessions and commands where appropriate.
9. Define break-glass access and post-use review.
10. Review privilege usage and stale assignments regularly.

## Decision points
Use approval gates when risk warrants them; avoid adding approval latency to low-risk automation that can be constrained technically.

## Common failure patterns
Permanent global-admin membership, unmonitored emergency accounts, shared passwords, stale service admin credentials, and privileged sessions from unmanaged devices.

## Verification
Test elevation, expiry, revocation, emergency use, rotation, and audit completeness.

## Expected output
Privileged-access model, role tiers, JIT flow, emergency procedure, and evidence requirements.

## Stop conditions
Escalate when critical administration cannot be made attributable or emergency access cannot be recovered safely.