# Cold Start Rules

## Purpose
Ensure useful and safe recommendations when user or item history is sparse.

## Scope
Applies to new users, new items, anonymous sessions, sparse domains, and bootstrap strategies.

## MUST
- Cold-start paths MUST define what signals are available and which defaults are used when history is absent.
- New-item exposure logic MUST include eligibility, safety, and quality checks before exploration.
- New-user strategies MUST avoid assuming preferences from sensitive attributes without explicit authorization.
- Cold-start performance MUST be evaluated separately from mature-user and mature-item performance.
- Fallback recommendations MUST remain bounded by product and policy constraints.

## MUST NOT
- MUST NOT fabricate personalization evidence for users with insufficient history.
- MUST NOT bypass safety filters to increase exploration coverage.
- MUST NOT optimize only for mature traffic while leaving cold-start behavior unmeasured.

## SHOULD
- Contextual and content-based signals SHOULD be used where they materially improve bootstrap quality.
- Exploration budgets SHOULD be explicit and monitored.

## Exceptions
Exceptions require documented rationale, bounded exposure, risk analysis, and approval where policy or user trust can be affected.

## Verification
Review fallback logic, cold-start cohorts, exposure constraints, experiment results, and safety tests.