# Secrets and Identity Rules

## Purpose
Protect credentials and constrain the authority used by network automation.

## Scope
Service identities, API tokens, SSH keys, certificates, vault access, privilege, and credential rotation.

## MUST
- Automation MUST use dedicated identities with least privilege for the required operation.
- Secrets MUST be retrieved from approved secret storage at runtime and protected in memory and logs as far as practical.
- Privileged operations MUST be attributable to an automation identity and execution context.
- Credential rotation MUST account for dependent jobs and support safe overlap where required.
- Access to production network credentials MUST be auditable.

## MUST NOT
- MUST NOT commit secrets, private keys, passwords, or reusable tokens to source control.
- MUST NOT share personal administrator credentials with unattended automation.
- MUST NOT log authorization headers, passwords, private keys, or complete reusable tokens.

## SHOULD
- Short-lived credentials and workload identity SHOULD replace static secrets where supported.
- Separate identities SHOULD isolate environments and materially different privilege levels.

## Exceptions
Legacy static credentials require documented constraint, restricted storage/access, rotation plan, monitoring, and security approval.

## Verification
Run secret scanning, inspect identity permissions, audit credential retrieval and rotation, review logs for leakage, and test revoked/expired credential behavior.