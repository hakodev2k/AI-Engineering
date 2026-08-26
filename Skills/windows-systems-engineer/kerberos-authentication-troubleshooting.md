# Kerberos Authentication Troubleshooting

## Purpose
Diagnose Windows integrated-authentication failures without weakening security or masking identity, DNS, SPN, delegation, or time problems.

## When to use
Use for repeated credential prompts, Kerberos/NTLM fallback, service authentication failures, double-hop issues, or SPN-related incidents.

## Inputs
User/service identity, client, target service, hostname used, timestamps, SPNs, delegation model, tickets, DNS, and relevant logs.

## Preconditions
Avoid changing SPNs or delegation until service ownership is established. Preserve evidence from both working and failing transactions.

## Context to inspect
`klist`, `setspn`, DNS, time synchronization, service account configuration, security logs, Kerberos events, application pool/service identity, delegation settings, and authentication protocol actually negotiated.

## Core knowledge
Kerberos relies on correct names, SPNs, reachable KDCs, synchronized time, valid tickets, and service-account key material. Duplicate/missing SPNs and hostname aliases commonly cause failures. Delegation expands trust and must be minimized.

## Procedure
1. Identify client, user, service, hostname, and protocol for the failing transaction.
2. Confirm DNS and time are correct.
3. Determine whether Kerberos was attempted or NTLM used.
4. Inspect ticket cache and relevant service tickets.
5. Map the requested service name to its expected SPN and account.
6. Search for missing or duplicate SPNs.
7. Inspect service account password/key changes and delegation only if the flow requires it.
8. Clear/reacquire tickets only after capturing evidence.
9. Correct the narrow identity/name configuration issue.
10. Validate with fresh tickets and security logs.

## Decision points
Prefer Kerberos constrained delegation or modern identity patterns over unconstrained delegation. Do not force NTLM merely to restore functionality unless explicitly approved as temporary risk acceptance.

## Common failure patterns
Blindly purging tickets, registering duplicate SPNs, enabling unconstrained delegation, ignoring aliases, treating clock skew as network failure, and validating only with an administrator account.

## Verification
Confirm Kerberos tickets are issued for the intended SPN, authentication succeeds under representative identities, no unexpected NTLM fallback occurs, and logs show expected principals.

## Expected output
A precise authentication root cause and least-privilege correction.

## Stop conditions
Stop for forest trust changes, broad delegation changes, unknown SPN ownership, or security-sensitive fallback requiring risk approval.