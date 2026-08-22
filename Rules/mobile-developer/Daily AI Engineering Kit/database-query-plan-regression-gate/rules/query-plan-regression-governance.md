# Query Plan Regression Governance

## MUST

- Capture both baseline and candidate evidence for the same logical query before declaring performance verified.
- Bind each evidence file to `query_id`, database engine, dataset profile, source revision, environment, and timezone-aware capture time.
- Preserve the original database plan artifact outside this normalized record when a high-risk decision depends on it.
- Validate evidence before comparison.
- Treat a new full scan, new spill, threshold-blocking runtime/read regression, or severe cardinality-estimate error as blocking until remediated and recaptured.
- Re-capture candidate evidence after SQL, ORM query shape, index, statistics, schema, provider, or parameterization changes.
- Re-run the comparison when the candidate source revision changes.
- Require independent review for `high` and `critical` risk.
- Stop before production index/schema/config changes, destructive SQL, or database maintenance actions that require human approval.
- Separate `task_executed` from `task_verified` in final status.

## MUST NOT

- Do not call a query safe because functional tests pass.
- Do not compare plans captured from materially different dataset profiles and present the result as verified.
- Do not hide worse reads/CPU/duration behind a lower optimizer cost.
- Do not treat estimated plan cost as equivalent to measured runtime evidence.
- Do not infer missing metrics as zero.
- Do not silently disable thresholds to make a candidate pass.
- Do not override deterministic blockers with a review record; remediate and recapture, or change policy through a separately governed policy change.
- Do not let the implementation agent be the only reviewer for high/critical regressions.
- Do not execute `CREATE INDEX`, `DROP INDEX`, schema migration, statistics update, production query hint, or production configuration change without required human approval.
- Do not retry validation or regression failures blindly.

## SHOULD

- Capture multiple representative parameter/data distributions when parameter sensitivity is plausible.
- Prefer actual execution plans and measured reads/duration over estimated-only evidence.
- Record warm/cold cache assumptions and relevant isolation/provider versions in `dataset_profile` or notes.
- Investigate regressions by query shape, predicates, joins, cardinality estimates, indexes, statistics, spills, lookups, sorts, hashes, and parameterization before changing thresholds.
- Keep policy changes separately reviewable from query implementation changes.
