# Automation and AI Assistance Rules

## Purpose
Use AI and automation to accelerate incident response without allowing unverified automation to exceed responder authority.

## Scope
Applies to AI-assisted triage, summarization, diagnosis, remediation generation, runbook execution, and automated containment.

## MUST
- AI-generated incident conclusions MUST be validated against source evidence before consequential decisions rely on them.
- Automated actions MUST have explicit scope, permissions, auditability, and failure handling.
- High-risk production actions MUST retain required human approval even when proposed by an AI agent.
- Automated summaries MUST preserve uncertainty and distinguish facts from hypotheses.
- Tool-using incident agents MUST operate with least privilege and bounded execution scope.
- Automation failures or unexpected actions MUST be observable and independently stoppable.

## MUST NOT
- AI agents MUST NOT fabricate evidence, approvals, completed actions, or external-system state.
- Automation MUST NOT silently rotate secrets, delete data, destroy infrastructure, weaken security controls, or break public contracts without authorized approval.
- AI-generated commands MUST NOT be executed in production without review appropriate to their risk.

## SHOULD
- Use AI for evidence organization, hypothesis generation, query assistance, and repetitive analysis where humans can verify outputs.
- Prefer dry-run and read-only modes during investigation.

## Exceptions
Pre-approved automated containment may execute without per-event approval only within explicitly authorized boundaries and with audit logging.

## Verification
Inspect agent/tool permissions, execution logs, approval gates, source citations, stop controls, and samples of AI-assisted decisions.