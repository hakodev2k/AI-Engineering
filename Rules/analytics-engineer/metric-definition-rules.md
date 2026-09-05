# Metric Definition Rules

## Purpose
Ensure business metrics are consistent, explainable, and reproducible across analytical products.

## Scope
Applies to KPIs, ratios, rates, funnels, cohorts, financial measures, and operational metrics.

## MUST
- Every governed metric MUST define numerator, denominator, grain, filters, time semantics, and ownership where applicable.
- Metric logic MUST have one authoritative implementation or an explicitly governed equivalence strategy.
- Changes to metric semantics MUST be versioned, reviewed for downstream impact, and communicated before release.
- Time-zone, late-arriving data, and null-handling behavior MUST be explicit when they affect results.
- Metric validation MUST include representative edge cases and reconciliation against trusted references when available.

## MUST NOT
- MUST NOT reuse one metric name for materially different definitions.
- MUST NOT change historical metric meaning silently.
- MUST NOT publish a business-critical metric whose calculation cannot be reproduced from governed inputs.

## SHOULD
- Keep metric definitions close to the semantic or transformation layer rather than dashboard-specific code.
- Include examples demonstrating expected values for nontrivial definitions.

## Exceptions
Exceptions require documented reason, scope, audience, and approval from the accountable metric owner.

## Verification
Review metric specifications, semantic definitions, tests, reconciliations, version history, and downstream usage.