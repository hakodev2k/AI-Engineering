# Agent Audit Logging

## Purpose
Create security-grade audit evidence for agent decisions, delegated actions, tool calls, approvals, and policy enforcement without unnecessarily recording sensitive prompt content.

## When to use
Use for production agents that perform privileged, external, financial, administrative, security-sensitive, or regulated actions.

## Inputs
Agent architecture, identity model, tool contracts, policy engine events, approval flows, data classifications, retention requirements, and incident-response needs.

## Preconditions
Identify which events must be attributable, reconstructable, tamper-evident, and retained.

## Context to inspect
Application logs, traces, model-call telemetry, tool gateways, authorization services, SIEM pipelines, log storage, redaction, retention, and time synchronization.

## Core knowledge
Operational traces and audit logs serve different purposes. Audit evidence should capture who initiated an action, which agent identity acted, what policy allowed it, exact target and high-level parameters, approvals, and outcome. Sensitive prompts, secrets, and personal data should be minimized.

## Procedure
1. Define security-relevant event types.
2. Assign stable correlation IDs across user request, agent run, subagent delegation, and tool execution.
3. Record initiating principal, agent identity, tenant, target resource, action type, policy result, and outcome.
4. Record approval identities and bound-action references where applicable.
5. Preserve tool-call sequence and delegation provenance.
6. Redact secrets and minimize sensitive content.
7. Protect log integrity and restrict modification/deletion permissions.
8. Synchronize timestamps across services.
9. Define retention by legal, operational, and privacy requirements.
10. Create queries for privilege escalation, unusual tool usage, exfiltration attempts, and failed policy checks.
11. Test audit completeness during successful and failed workflows.
12. Verify investigators can reconstruct a representative incident from logs alone.

## Decision points
Store full content only when justified by investigation needs and privacy policy. Prefer structured security metadata over indiscriminate prompt capture.

## Common failure patterns
Logging only model text, missing caller identity, losing delegation lineage, storing raw credentials, mutable logs, and no correlation across tool calls.

## Verification
Reconstruct representative privileged actions end to end and confirm sensitive fields are absent or redacted according to policy.

## Expected output
An audit event schema, retention/access policy, investigation queries, and evidence-completeness tests.

## Stop conditions
Escalate when required events cannot be attributed to a principal or logs cannot be protected from unauthorized alteration.