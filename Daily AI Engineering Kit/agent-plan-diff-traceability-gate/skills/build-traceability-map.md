# Skill: Build Plan-to-Diff Traceability Map

## Purpose
Create a machine-checkable mapping from an approved implementation plan to the actual repository diff so scope drift and orphan changes are visible before verification or merge.

## When to use
Use before coding to establish the plan contract, after each material implementation checkpoint, and before final verification/PR preparation.

## Inputs
- `plan.json` conforming to `schemas/plan.schema.json`
- Git repository with known base and candidate/head revision
- `config/traceability-policy.json`
- Test/build/verification evidence available for completed plan items

## Preconditions
- Repository revision and intended base are known.
- Plan items have stable IDs, acceptance criteria, allowed paths, and risk classification.
- Required approvals for planned dangerous actions are not assumed; they must be explicitly supplied.

## Allowed tools
Read repository files, run `git diff`, build/test/static checks, and the deterministic scripts in `scripts/`.

## Constraints
- Do not edit the plan after implementation merely to hide scope drift; replan explicitly and invalidate previous fingerprints/reviews.
- Do not execute approval-required actions while building this map.
- Do not omit generated/configuration/deleted files from the actual diff inventory.

## Procedure
1. Freeze `plan.json` and compute its fingerprint with `scripts/fingerprint-plan.py`.
2. Collect the actual base-to-head diff using `scripts/collect-git-diff.py`.
3. For each changed file, identify the plan item(s) whose intent and `allowed_paths` genuinely authorize it.
4. Record the acceptance criterion or criteria the change contributes to.
5. Record a concrete reason for the file change; do not use generic text such as “implementation update.”
6. Add relevant risk categories and approval IDs when the change crosses an approval boundary.
7. Account for every plan item with status `implemented`, `not-needed`, `blocked`, or `pending`.
8. Attach evidence to implemented items: test command/result, build output, contract comparison, static check, or another stable artifact reference.
9. Save the mapping as `change-manifest.json` conforming to `schemas/change-manifest.schema.json`.
10. Run `scripts/validate-traceability.py plan.json change-manifest.json config/traceability-policy.json`.
11. If blocked, fix the scope/mapping/replanning issue rather than editing evidence to suppress the error.
12. If review is required, hand off the plan, manifest, validation result, and fingerprints to the Traceability Verifier.

## Expected output
- Current plan fingerprint
- Complete change manifest
- Deterministic validation result
- Explicit blockers, warnings, and required approvals

## Verification
All changed files are mapped, allowed paths match, every plan item is accounted for, implemented items have evidence, and plan/manifest fingerprints are current.

## Failure handling
Transient Git/tool read failure: retry once. Validation, scope, approval, or business-rule failure: do not retry; preserve evidence and replan/remediate.

## Stop conditions
Stop on unknown base/head revision, unmapped change, path-scope violation, stale plan fingerprint, missing approval, pending plan item at finalization, or repeated transient failure.
