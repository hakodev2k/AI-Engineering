# AI Context Drift Prevention Agent Kit

## Problem
AI coding agents lose reliability when repository context becomes stale, incomplete, or mixed with assumptions.

## Purpose
A reusable package for maintaining evidence-based context before AI implementation tasks.

## Copy and install

Copy this entire directory into the consumer repository and keep `hooks/`, `rules/`, `scripts/`, `skills/`, `subagents/`, and `workflows/` together. No third-party Python package is required; the executable preflight needs Git and Bash.

## Workflow
Trigger -> Context Scan -> Evidence Map -> Plan -> Execute -> Verify

## Components
- skills: context collection procedures
- rules: safety boundaries
- subagents: exploration and verification roles
- workflows: bounded execution
- scripts: deterministic checks

## Verification
Success requires repository evidence, validated outputs, and completed checks.

## Run

Run the deterministic repository preflight with Git and Bash installed:

```bash
bash scripts/validate-context.sh /path/to/target-repository
```

Exit `0` confirms the supplied directory exists and has a Git repository marker; exit `1` means the path is absent and exit `2` means the marker is missing. This is only a presence check. Record the current revision, branch/base, worktree status, instruction sources, and invalidation event before treating context as fresh.
