# Wallet and Key Management

## Purpose
Design signing and custody flows that minimize key exposure, separate duties, support rotation/recovery, and make irreversible actions auditable.

## When to use
Use for relayers, treasury operations, deployers, multisigs, custodial services, hot wallets, and privileged automation.

## Inputs
Signer roles, transaction classes, value at risk, latency requirements, custody constraints, recovery requirements, supported wallet types.

## Preconditions
Privileged actions and acceptable trust assumptions are identified.

## Context to inspect
Key storage, HSM/KMS/MPC/multisig usage, environment secrets, CI/CD credentials, signer policies, nonce handling, address allowlists, rotation procedures, audit logs.

## Core knowledge
Private-key compromise usually bypasses application security. Strong systems reduce online key scope, separate approval from signing, bind signatures to reviewed intent, and retain recovery paths without creating unrestricted master keys.

## Procedure
1. Inventory all keys and the actions each can authorize.
2. Classify keys by value at risk and required availability.
3. Eliminate plaintext keys from repositories, logs, and general application configuration.
4. Prefer hardware-backed or threshold signing for high-impact roles.
5. Separate deployer, operator, treasury, and emergency authorities.
6. Add transaction policy checks such as chain, destination, selector, amount, and rate limits.
7. Define key rotation before deployment.
8. Define lost/compromised-key response and role revocation.
9. Log signing requests and approvals without leaking secrets.
10. Test rotation, signer loss, and denied-policy scenarios.

## Decision points
Use hot keys only when latency/automation requires them and constrain their balances/permissions. Use multisig or MPC for high-value shared authority.

## Common failure patterns
Shared seed phrases, production keys in CI variables without isolation, unrestricted automation wallets, no rotation plan, and relying on address secrecy.

## Verification
Review key inventory, attempt unauthorized signing paths, simulate rotation/recovery, and verify audit records.

## Expected output
Key hierarchy, custody model, signing policies, rotation/recovery runbook, and test evidence.

## Stop conditions
Do not deploy when high-value keys cannot be isolated, rotated, or revoked safely.