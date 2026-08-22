# Skill: Capture Planning Baseline

## Purpose
Bind an implementation plan to the exact repository state it was derived from so later branch movement can be evaluated deterministically.

## When to use
Run before implementation starts, before delegating plan steps, or whenever a plan is resumed after an interruption.

## Inputs
- Repository root
- Target branch or target ref
- Working branch or head ref
- Plan identifier
- Planned file/component/test scope
- Material assumptions used by the plan

## Preconditions
- Repository is readable by Git.
- Target and head refs resolve locally or through the configured Git integration.
- No dangerous repository mutation is required.

## Allowed tools
Read-only Git commands, repository search/read tools, and `scripts/capture-branch-baseline.py`.

## Constraints
- Do not rewrite history or update refs merely to create the baseline.
- Do not store secrets in assumptions or evidence.
- Record facts separately from hypotheses.

## Procedure
1. Resolve target ref and head ref to commit SHAs.
2. Compute their merge base.
3. Record target SHA, head SHA, merge-base SHA, timestamp, and plan identifier.
4. Normalize planned paths/components/tests and assumptions.
5. For every assumption, record its evidence path or evidence description.
6. Write a baseline JSON record.
7. Validate the baseline using `scripts/validate-replan-record.py`.
8. Stop if any ref cannot be resolved or the record is invalid.

## Expected output
A validated baseline record compatible with `schemas/replan-record.schema.json` and suitable for later drift evaluation.

## Verification
- Target, head, and merge-base fields are non-empty SHAs.
- Planned scope is explicit.
- Assumptions contain evidence or are marked as open questions.
- Validator exits 0.

## Failure handling
- Transient Git/tool read failure: retry once.
- Invalid ref or missing repository: stop and preserve stderr.
- Invalid baseline: fix the record; do not continue implementation.

## Stop conditions
Stop when the baseline is validated or when required repository state cannot be resolved.