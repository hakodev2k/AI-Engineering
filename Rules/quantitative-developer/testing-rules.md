# Testing Rules

## Purpose
Provide deterministic evidence that quantitative software remains correct across normal, boundary, and failure conditions.

## Scope
Applies to models, data transformations, services, libraries, and integration paths.

## MUST
- Critical calculations MUST have tests against independently derived or authoritative expected values.
- Tests MUST cover boundary dates, extreme inputs, missing data, invalid data, and failure paths relevant to the domain.
- Integration tests MUST verify conventions and units across component boundaries.
- Production defects MUST receive regression tests when deterministic reproduction is practical.
- Stochastic tests MUST use controlled seeds or statistically valid acceptance criteria.

## MUST NOT
- Tests MUST NOT merely duplicate implementation logic to compute expected results.
- Flaky tests MUST NOT be normalized as acceptable evidence.
- Approximate assertions MUST NOT use tolerances wider than economically justified.

## SHOULD
- Use property-based tests for invariants and metamorphic relationships.
- Maintain golden portfolios or scenarios for end-to-end quantitative regression.

## Exceptions
Exceptions require documented untestable behavior, alternative evidence, risk, and reviewer acceptance.

## Verification
Inspect CI results, mutation or fault-injection evidence where valuable, coverage of critical paths, independence of expected values, deterministic reruns, and representative end-to-end reconciliation.