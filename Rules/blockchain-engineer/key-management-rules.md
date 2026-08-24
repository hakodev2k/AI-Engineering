# Key Management

## Purpose
Protect signing authority and reduce blast radius from key compromise.

## Scope
Developer, operator, deployer, multisig, validator, relayer, and service-account keys.

## MUST
- Keep production private keys out of source code, logs, tickets, chat, and general-purpose configuration files.
- Use least-privilege signing identities and separate duties by environment and risk.
- Define secure provisioning, backup, recovery, revocation, and rotation procedures.
- Require human approval for production key rotation or high-risk authority changes.
- Record auditable evidence of privileged signing operations without exposing secrets.

## MUST NOT
- Reuse production keys in development or test environments.
- Export hardware-backed keys merely for convenience.
- Share one unrestricted key across unrelated operational duties.

## SHOULD
- Use hardware-backed signing, multisig, policy engines, and short-lived credentials where feasible.

## Exceptions
Temporary software-held keys require bounded lifetime, documented risk, compensating controls, and approval.

## Verification
Inspect secret stores, IAM/signing policies, repository scans, key inventories, rotation evidence, and privileged-operation audit trails.