# Architecture Review and Governance Rules

## Purpose
Provide proportionate governance that improves decisions without creating unnecessary delivery friction.

## Scope
Applies to design reviews, standards, exceptions, technical debt, architecture runway, and cross-team decisions.

## MUST
- Governance depth MUST scale with impact, irreversibility, security risk, cost, and number of affected teams.
- Reviews MUST focus on requirements, risks, trade-offs, evidence, and operational consequences rather than stylistic preference.
- Exceptions to architecture standards MUST record rationale, owner, risk, and review/expiry conditions.
- Architecture debt that creates material risk MUST have visible ownership and prioritization.
- Cross-team changes MUST include affected owners in review.

## MUST NOT
- MUST NOT use architecture governance to mandate technology without context.
- MUST NOT block low-risk reversible decisions with heavyweight process.
- MUST NOT approve a design merely because it matches a reference architecture if requirements differ.

## SHOULD
- Use reusable principles and guardrails instead of centralized approval for routine decisions.
- Review outcomes periodically against production evidence.

## Exceptions
Emergency work may defer governance temporarily with documented follow-up.

## Verification
Inspect review records, decision logs, exception registers, debt tracking, standards, and evidence that review findings were addressed.