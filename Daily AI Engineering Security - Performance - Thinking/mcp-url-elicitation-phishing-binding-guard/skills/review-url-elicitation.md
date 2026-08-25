# Skill — Review URL-Mode Elicitation

## Purpose
Assess an MCP URL-mode elicitation implementation for phishing, identity-binding, replay, redirect, capability, and secret-exposure failure modes.

## Trigger
Before enabling URL elicitation, after protocol migration, or after OAuth/payment/account-linking changes.

## Inputs
Client rendering code, server pending-state code, auth model, completion handler, protocol versions, redirect policy, representative traces.

## Preconditions
Use a test environment; production credentials are unnecessary.

## Required context
Authenticated MCP principal, server origin, logical request identity, target URL/origin, and correlation model per protocol era.

## Allowed tools
Static code search, tests, sanitized traces, deterministic scripts, protocol docs.

## Constraints
Do not use live secrets or weaken TLS, principal binding, expiry, or replay checks.

## Procedure
1. Map MCP client/server/browser/third-party/callback trust boundaries.
2. Separate Facts, Assumptions, Evidence, Hypotheses, Decision, Risks, Verification status.
3. Locate every URL creation and completion path.
4. Verify scheme, userinfo, origin display, consent, redirect, and capability checks.
5. Verify principal + server origin + request + target origin + nonce + expiry binding.
6. Test copied URL to another user, replay, expiry, altered origin, duplicate completion, form-only client, and legacy/2026 adapter.
7. Run the deterministic guard.
8. Require independent review.

## Decision points
Missing principal/nonce/expiry binding, raw credential in model context, or unapproved origin drift blocks release.

## Expected output
Structured evidence and PASS/FAIL verification record.

## Metrics
Attack-fixture coverage, blocked mismatches, legitimate false positives.

## Verification
Valid flow succeeds once; malicious/replay cases fail closed.

## Failure handling
Retry environmental setup at most twice; deterministic failures require code/config change.

## Stop conditions
Stop when all attack cases pass or a blocking defect remains for escalation.
