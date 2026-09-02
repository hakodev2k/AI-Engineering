# Root CA

## Purpose
Protect the highest-value trust anchors from compromise and accidental misuse.

## Scope
Applies to root CA keys, systems, ceremonies, backups, activation, signing, and retirement.

## MUST
- Root CA private keys MUST be generated and used inside approved hardware-backed cryptographic protection.
- Root signing operations MUST follow a documented ceremony with authorized participants, recorded evidence, and independent verification.
- Root CA activation MUST be limited to explicitly approved operations.
- Root key backups MUST receive protection equivalent to or stronger than the active key.

## MUST NOT
- MUST NOT export root private keys in plaintext.
- MUST NOT connect an offline root CA to general-purpose networks.
- MUST NOT perform ad hoc root signing outside the approved ceremony.
- MUST NOT reuse root keys for subordinate or application signing purposes.

## SHOULD
- Root CA systems SHOULD remain powered down and physically secured when not in approved use.
- Ceremonies SHOULD use dual control and separation of duties.

## Exceptions
Any exception requires formal security approval, documented necessity, compensating controls, and post-operation review.

## Verification
Review HSM configuration, ceremony records, access logs, physical controls, backup inventory, and certificate issuance history.