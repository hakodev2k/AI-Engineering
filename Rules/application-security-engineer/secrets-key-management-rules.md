# Secrets and Key Management Rules

## Purpose
Prevent credential disclosure and ensure cryptographic keys and application secrets have controlled lifecycles.

## Scope
Applies to API keys, passwords, signing keys, encryption keys, certificates, connection credentials, and machine identities.

## MUST
- Secrets MUST be stored and distributed through an approved secret-management mechanism appropriate to the environment.
- Access to secrets and keys MUST follow least privilege and be attributable where the platform supports it.
- Rotation, revocation, expiry, backup, and recovery requirements MUST be defined for security-critical keys.
- Cryptographic keys MUST be separated by purpose and environment when reuse would increase blast radius.
- Suspected secret exposure MUST trigger containment and rotation based on risk; deleting the secret from source history alone is insufficient.
- CI/CD and runtime systems MUST prevent secret values from being printed in logs or artifacts.

## MUST NOT
- MUST NOT commit live secrets to source control, examples, fixtures, container images, or documentation.
- MUST NOT transmit secrets through insecure channels or persist them in plaintext where an approved protected store is available.
- MUST NOT share one privileged credential across unrelated workloads solely for convenience.

## SHOULD
- SHOULD prefer short-lived, workload-bound credentials over static secrets.
- SHOULD automate rotation and access review where practical.

## Exceptions
Exceptions require documented necessity, exposure window, compensating controls, owner, rotation plan, and security approval.

## Verification
Use secret scanning, repository/history inspection, IAM review, key inventory, rotation evidence, runtime configuration inspection, and log/artifact checks.