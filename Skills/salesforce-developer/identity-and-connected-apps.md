# Identity and Connected Apps

## Purpose
Integrate Salesforce identities and external applications securely using OAuth, Connected Apps, Named Credentials, session controls, and least-privilege integration users.

## When to use
Use for API clients, SSO-adjacent application integration, server-to-server access, delegated user access, and external credential configuration.

## Inputs
Client type, trust boundary, OAuth flow, scopes, user model, token lifetime, secret/certificate ownership, audit requirements.

## Context to inspect
Connected Apps, External/Named Credentials, permission sets, profiles, integration users, IP/session policies, certificate rotation, login history.

## Core knowledge
Authentication proves identity; authorization constrains capability. OAuth flow selection depends on client trust and user involvement. Long-lived credentials and broad admin users create disproportionate risk.

## Procedure
1. Identify actor: human user, backend service, middleware, or device.
2. Select the narrowest supported OAuth flow and scopes.
3. Use dedicated integration identities where service ownership requires them.
4. Store credentials/certificates in managed facilities, not code.
5. Restrict object, field, record, and API permissions.
6. Define token/certificate rotation and revocation procedures.
7. Correlate integration activity to an accountable identity.
8. Test denied scopes, expired credentials, revoked access, and rotation.

## Decision points
Use delegated user authorization when actions must inherit user permissions; use service identity when a controlled business service owns the operation.

## Common failure patterns
Using administrator credentials, password flows by default, excessive scopes, secrets in custom metadata/code, shared integration accounts, and no rotation plan.

## Verification
Prove only intended APIs/data are accessible and that revocation/rotation works without unmanaged downtime.

## Expected output
A least-privilege identity design with credential lifecycle and audit evidence.

## Stop conditions
Escalate when required privileges violate policy or no accountable owner exists for service credentials.