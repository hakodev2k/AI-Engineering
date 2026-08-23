# Third-Party Integration Testing

## Purpose
Assess security boundaries created by OAuth/OIDC integrations, webhooks, partner APIs, payment/service providers, and other external trust relationships without testing unauthorized third-party systems.

## When to use
Use when the in-scope system delegates identity, receives callbacks, sends privileged requests, or trusts externally supplied assertions/events.

## Inputs
Integration architecture, approved endpoints, test tenants/accounts, protocol configuration, webhook contracts, scopes, and third-party ownership boundaries.

## Context to inspect
Inspect redirect URIs, state/nonce, token audience/scope, callback authentication, signature validation, replay handling, tenant binding, secrets, and failure behavior.

## Core knowledge
Test the customer's side of the trust boundary unless the provider is separately authorized. Protocol correctness depends on binding requests, identities, tenants, audiences, and events to the intended transaction.

## Procedure
1. Define which integration components are in scope.
2. Map trust assertions and data exchanged.
3. Establish a valid integration flow using test accounts.
4. Test identity/tenant/transaction binding.
5. Evaluate token/scopes and callback/webhook authentication.
6. Test replay and idempotency with controlled events.
7. Review redirect and state handling.
8. Test failure paths without sending abusive traffic to the provider.
9. Validate impact on the in-scope application.
10. Recommend fixes at the trust-validation boundary.

## Decision points
Mock or replay captured test-provider responses when direct third-party testing is not authorized. Escalate provider defects through appropriate channels rather than probing further.

## Common failure patterns
Testing vendor infrastructure, confusing provider behavior with customer vulnerability, accepting unsigned callbacks, weak tenant binding, and storing provider secrets in evidence.

## Verification
Demonstrate the failed trust check entirely within authorized assets/test accounts and confirm protocol expectations from implementation/contract evidence.

## Expected output
Integration findings with trust boundary, prerequisite, controlled evidence, impact, and remediation.

## Stop conditions
Stop before probing third-party assets/accounts, causing provider abuse, or using credentials outside authorized customer resources.