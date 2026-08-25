# Security Review Rules

## Purpose
Make application security review risk-based, evidence-driven, reproducible, and proportionate to change impact.

## Scope
Applies to design reviews, pull requests, release reviews, exception reviews, and security sign-off for application changes.

## MUST
- Review depth MUST be based on changed trust boundaries, privilege, data sensitivity, exposure, exploitability, and reversibility rather than diff size alone.
- Reviewers MUST identify the security invariants affected by the change and inspect their enforcement points.
- High-risk findings MUST include actionable evidence, affected condition, impact, and a verification expectation.
- Material security decisions MUST be recorded so future maintainers can understand the constraint and residual risk.
- Reviewers MUST distinguish confirmed vulnerabilities, plausible concerns requiring evidence, defense-in-depth recommendations, and style preferences.

## MUST NOT
- MUST NOT approve a high-risk change solely because automated scanners are clean.
- MUST NOT demand security controls without relating them to a threat, requirement, or measurable risk.
- MUST NOT silently accept weakened authentication, authorization, cryptography, secret handling, or production security controls.

## SHOULD
- SHOULD prioritize architectural and systemic issues before local hardening details.
- SHOULD recommend the simplest control that reliably enforces the required invariant.
- SHOULD re-review when implementation materially diverges from the reviewed design.

## Exceptions
Review bypasses require explicit emergency rationale, accountable approval, compensating controls, and a scheduled post-change review.

## Verification
Inspect review records, threat model links, test evidence, unresolved comments, exception approvals, and final diffs. Confirm high-risk concerns were verified after remediation.