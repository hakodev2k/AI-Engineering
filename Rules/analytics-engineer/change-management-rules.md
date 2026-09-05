# Analytical Change Management Rules

## Purpose
Make production analytical changes reviewable, reversible, and proportionate to downstream risk.

## Scope
Applies to model logic, metrics, schemas, materializations, schedules, semantic definitions, and data contracts.

## MUST
- Significant changes MUST document intent, affected outputs, validation evidence, and rollback or recovery strategy.
- High-impact changes MUST use lineage and usage evidence to identify affected consumers.
- Production releases MUST distinguish preparation from execution and follow required approval boundaries.
- Changes to trusted business logic MUST include before/after result comparison on representative data.
- Concurrent changes that make root-cause isolation difficult MUST be minimized or explicitly coordinated.

## MUST NOT
- MUST NOT merge material semantic changes without reviewer-visible evidence of expected result differences.
- MUST NOT rewrite Git history or force push shared protected branches without explicit authorization.
- MUST NOT bypass review merely because a change is expressed only in SQL or configuration.

## SHOULD
- Prefer small, independently verifiable changes over broad rewrites.
- Use feature, version, or dual-run strategies for high-risk migrations where practical.

## Exceptions
Urgent changes require documented incident or business context, minimized scope, approval, and post-change review.

## Verification
Inspect pull requests, diffs, lineage evidence, comparison outputs, approvals, and rollback records.