# Federation and SSO

## Purpose
Establish secure cross-domain trust and single sign-on while controlling issuer trust, claims, session behavior, and failure modes.

## When to use
Use for enterprise SSO, partner federation, identity-provider consolidation, multi-tenant federation, or SSO incident investigation.

## Inputs
Identity providers, service providers, domains, protocols, metadata, claim requirements, certificate/key policy, session requirements, and tenant boundaries.

## Context to inspect
Inspect trust metadata, issuer/audience rules, signing keys, domain discovery, claims transformations, JIT provisioning, logout, fallback login, and account linking.

## Core knowledge
Federation shifts authentication trust rather than eliminating it. A relying party must strictly validate issuer, audience, signature, timestamps, and account binding. SSO improves usability but expands blast radius when the identity provider is compromised.

## Procedure
1. Define trust parties and permitted tenants/domains.
2. Select protocol and metadata exchange method.
3. Establish signing/encryption key lifecycle.
4. Define required claims and transformations.
5. Design deterministic account linking.
6. Restrict issuer and audience acceptance.
7. Define session, logout, and reauthentication behavior.
8. Handle IdP outage and emergency access deliberately.
9. Test key rollover and metadata changes.
10. Monitor anomalous federation and account-linking events.

## Decision points
Use centralized SSO where consistent policy and user experience outweigh dependency concentration. JIT provisioning is convenient but requires lifecycle controls; pre-provisioning provides tighter governance.

## Common failure patterns
Trusting any tenant from a shared issuer, email-only account linking, stale certificates, permissive claim mapping, local-password bypass, and no emergency access design.

## Verification
Test valid and invalid issuers, audiences, signatures, domains, account links, expired assertions, key rollover, logout, and IdP outage behavior.

## Expected output
A federation design with explicit trust, claims, lifecycle behavior, recovery, monitoring, and tests.

## Stop conditions
Escalate when trust scope cannot be constrained, identity linking is ambiguous, or required fallback would bypass security policy.