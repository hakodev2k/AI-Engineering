# Agent Change Blast Radius Gate

Purpose: evaluate the impact surface of proposed changes before implementation.

## Goals

- Identify affected systems, modules, APIs, data contracts, and operational risks.
- Prevent narrow fixes that create hidden production failures.
- Provide evidence for approval decisions.

## Package Components

- config: scoring model
- rules: safety and approval boundaries
- skills: impact analysis guidance
- subagents: blast radius reviewers
- workflows: change assessment flow
- hooks: pre-change checks
- scripts: repository inspection helpers
- knowledge: engineering principles
- verification: package validation

## Run

Requires Git and Bash. Run the scripts with the target repository as the current working directory; they are read-only and do not stage or modify files.

```bash
bash path/to/agent-change-blast-radius-gate/scripts/analyze-change.sh origin/main
bash path/to/agent-change-blast-radius-gate/hooks/pre-change-check.sh
```

`scripts/analyze-change.sh` prints the diff statistic and changed paths from the optional base revision (default `HEAD~1`) to `HEAD`. `hooks/pre-change-check.sh` prints the working-tree status. Exit `0` means Git completed, not that the blast radius is safe; an invalid repository/revision or Git failure is nonzero.

## Verification

Review the emitted paths against `config/`, `rules/`, and `workflows/`; capture affected contracts, data, deployment, security, and operational surfaces. The package is verified only when `verification/` is completed with fresh diff evidence and any high-risk impact has an owner and approval.
