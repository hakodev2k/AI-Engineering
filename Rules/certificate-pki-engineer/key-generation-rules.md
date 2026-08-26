# Key Generation Rules

## Purpose
Ensure cryptographic keys originate in controlled, auditable conditions.

## Scope
CA, responder, service, signing, and administrative keys.

## MUST
- Keys MUST use approved algorithms, sizes, randomness sources, and cryptographic modules appropriate to their assurance level.
- High-value CA keys MUST be generated through an approved ceremony with role separation and retained evidence.
- Key identifiers and custody metadata MUST be recorded without exposing private material.

## MUST NOT
- MUST NOT generate production CA keys on unmanaged endpoints.
- MUST NOT copy private keys into tickets, chat, source control, or ordinary logs.
- MUST NOT claim secure generation without configuration or ceremony evidence.

## SHOULD
- Non-exportable keys SHOULD be preferred when operational requirements permit.

## Exceptions
Any exportability or nonstandard-generation exception requires risk analysis, compensating controls, and security approval.

## Verification
Inspect module configuration, algorithm parameters, ceremony logs, inventory records, and key-export settings.