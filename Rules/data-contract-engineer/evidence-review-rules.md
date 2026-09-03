# Evidence and Review Rules

## Purpose
Require Senior-level contract decisions to be supported by inspectable evidence and proportionate review.

## Scope
Applies to compatibility claims, quality claims, migrations, incidents, semantic changes, and production readiness decisions.

## MUST
- Material contract decisions MUST identify the evidence used, including tests, schema diffs, lineage, telemetry, samples, or consumer validation as appropriate.
- Review depth MUST increase with blast radius, irreversibility, sensitivity, and consumer criticality.
- Uncertainty and missing evidence MUST be stated explicitly rather than converted into unsupported confidence.
- Reviewers MUST verify that proposed exceptions preserve required security, privacy, and safety boundaries.

## MUST NOT
- Agent confidence, developer intuition, or absence of observed failures MUST NOT be treated as sufficient evidence for high-impact claims.
- Review MUST NOT approve a breaking change without understanding affected consumers and migration state.
- Evidence MUST NOT be selectively presented in a way that hides known contradictory results.

## SHOULD
- Prefer deterministic automated evidence for repeatable checks and human review for semantic trade-offs.
- Significant decisions SHOULD preserve a concise rationale for future maintainers.

## Exceptions
Exceptions require a documented reason, unavailable evidence, residual risk, compensating validation, and accountable approval.

## Verification
Inspect pull requests, decision records, CI results, schema diffs, telemetry, lineage, test evidence, and approval records.