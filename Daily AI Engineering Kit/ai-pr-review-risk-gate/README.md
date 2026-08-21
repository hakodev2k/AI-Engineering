# AI PR Review Risk Gate

Reusable AI workflow for reviewing pull requests with evidence-based risk detection.

## Problem
AI coding agents can generate changes quickly but may miss hidden regressions, security issues, API breaks, and operational risks.

## Workflow
```text
PR Input -> Context Collection -> Risk Analysis -> Review Agents -> Verification -> Report
```

## Copy and install

Copy the entire directory into the consumer repository. It requires Python 3.10+ and the standard library only. Preserve relative paths among `scripts/`, `schemas/`, `rules/`, and `workflows/`.

## Run

From the target repository root, run `python path/to/ai-pr-review-risk-gate/scripts/collect-pr-context.py` and capture its JSON output. It reports current working-tree status and unstaged changed paths; it accepts no arguments and does not fetch a PR. A host adapter must separately supply immutable base/head context before validating a completed handoff against `schemas/review-report.json`.

## Components
- skills/pr-risk-analysis.md
- rules/review-boundaries.md
- subagents/risk-reviewer.md
- workflows/pr-review.md
- hooks/pre-review.md
- scripts/collect-pr-context.py
- schemas/review-report.json

## Definition of Done
- Changed files identified
- Risks backed by evidence
- Tests/build status checked
- Blocking issues separated from suggestions

## Verification

Validate the handoff against `schemas/review-report.json`, reproduce referenced build/test results against the immutable head revision, and confirm that missing evidence is reported as not run. Collection success alone is not a passing risk gate.
