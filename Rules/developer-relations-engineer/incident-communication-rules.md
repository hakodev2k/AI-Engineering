# Incident Communication Rules

## Purpose
Ensure developer-facing incident communication is accurate, coordinated, and operationally safe.

## Scope
Applies to outages, degraded APIs, breaking regressions, security-related service changes, and recovery updates.

## MUST
- Incident updates MUST use confirmed operational facts from the accountable incident process.
- Public status, workaround, impact, and recovery statements MUST be coordinated with incident owners.
- Uncertainty MUST be stated when scope, cause, or recovery timing is not yet confirmed.
- Developer workarounds MUST be validated and MUST describe relevant limitations.

## MUST NOT
- MUST NOT speculate publicly about root cause during an active incident.
- MUST NOT publish internal-only incident details, credentials, customer data, or sensitive security information.
- MUST NOT promise recovery times that have not been approved by incident leadership.

## SHOULD
- Updates SHOULD prioritize affected developer actions and observable impact over internal implementation detail.
- Post-incident guidance SHOULD correct stale workarounds and documentation.

## Exceptions
Emergency communications may be brief, but factual verification and authorized ownership remain mandatory.

## Verification
Compare public updates with incident records, status timelines, approved messaging, workaround tests, and subsequent corrections.