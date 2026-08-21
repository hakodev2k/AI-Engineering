# AI PR Review Risk Gate

Reusable AI workflow for reviewing pull requests with evidence-based risk detection.

## Problem
AI coding agents can generate changes quickly but may miss hidden regressions, security issues, API breaks, and operational risks.

## Workflow
```text
PR Input -> Context Collection -> Risk Analysis -> Review Agents -> Verification -> Report
```

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
