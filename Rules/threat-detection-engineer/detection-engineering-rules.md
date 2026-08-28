# Detection Engineering Rules

## Purpose
Define maintainable, testable implementation standards for production detections.

## Scope
Applies to query logic, correlation rules, thresholds, enrichment, suppression, and supporting code.

## MUST
- Detection logic MUST be deterministic for equivalent inputs and documented assumptions.
- Queries MUST minimize unnecessary scans and expensive operations appropriate to the platform.
- Detection logic MUST distinguish required conditions from optional enrichment.
- Material logic changes MUST be reviewed and tested before production use.
- Rule identifiers and versions MUST remain traceable across deployments.

## MUST NOT
- MUST NOT hide material logic in undocumented ad hoc filters.
- MUST NOT depend on unstable field names without compatibility handling.
- MUST NOT suppress events broadly to reduce alert volume without evidence that security coverage remains acceptable.

## SHOULD
- Reusable normalization and enrichment logic SHOULD be centralized where it improves consistency.
- Complex detections SHOULD include explanatory comments or linked design rationale.

## Exceptions
Exceptions require rationale, affected coverage, evidence, risk owner, and verification plan.

## Verification
Use code review, query tests, representative event fixtures, performance checks, deployment diffs, and detection version history.