# Private Key Custody Rules

## Purpose
Prevent unauthorized use, disclosure, or loss of private keys.

## Scope
Private keys throughout storage, backup, activation, transfer, and retirement.

## MUST
- Custody MUST enforce least privilege, strong authentication, and separation of duties for high-impact keys.
- Access to CA private-key operations MUST be attributable and auditable.
- Backup and recovery controls MUST provide security equivalent to primary custody.
- Suspected key exposure MUST trigger incident handling and revocation-impact assessment.

## MUST NOT
- MUST NOT share operator credentials or plaintext private keys.
- MUST NOT export a non-exportable key by weakening module controls.
- MUST NOT retain retired key material beyond documented cryptographic or legal need.

## SHOULD
- Dual control SHOULD protect root and high-assurance issuing keys.

## Exceptions
Exceptions require owner, rationale, duration, compensating controls, and security approval.

## Verification
Review HSM/KMS policy, access logs, backup controls, privileged identities, and retention records.