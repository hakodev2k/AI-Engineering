# Planning and Task Decomposition

## Purpose
Turn complex goals into bounded executable steps while avoiding unnecessary agentic planning.

## When to use
Use for multi-step tasks with dependencies, uncertain ordering, or tool interaction.

## Inputs
Goal, constraints, available tools, dependencies, deadlines, budgets, completion criteria.

## Context to inspect
Existing workflow conventions, tool capabilities, side effects, prior failures, and approval requirements.

## Core knowledge
Plans are hypotheses that should be revised from evidence. Good decomposition minimizes irreversible actions, exposes dependencies, and creates checkpoints.

## Procedure
1. Restate the goal as measurable outcomes.
2. Identify known constraints and unknowns.
3. Separate information gathering from mutation.
4. Decompose into independently verifiable steps.
5. Order dependencies and irreversible actions.
6. Assign tool, budget, and expected evidence to each step.
7. Add checkpoints before high-impact actions.
8. Re-plan only when observations invalidate assumptions.
9. Stop when completion criteria are met.
10. Preserve a concise execution trace.

## Decision points
Use fixed workflows for stable tasks; dynamic planning for genuine uncertainty. Prefer shallow plans that can be revised over speculative long plans.

## Common failure patterns
Planning forever, decomposing trivial tasks, acting before prerequisites, repeating failed steps, and losing the original objective.

## Verification
Confirm every step maps to an outcome, dependencies are respected, failures trigger bounded re-planning, and termination is deterministic.

## Expected output
A concise executable plan with checkpoints, evidence requirements, and stop rules.

## Stop conditions
Stop when essential prerequisites are missing or the next action exceeds authorization.