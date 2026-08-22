# AI PR Change Verification Gate

Reusable AI engineering package for verifying pull-request changes with evidence before merge.

## Problem
AI-generated code can compile while still violating requirements, architecture, security, or regression expectations.

## Purpose
Provide a bounded workflow where agents inspect context, review changes, run deterministic checks, and produce an approval-ready verification report.

## Components
- skills: repeatable review procedures
- subagents: separated responsibilities
- workflows: bounded lifecycle
- scripts: deterministic validation

## Workflow
Trigger -> Gather diff/context -> Plan review -> Analyze -> Test -> Verify -> Report

## Safety
No automatic merge, production deployment, destructive migration, secret changes, or permission escalation.

## Done Criteria
- Diff reviewed
- Evidence collected
- Checks executed
- Risks documented
- Verification report generated

## Run

Requires Git and Bash. Run from the target repository root:

```bash
bash path/to/ai-pr-change-verification-gate/scripts/validate-repo.sh
```

The script runs `git diff --check`. Exit `0` means Git found no whitespace/conflict-marker errors in the current diff; nonzero means the repository preflight or diff check failed. It does not build, test, inspect acceptance criteria, or review committed changes outside the selected diff.

## Verification

Follow `workflows/pr-verification-flow.md` and `skills/change-verification.md`, bind evidence to immutable base/head revisions, and use `subagents/verification-agent.md` for independent review.
