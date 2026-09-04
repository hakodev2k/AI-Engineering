# Authentication State Rules

## Purpose
Protect credentials and ensure authenticated browser automation represents intentional identity and authorization state.

## Scope
Applies to login flows, saved authentication state, tokens, cookies, MFA handling, service identities, and test-user provisioning.

## MUST
- Authentication artifacts MUST be treated as secrets according to their effective privilege and lifetime.
- Automated identities MUST have the minimum permissions required for the workflow.
- Stored authentication state MUST be scoped to the intended environment and protected from unauthorized access.
- Login bypasses used for testing MUST preserve the authorization properties relevant to the scenario and be explicitly documented.
- Authentication failures MUST distinguish invalid credentials, expired state, authorization denial, and environment/configuration defects where evidence permits.

## MUST NOT
- Credentials, session cookies, refresh tokens, or reusable authentication state MUST NOT be committed to source control or emitted to logs, traces, screenshots, or reports.
- MFA, authorization, or identity controls MUST NOT be disabled in production merely to make automation easier.
- A highly privileged shared account MUST NOT be the default identity for routine automation.

## SHOULD
- Short-lived identities or tokens SHOULD be preferred over long-lived reusable credentials.
- Authentication setup SHOULD be centralized so rotation and policy changes do not require widespread workflow edits.

## Exceptions
Any elevated identity, long-lived credential, or control bypass requires documented need, risk, containment, expiration, and explicit approval from the accountable security or system owner.

## Verification
Inspect secret stores, permissions, generated artifacts, CI logs, authentication fixtures, token lifetimes, and negative authorization tests. Use secret scanning where available.