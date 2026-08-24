# Secrets and Key Management
## Purpose
Protect credentials and cryptographic material across large distributed fleets.
## Scope
Keys, certificates, tokens, passwords, and secret delivery.
## MUST
- Secrets MUST be unique or scoped narrowly enough to limit blast radius.
- Secrets MUST be encrypted in transit and at rest using approved mechanisms.
- Rotation and revocation MUST be operationally tested.
## MUST NOT
- MUST NOT commit secrets to source, images, logs, or ordinary configuration.
- MUST NOT expose private keys through diagnostic interfaces.
- MUST NOT rotate production fleet credentials without approved rollout and recovery planning.
## SHOULD
- Hardware-backed key storage SHOULD be used for high-value device identities when supported.
## Exceptions
Legacy storage requires compensating controls, migration plan, and security approval.
## Verification
Run secret scanning, inspect provisioning, test rotation/revocation, and review access logs and key storage.