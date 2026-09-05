# Agent and Tool Misexecution Response

## Purpose
Contain and investigate AI agents that execute incorrect, excessive, unauthorized, or unsafe tool actions.

## When to use
Use for unexpected writes, repeated tool loops, privilege misuse, wrong recipients, external side effects, or autonomous actions outside intended scope.

## Inputs
Agent trace, tool calls, arguments, credentials scope, policy decisions, approvals, memory/state, execution logs.

## Preconditions
Ability to disable or restrict tools without destroying evidence.

## Context to inspect
Tool registry, authorization, scopes, allowlists, confirmation gates, retries, idempotency, planner state, memory, queue/backlog.

## Core knowledge
Agent incidents combine probabilistic planning with deterministic side effects. Tool authorization must be enforced independently of model intent.

## Procedure
1. Disable or gate risky tools.
2. Stop queued autonomous executions.
3. Enumerate completed and pending side effects.
4. Identify affected accounts/resources.
5. Preserve complete traces and authorization decisions.
6. Determine whether failure came from planning, tool schema, state, policy, or permissions.
7. Reverse safe reversible actions.
8. Rotate credentials if exposure is suspected.
9. Add execution constraints or approvals.
10. Replay in a sandbox before restoration.

## Decision points
Prefer read-only mode when diagnosis is incomplete. Require human approval for irreversible actions during recovery.

## Common failure patterns
Only disabling the model while queues continue, trusting prompt-level restrictions as authorization, retrying non-idempotent tools, and losing action history.

## Verification
No unauthorized tools remain executable; queued work is accounted for; sandbox replay respects permissions and stop conditions.

## Expected output
Contained agent, side-effect inventory, root-cause hypothesis, remediation, and recovery evidence.

## Stop conditions
Escalate on financial, legal, physical, security, or privacy-impacting actions.