# AI PR Risk Gate Agent

Reusable AI engineering kit for automated pull request risk assessment.

Purpose: detect architectural, security, performance, compatibility, and testing risks before merge.

## Purpose

Provide a lightweight risk-review workflow and read-only Git diff preflight before a human merge decision.

Workflow:
Trigger PR -> collect diff/context -> analyze -> review -> verify -> report.

Components:
- skills: risk analysis procedures
- rules: review boundaries
- subagents: specialist reviewers
- workflows: bounded review process
- hooks: deterministic checks
- scripts: repository validation

Dangerous actions require human approval.

## Prerequisites, run, and verification

Requires Git and Bash. From the target repository root, print the current uncommitted diff summary:

```bash
bash path/to/ai-pr-risk-gate-agent/scripts/check-diff.sh
```

Exit `0` means Git produced the statistic; exit `1` means the current directory is not a Git repository. An empty statistic may simply mean there is no uncommitted diff, so a PR adapter must explicitly compare immutable base/head revisions. Follow `workflows/`, apply `rules/`, run repository-native checks, and retain evidence for every blocking or advisory risk.
