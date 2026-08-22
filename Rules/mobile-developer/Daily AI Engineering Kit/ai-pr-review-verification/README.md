# AI PR Review Verification Kit

Reusable workflow for AI-assisted pull request review with evidence-based verification.

## Problem
AI can generate review comments quickly but may miss regressions or produce low-confidence findings. This package separates discovery, review, implementation feedback, and verification.

## Workflow
```text
PR Trigger -> Context Collection -> Review Agents -> Findings -> Human Decision -> Verification
```

## Components
- skills: repeatable review procedures
- rules: safety boundaries
- subagents: independent reviewers
- workflows: execution lifecycle
- hooks: deterministic checks
- scripts: repository validation helpers

## Safety
The workflow never merges code, changes production systems, modifies secrets, or approves breaking changes automatically.

## Done Criteria
- Findings contain evidence
- Tests/build results are recorded
- Risks are classified
- Required human approvals exist

## Prerequisites and run

On Windows, requires PowerShell 7+ and Git:

```powershell
pwsh -File scripts/validate-review.ps1 -Root C:\path\to\repository
```

Exit `0` confirms the root path is a Git working tree; exit `1` means the path is missing, exit `2` means Git is unavailable, and exit `3` means the path is not a worktree. The script does not assert that a PR was reviewed. Continue with the documented workflow and record exact base/head revisions plus repository-native verification.

## Verification

Exercise all documented exit paths in a disposable directory, then reproduce the consumer repository's checks against the exact reviewed head. Passing this preflight only proves local review context is available.
