# AI PR Risk Review Agent

Reusable workflow for AI agents to review pull request risk before merge.

## Problem
AI-generated changes can compile while introducing API, security, database, or regression risks.

## Workflow
Trigger -> Gather Context -> Risk Analysis -> Independent Review -> Verification -> Report

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
