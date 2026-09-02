# Feedback and Ground Truth

## Purpose
Ensure delayed outcomes and user feedback used for monitoring remain trustworthy, attributable, and resistant to feedback-loop errors.

## Scope
Applies to labels, human review, user feedback, conversion outcomes, delayed targets, and post-inference evaluation joins.

## MUST
- Ground-truth pipelines MUST define label semantics, provenance, expected delay, completeness, and join logic to the originating model decision.
- Monitoring MUST detect label freshness, coverage, duplication, and material changes in labeling process.
- Feedback used to assess model quality MUST identify selection mechanisms that can bias observed outcomes.
- Changes to label semantics MUST be versioned and assessed for metric comparability.

## MUST NOT
- MUST NOT treat missing feedback as negative feedback unless that semantics is explicitly valid.
- MUST NOT combine labels produced under incompatible policies without accounting for the difference.
- MUST NOT use model-generated labels as independent ground truth without disclosure and validation.

## SHOULD
- Track label maturity and coverage by risk-relevant cohort.
- Audit samples against source evidence when labels materially drive production decisions.

## Exceptions
Proxy ground truth requires validation evidence, known limitations, monitoring for proxy breakdown, and model-owner approval.

## Verification
Inspect label specifications, lineage, join tests, freshness dashboards, sampling audits, semantic version history, and bias analyses.