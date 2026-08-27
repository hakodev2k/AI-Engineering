# Break-Glass Access

## Purpose
Provide tightly controlled emergency access to secrets when normal identity or platform paths are unavailable, without turning emergency credentials into routine backdoors.

## When to use
Use when designing or testing emergency administrative access for outages, identity-provider failures, or severe incidents.

## Inputs
- Critical recovery scenarios
- Administrative capabilities
- Approval model
- Audit requirements
- Recovery objectives

## Context to inspect
Inspect existing privileged accounts, offline credentials, MFA dependencies, storage locations, quorum requirements, recovery runbooks, and alerting.

## Core knowledge
Break-glass mechanisms must be independent enough to survive targeted failures yet constrained enough to resist abuse. Controls include split custody, hardware-backed authentication, offline storage, time-bound elevation, immediate alerting, and mandatory post-use rotation.

## Procedure
1. Define scenarios where normal privileged access may fail.
2. Determine the minimum emergency capabilities required.
3. Create dedicated identities or recovery material separate from daily administration.
4. Protect access with strong independent factors and, when appropriate, dual control.
5. Store recovery material in an approved offline or separately controlled location.
6. Define explicit authorization and invocation steps.
7. Alert immediately on any use or attempted use.
8. Test the procedure periodically under controlled conditions.
9. After use, revoke or rotate affected credentials and review all actions.
10. Update runbooks from test and incident findings.

## Decision points
Use dual control for high-impact root capabilities when recovery speed permits. Avoid dependencies on the same identity provider, network, or vault whose failure the mechanism is intended to bypass.

## Common failure patterns
- Emergency accounts used for routine work
- Credentials never tested and found invalid during an outage
- No alerting on use
- Recovery path depends on the failed primary system
- Failure to rotate after invocation

## Verification
Execute a controlled recovery drill, verify access only to intended capabilities, confirm alerts and audit records, and prove post-test credential rotation.

## Expected output
A tested emergency-access runbook with custody, approvals, monitoring, and post-use controls.

## Stop conditions
Stop if emergency access would be unaudited, custody cannot be segregated, or testing would materially endanger production without approved safeguards.