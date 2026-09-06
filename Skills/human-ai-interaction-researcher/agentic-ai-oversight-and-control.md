# Agentic AI Oversight and Control

## Purpose
Evaluate whether people can supervise, constrain, interrupt, inspect, and take responsibility for AI agents that plan or execute multi-step actions.

## When to use
Use for agents with tool access, delegated workflows, background execution, computer use, code execution, transactions, or other side effects.

## Inputs
Agent capabilities, tools, permissions, action space, approval model, logs, task goals, risk classes, and user roles.

## Context to inspect
Inspect planning visibility, permission boundaries, confirmation points, execution logs, checkpoints, rollback, timeouts, tool errors, and downstream effects.

## Core knowledge
Meaningful human control requires timely visibility and effective intervention, not merely a nominal approval button. Oversight burden rises with action volume and opacity. Approval fatigue can make human-in-the-loop controls ineffective.

## Procedure
1. Map the agent's possible actions and external side effects.
2. Classify actions by impact, reversibility, uncertainty, and required authority.
3. Identify where users need preview, approval, notification, or post-hoc audit.
4. Test whether users understand the scope of delegated authority.
5. Observe monitoring behavior during long-running or background tasks.
6. Inject representative plan changes, tool failures, ambiguous goals, and risky actions.
7. Measure whether users notice and intervene before unacceptable consequences.
8. Evaluate pause, cancel, modify, revoke, rollback, and resume controls.
9. Test approval fatigue under realistic action volume.
10. Assess whether logs support reconstruction and accountability.
11. Recommend control placement proportional to risk.

## Decision points
Require pre-action approval for consequential or irreversible operations; use bounded autonomy for low-risk reversible actions; use post-action review when latency matters and rollback is reliable.

## Common failure patterns
Blanket confirmation dialogs, hidden scope expansion, irreversible execution before notification, insufficient audit trails, unclear agent state, and users approving actions they cannot evaluate.

## Verification
Users must successfully constrain and recover representative agent behaviors. Audit records must show what was proposed, approved, executed, changed, and rolled back.

## Expected output
An oversight-control assessment with action classes, intervention requirements, observed supervision failures, and design recommendations.

## Stop conditions
Stop when agent permissions exceed the study environment, rollback is unavailable for high-impact tests, or accountability for autonomous actions is unresolved.