# Agent Tool Misuse Detection

## Purpose
Detect unsafe or unauthorized tool execution by AI agents, including privilege abuse, unexpected side effects, destructive actions, and attacker-driven tool chaining.

## When to use
Use for agents that call APIs, databases, browsers, code runners, ticketing systems, cloud resources, or other external tools.

## Inputs
Tool-call logs, agent plans, user/session identity, authorization decisions, tool scopes, arguments, results, approval events, and environment metadata.

## Preconditions
Tool execution is auditable and significant actions carry identity and authorization context.

## Context to inspect
Inspect tool registry, permissions, approval gates, sandbox boundaries, agent memory, execution retries, service credentials, and side-effecting operations.

## Core knowledge
Tool misuse is defined by capability, context, and authorization. The same action can be benign for one role and critical for another. Detection should emphasize attempted or achieved side effects rather than model text alone.

## Procedure
1. Classify tools by privilege and possible impact.
2. Identify dangerous argument patterns and sensitive targets.
3. Establish expected tool-call sequences for common workflows.
4. Detect unapproved privileged actions, unusual chaining, repeated denied calls, scope expansion, and destructive operations.
5. Correlate calls with initiating user, session, prompt, and agent state.
6. Add stronger controls around irreversible actions.
7. Route high-impact anomalies to immediate containment.
8. Test with indirect prompt injection and compromised-session scenarios.
9. Tune for legitimate automation and maintenance workflows.

## Decision points
Block when an unauthorized call can cause material harm. Alert-only may be appropriate for unusual but reversible operations. Human approval is preferable when business context is required to judge legitimacy.

## Common failure patterns
Logging only final tool results, omitting arguments, failing to identify the initiating principal, treating retries as independent events, and allowing broad credentials that obscure authorization boundaries.

## Verification
Implemented means tool calls are classified and monitored. Verified means simulated unauthorized and chained actions are detected with enough context for responders to reconstruct the sequence.

## Expected output
Tool-risk classifications, detection rules, escalation logic, and tested response mappings.

## Stop conditions
Escalate when containment requires disabling shared production credentials, when irreversible actions occurred, or when tool audit data is incomplete.