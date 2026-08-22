# Work Intake and Decomposition

## Purpose
Convert ambiguous delivery requests into owned, sequenced, verifiable work without losing product intent.

## Trigger
New feature, cross-team change, incident follow-up, technical debt item, or delivery request involving multiple contributors.

## Inputs
- objective and business outcome
- acceptance criteria
- constraints and deadlines
- impacted systems/teams
- known risks and dependencies

## Preconditions
Do not begin execution until critical ambiguity, external dependency, and approval requirements are visible.

## Procedure
1. Restate the requested outcome and measurable success condition.
2. Separate functional behavior, non-functional requirements, rollout needs, and operational work.
3. Identify workstreams by bounded ownership rather than arbitrary file count.
4. Map dependencies and determine what can execute in parallel.
5. Assign one accountable owner per workstream.
6. Define verification evidence for every workstream before implementation starts.
7. Mark approval gates for production, security-sensitive, destructive, contractual, or externally visible changes.
8. Create integration checkpoints and a final system-level verification stage.

## Decision rules
- Split when work has independent ownership, evidence, or failure modes.
- Keep together when splitting would create hidden coupling or duplicate context.
- Prefer dependency-first sequencing over deadline-driven wishful parallelism.
- Escalate when an external dependency threatens the committed outcome.

## Outputs
A delivery plan containing workstreams, owners, dependencies, risks, checkpoints, verification evidence, and stop conditions.

## Quality gate
Another engineer must be able to execute one workstream without guessing its objective, boundaries, or done condition.

## Stop conditions
Stop and escalate if the requested outcome conflicts with safety, compliance, architecture constraints, or cannot be verified.