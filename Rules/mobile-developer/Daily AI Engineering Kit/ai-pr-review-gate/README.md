# AI PR Review Gate Kit

Reusable agent workflow for automated pull request review with evidence-based findings.

## Problem
Reduce missed defects, security issues, and regression risks during code review.

## Usage
Trigger when a pull request is opened or updated.

## Copy and install

Copy the whole package into the consumer repository. It uses Python 3.10+ and the standard library only; Git is required by the diff collector. Keep the file layout intact so workflow and schema references remain valid.

Workflow:
```text
PR Event
 ↓
Context Collection
 ↓
Risk Analysis
 ↓
Specialist Reviews
 ↓
Verification
 ↓
Review Report
```

## Components
- skills/pr-analysis.md: review procedure
- rules/review-rules.md: enforcement rules
- subagents/reviewer.md: delegated reviewer role
- workflows/pr-review.md: execution lifecycle
- hooks/pre-review.md: validation hook
- scripts/collect-diff.py: deterministic context collector
- schemas/review-result.json: output contract

## Safety
The agent can suggest changes but cannot merge PRs, modify production systems, or bypass approvals.

## Definition of Done
- Changed files analyzed
- Findings contain evidence
- Tests and validation status recorded
- Human approval required for high-risk actions

## Verification

Run `python scripts/collect-diff.py` from a synthetic Git repository, validate the produced handoff against `schemas/review-result.json`, and independently reproduce all reported repository checks. A successful collection is not approval to merge.
