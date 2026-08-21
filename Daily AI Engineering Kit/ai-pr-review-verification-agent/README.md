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
