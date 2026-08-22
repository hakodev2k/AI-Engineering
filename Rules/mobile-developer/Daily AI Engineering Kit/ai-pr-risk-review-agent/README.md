# AI PR Risk Review Agent

Reusable workflow for AI agents to review pull request risk before merge.

## Problem
AI-generated changes can compile while introducing API, security, database, or regression risks.

## Workflow
Trigger -> Gather Context -> Risk Analysis -> Independent Review -> Verification -> Report

## Copy and install

Copy this whole directory into the consumer repository. Python 3.10+ and the standard library are sufficient. Keep the schema, workflow, and validator paths together.

## Run

From the target repository root, run `python path/to/ai-pr-risk-review-agent/scripts/validate-repository.py`. It prints the current unstaged diff statistic and working-tree status and exits nonzero when Git fails; it accepts no arguments and does not fetch a PR. A host adapter must separately supply immutable base/head context before following `workflows/pr-review.md`.

## Components
- skills/pr-risk-analysis.md
- rules/review-boundaries.md
- subagents/risk-reviewer.md
- workflows/pr-review.md
- hooks/pre-merge-validation.md
- scripts/validate-repository.py
- schemas/review-result.json

## Safety
The agent never merges code, changes production, edits secrets, or bypasses approval gates.

## Verification
Success requires evidence: build/test results, changed-file inspection, findings with evidence, and approval for blocking risks.
