# AI PR Risk Gate Agent

Reusable AI engineering kit for automated pull request risk assessment.

Purpose: detect architectural, security, performance, compatibility, and testing risks before merge.

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