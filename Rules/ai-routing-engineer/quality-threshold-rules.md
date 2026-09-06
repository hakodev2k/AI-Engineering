# Quality Threshold Rules

## Purpose
Prevent routing optimizations from reducing output quality below accepted task requirements.

## Scope
Quality metrics, minimum thresholds, task-specific evaluation, degradation detection, and route eligibility.

## MUST
- Quality-critical task classes MUST define measurable acceptance criteria or bounded human-review criteria.
- A candidate route MUST meet its task-specific quality threshold before production eligibility.
- Quality comparisons MUST use representative datasets and statistically meaningful evidence where practical.
- Material model, prompt, provider, or routing-policy changes MUST be evaluated for quality regression.
- Quality failures in production MUST be traceable to route and configuration versions.

## MUST NOT
- MUST NOT claim quality equivalence from anecdotal samples alone.
- MUST NOT trade below mandatory quality thresholds for lower cost or latency without explicit approval.
- MUST NOT reuse a benchmark whose task distribution is materially unrelated without justification.

## SHOULD
- Track quality by meaningful task segment rather than aggregate score alone.
- Include hard edge cases and known historical failures.

## Exceptions
Exceptions require quantified impact, business rationale, monitoring, rollback criteria, and approval.

## Verification
Review evaluation reports, benchmark provenance, route eligibility checks, production quality metrics, and regression tests.