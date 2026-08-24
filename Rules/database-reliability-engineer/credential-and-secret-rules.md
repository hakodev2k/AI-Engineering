# Credential and Secret Rules

## Purpose
Prevent database credentials and cryptographic secrets from becoming persistent attack paths.

## Scope
Passwords, certificates, keys, connection secrets, tokens, and rotation workflows.

## MUST
- Store secrets in approved secret-management systems.
- Rotate privileged and application credentials according to risk and compromise events.
- Scope credentials to the minimum databases, actions, and lifetime required.
- Verify dependent clients after rotation without exposing secret values.

## MUST NOT
- Do not commit credentials to source control, scripts, tickets, or chat.
- Do not log passwords, tokens, private keys, or full connection secrets.
- Do not reuse privileged credentials across unrelated environments.

## SHOULD
- Prefer short-lived workload identity or certificate-based authentication where supported.

## Exceptions
Legacy exceptions require compensating controls, owner, remediation plan, and expiry.

## Verification
Inspect secret stores, rotation records, repository scanning, logging configuration, and credential inventories.