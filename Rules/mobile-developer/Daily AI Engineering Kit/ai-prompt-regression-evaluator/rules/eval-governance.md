# Eval Governance Rules

## MUST
- Pin a suite version and case IDs for every comparison.
- Preserve baseline and candidate identities, including prompt/config hash when available.
- Run critical cases at least the configured minimum repeat count.
- Keep failed executions as evidence instead of deleting them.
- Treat deterministic assertion failure on a critical case as blocking.
- Require independent review when a safety-sensitive or high-impact semantic case is borderline or regressed.
- Record cost and latency when the runner exposes them.
- Distinguish `executed` from `verified`.

## MUST NOT
- Approve a candidate because one run looks good.
- Average away a critical failure with strong non-critical scores.
- Change expected answers or rubric thresholds only to make a candidate pass.
- Compare results from different suite versions without an explicit migration/rebaseline decision.
- Use production secrets in fixtures.
- Let the prompt author be the only verifier for high-impact changes.
- Silently increase model/tool permissions during evaluation.
- Deploy or promote a candidate to production solely from this evaluator; production deployment requires human approval.

## SHOULD
- Include known historical failures as regression cases.
- Prefer deterministic assertions for schema, required fields, forbidden strings, citations, and tool-call shape.
- Keep semantic rubrics small, explicit, and anchored with examples.
- Use the same runner settings for baseline and candidate unless the settings themselves are under evaluation.
- Rebaseline only through an explicit reviewed change.
