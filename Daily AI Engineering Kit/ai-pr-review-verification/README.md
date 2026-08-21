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
