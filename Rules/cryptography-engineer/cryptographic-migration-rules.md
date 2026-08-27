# Cryptographic Migration Rules

## Purpose
Enable algorithm and key transitions without silent downgrade, data loss, or trust breakage.

## Scope
Algorithm replacement, parameter upgrades, provider changes, key migration, and protocol version transitions.

## MUST
- Inventory affected data, keys, protocols, clients, trust anchors, and rollback constraints before migration.
- Define coexistence, downgrade prevention, observability, rollback, and completion criteria.
- Validate that old cryptography can be retired without leaving inaccessible data or unauthorized fallback paths.

## MUST NOT
- Perform irreversible cryptographic migration without tested recovery and explicit approval.
- Keep legacy algorithms enabled indefinitely after migration completion.

## SHOULD
- Design crypto-agility before emergency migration is required.

## Exceptions
Irreversible transitions require stronger backup/recovery evidence and accountable approval.

## Verification
Staging rehearsals, compatibility matrices, telemetry, rollback tests, inventory reconciliation, and post-migration scans.