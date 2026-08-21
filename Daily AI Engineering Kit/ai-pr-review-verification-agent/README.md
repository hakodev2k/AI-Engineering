# AI PR Review Verification Agent

Reusable agent package for reviewing pull requests with evidence-based verification.

## Problem
AI-generated code can look correct while containing hidden regressions. This workflow separates implementation from verification.

## Flow

```text
PR
 ↓
Context collection
 ↓
Risk analysis
 ↓
Review agents
 ↓
Automated checks
 ↓
Human approval
```

## Components
- skills: review procedures
- rules: safety constraints
- subagents: independent reviewers
- workflows: bounded execution
- scripts: deterministic checks

## Definition of Done
- Review findings contain evidence.
- Build/tests are verified.
- Blocking risks are reported.
- No unsafe action is performed automatically.

## Run

Requires Git and Bash. From the target repository root:

```bash
bash path/to/ai-pr-review-verification-agent/scripts/validate-review.sh
```

The script runs `git diff --check`; exit `0` means the current diff has no whitespace/conflict-marker errors, while nonzero blocks the preflight. It does not build, test, or validate review findings. Complete `workflows/`, apply `rules/`, and bind all evidence to the reviewed base/head revisions.

## Verification

Run the script against clean and intentionally malformed synthetic diffs, then independently reproduce all consumer build/test evidence. A clean whitespace check is not a complete PR review.
