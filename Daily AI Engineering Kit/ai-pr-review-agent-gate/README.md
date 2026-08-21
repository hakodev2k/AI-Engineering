# AI PR Review Agent Gate

Reusable AI engineering package for evidence-based pull request review.

## Problem
AI code review often produces generic comments. This package creates a bounded workflow that reviews changes against repository rules, tests, security constraints, and architecture decisions.

## Workflow
Trigger -> Context Collection -> Review Plan -> Specialized Review -> Findings Validation -> Human Decision

## Components
- skills: review procedures
- rules: enforceable boundaries
- subagents: separated reviewers
- workflows: bounded review lifecycle
- hooks: deterministic checks
- scripts: validation helpers

## Safety
Agents do not merge code, approve PRs, change production systems, or bypass required reviews.

## Done Criteria
- Changed files inspected
- Findings include evidence
- False positives reduced through validation
- Required checks completed
