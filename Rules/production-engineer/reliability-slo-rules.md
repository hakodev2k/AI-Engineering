# Reliability and SLO Rules

## Purpose
Translate reliability expectations into measurable operational objectives and decisions.

## Scope
Applies to service-level indicators, objectives, error budgets, availability targets, and reliability trade-offs.

## MUST
- Critical services MUST define measurable reliability objectives based on user-visible outcomes.
- SLOs MUST use clearly specified indicators, windows, exclusions, and data sources.
- Reliability risk MUST influence release and change decisions when error-budget consumption is materially elevated.
- Changes to SLO definitions MUST preserve historical interpretability or explicitly document discontinuities.

## MUST NOT
- MUST NOT present infrastructure uptime as equivalent to user-perceived reliability unless the two are demonstrably aligned.
- MUST NOT manipulate exclusions to conceal real user impact.
- MUST NOT set reliability targets without considering cost, architecture, and operational feasibility.

## SHOULD
- Use error budgets to make reliability versus velocity trade-offs explicit.
- Review objectives when product behavior or architecture materially changes.

## Exceptions
Exceptions require documented business context, evidence, risk ownership, and approval.

## Verification
Inspect SLI queries, SLO definitions, historical performance, exclusions, error-budget policy, and release decisions.
