# DNSSEC Operations

## Purpose
Deploy and operate DNSSEC while preventing validation outages caused by broken signing or delegation chains.

## When to use
DNSSEC enablement, key rollover, DS changes, validation failures, or provider migration.

## Inputs
Zone, signing platform, KSK/ZSK policy, DS records, registrar access, TTLs, validation evidence.

## Context to inspect
DNSKEY, RRSIG, DS, NSEC/NSEC3, signature lifetimes, key states, clocks, parent delegation, automation and alarms.

## Core knowledge
DNSSEC authenticates DNS data; it does not encrypt it. The chain of trust crosses child and parent administrative boundaries, making sequencing critical.

## Procedure
1. Confirm zone health before signing.
2. Select supported algorithms and key lifecycle policy.
3. Generate/manage keys in approved secure storage.
4. Sign and validate zone locally.
5. Publish DNSKEY and allow caches to observe it.
6. Publish matching DS at parent.
7. Validate from independent recursive resolvers.
8. Monitor signature expiration and bogus responses.
9. For rollover, follow prepublication/double-signing timing appropriate to platform.
10. Remove old material only after TTL-safe transition.

## Decision points
Use automated managed signing when provider controls and export/migration requirements are acceptable. Choose NSEC3 only when its limited enumeration resistance is materially needed.

## Common failure patterns
Wrong DS digest, expired signatures, clock skew, removing old keys too early, algorithm mismatch, and migrating providers without coordinating signer state.

## Verification
Use validating resolvers and DNSSEC diagnostic tools to prove complete chain, current signatures, expected DS/DNSKEY match, and successful rollover.

## Expected output
Signing policy, key/DS state, rollover procedure, monitoring, and validation evidence.

## Stop conditions
Stop when registrar/parent coordination is unavailable, key custody violates policy, or existing chain is bogus and remediation timing is uncertain.