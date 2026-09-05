# Agent and Tool Release Safety

## Purpose
Release agentic capabilities and tool integrations without granting uncontrolled authority, duplicate side effects, or unbounded execution.

## When to use
Use when adding tools, changing agent planners, modifying tool schemas, expanding permissions, changing autonomy levels, or enabling new external actions.

## Inputs
Agent workflow, tool registry, authorization model, scopes, approval gates, idempotency rules, retry policy, sandbox tests.

## Preconditions
Every external side effect has an accountable owner and enforceable authorization boundary outside the model.

## Context to inspect
Tool permissions, credential scopes, confirmation requirements, queues, retries, memory/state, rate limits, kill switches, audit logs, and rollback controls.

## Core knowledge
Prompt instructions are not authorization. Agent releases require deterministic permission enforcement, bounded loops, side-effect isolation, and clear human-control points for high-impact actions.

## Procedure
1. Enumerate every tool and side effect reachable by the candidate agent.
2. Verify least-privilege credentials and server-side authorization.
3. Test invalid, ambiguous, and adversarial tool arguments.
4. Define maximum steps, retries, spend, and execution duration.
5. Confirm idempotency or duplicate-action protection.
6. Require approval for irreversible or high-impact actions.
7. Exercise kill switches and queue cancellation.
8. Run sandbox and shadow tests with side effects suppressed.
9. Canary low-risk traffic with full audit logging.
10. Expand only after action accuracy and denial behavior meet thresholds.

## Decision points
Prefer read-only tools during early rollout. Separate planning from execution when human review materially reduces risk.

## Common failure patterns
Model-enforced permissions, retrying non-idempotent actions, broad credentials, hidden background queues, and enabling many tools simultaneously.

## Verification
Audit representative tool calls, denied actions, duplicate protection, approval gates, and kill-switch behavior.

## Expected output
A tool-release safety record with permissions, limits, test evidence, rollout constraints, and recovery controls.

## Stop conditions
Stop when unauthorized, irreversible, financial, legal, physical, or privacy-sensitive actions cannot be reliably bounded.