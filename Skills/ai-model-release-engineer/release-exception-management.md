# Release Exception Management

## Purpose
Handle justified deviations from normal release gates without turning temporary risk acceptance into invisible permanent policy.

## When to use
Use when a candidate cannot satisfy a standard gate but business or operational circumstances may justify controlled release.

## Inputs
Failed gate, evidence, risk assessment, business rationale, compensating controls, owner, proposed expiry, and approval policy.

## Preconditions
Exception authority and non-waivable controls are defined.

## Context to inspect
Inspect severity, user impact, reversibility, detection capability, historical exceptions, incident history, and alternative mitigations.

## Core knowledge
An exception transfers or accepts risk; it does not erase it. Good exceptions are specific, bounded, owned, monitored, approved, and automatically revisited.

## Procedure
1. State the exact failed requirement and affected release.
2. Explain why remediation before release is impractical.
3. Quantify risk severity, likelihood, exposure, and reversibility.
4. Identify compensating controls and monitoring.
5. Limit scope by traffic, duration, region, workflow, or capability where possible.
6. Assign accountable owner and remediation deadline.
7. Obtain approval at the required authority level.
8. Attach exception metadata to release evidence.
9. Monitor conditions and revoke the exception if assumptions fail.
10. Close or renew explicitly before expiry.

## Decision points
Reject exceptions for non-waivable controls. Prefer delaying release when compensating controls do not materially reduce high-severity risk.

## Common failure patterns
Verbal approvals, no expiry, broad waivers, repeated renewal without remediation, exceptions detached from exact versions, and risk accepted by people without authority.

## Verification
Confirm approval, scope enforcement, monitoring, owner, and expiry are active in the release system.

## Expected output
An auditable, time-bounded exception with compensating controls and remediation plan.

## Stop conditions
Stop if policy forbids exception, risk cannot be bounded, required approver is unavailable, or compensating controls cannot be verified.
