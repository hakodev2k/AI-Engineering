# AI Credential Compromise Response

## Purpose
Respond to compromised API keys, service principals, user sessions, workload identities, or other credentials that grant access to AI models, data, agents, or tools.

## When to use
Use when credentials are leaked, unexpectedly used, associated with suspicious AI activity, or suspected to be controlled by an unauthorized actor.

## Inputs
Credential type, privileges, usage history, affected services, dependent workloads, identity events, model requests, tool calls, network indicators, and rotation options.

## Preconditions
Credential ownership and revocation or rotation mechanisms are known or can be identified quickly.

## Context to inspect
Inspect issuance history, scopes, expiration, environment, consumers, secret storage, CI/CD use, workload dependencies, authentication logs, and actions performed with the credential.

## Core knowledge
Revocation is only one part of response. Responders must determine what the credential could access, what it actually accessed, whether persistence was established, and whether replacement credentials could be exposed through the same path.

## Procedure
1. Validate compromise evidence and classify credential privilege.
2. Identify all systems and workflows using the credential.
3. Determine earliest suspicious use and actions performed.
4. Preserve necessary evidence.
5. Revoke or disable the compromised credential using the safest effective sequence.
6. Issue replacement credentials with minimum required scope.
7. Update dependent workloads securely.
8. Search for lateral use across model providers, retrieval systems, tools, and environments.
9. Remove the original exposure path.
10. Monitor replacement identities for recurrence.

## Decision points
Immediately revoke high-privilege credentials when continued use creates material risk. For shared production credentials, coordinate rotation to avoid uncontrolled outages while applying temporary restrictions where possible.

## Common failure patterns
Rotating without investigating usage, reusing the same secret location, failing to reduce scope, overlooking cached sessions, and assuming a new key ends attacker access.

## Verification
Implemented means compromised credentials are invalidated and dependencies updated. Verified means old credentials fail, legitimate workloads use replacements, suspicious activity stops, and the exposure path is closed.

## Expected output
Compromise timeline, scope assessment, rotation record, impacted actions, residual risk, and monitoring plan.

## Stop conditions
Escalate when credential revocation may interrupt critical services, privileged actions were performed, or identity-provider compromise is suspected.