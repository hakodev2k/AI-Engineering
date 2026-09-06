# Intended Use and Use Restriction Rules

## Purpose
Prevent models from being applied outside contexts supported by evidence, controls, and approved risk assumptions.

## Scope
Applies to intended-use definitions, prohibited uses, user eligibility, decision contexts, and downstream integrations.

## MUST
- Each model deployment MUST define intended users, supported tasks, material limitations, prohibited uses, and required human oversight.
- Use restrictions MUST be specific enough to evaluate during design review and production monitoring.
- Expansion into a materially different domain, population, geography, or decision context MUST receive fresh risk assessment.
- Downstream consumers MUST receive the restrictions needed to operate the model safely.
- High-impact uses MUST define what decisions remain human-owned and what evidence is required before action.

## MUST NOT
- A model MUST NOT be treated as generally fit for purpose because it performs well on unrelated benchmarks.
- Documentation MUST NOT obscure known limitations with vague statements such as 'use responsibly'.

## SHOULD
- Restrictions SHOULD be encoded in technical controls where feasible rather than relying only on documentation.
- Product interfaces SHOULD communicate material limitations at the point of use.

## Exceptions
Any temporary out-of-scope use must be bounded, non-production unless explicitly approved, monitored, reversible, and supported by documented evidence and risk acceptance.

## Verification
Review model cards, product requirements, integration contracts, access controls, and test cases. Confirm production behavior prevents or detects prohibited use where feasible.