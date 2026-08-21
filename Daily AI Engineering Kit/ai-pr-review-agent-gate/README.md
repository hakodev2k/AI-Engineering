# AI PR Review Agent Gate

Reusable AI engineering package for evidence-based pull request review.

## Problem
AI code review often produces generic comments. This package creates a bounded workflow that reviews changes against repository rules, tests, security constraints, and architecture decisions.

## Workflow
Trigger -> Context Collection -> Review Plan -> Specialized Review -> Findings Validation -> Human Decision

## Components
- `hooks/pre-review-validation.md`: host pre-review contract.
- `scripts/check-review-inputs.py`: minimum local input validator.

This package is a small adapter/preflight, not a complete review engine. The host supplies diff retrieval, repository rules, review logic, deterministic checks, reporting, and approval.

## Safety
Agents do not merge code, approve PRs, change production systems, or bypass required reviews.

## Done Criteria
- Changed files inspected
- Findings include evidence
- False positives reduced through validation
- Required checks completed

## Prerequisites and run

Requires Python 3.10+. Set paths to a local repository and a captured PR diff, then run from this package directory:

```bash
REPOSITORY_PATH=/path/to/repo PR_DIFF_PATH=/path/to/pr.diff \
  python scripts/check-review-inputs.py
```

Exit `0` means both variables are present and their targets pass the script's path checks; exit `1` reports missing or invalid inputs. No network request, review, merge, or code change occurs. Verification still requires checking the immutable revisions, full diff, acceptance criteria, repository-native build/tests, and evidence-backed findings.

## Verification

Exercise missing-variable, missing-path, and valid-path cases, then run the consumer repository's build/tests against the exact reviewed revision. The preflight is verified only as input validation; it does not produce a review verdict.
