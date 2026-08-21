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
