# Audit Logging and Recordkeeping

## Purpose
Design compliance-grade records that make AI decisions, changes, approvals, and operational events reconstructable without collecting unnecessary sensitive data.

## When to use
Use for regulated AI workflows, model governance, high-impact decisions, audits, incident response, and control testing.

## Inputs
System architecture, decision workflow, model/prompt versions, user identifiers, tool actions, approval events, retention requirements, privacy constraints.

## Preconditions
Logging objectives and data-classification rules are defined.

## Context to inspect
Application logs, model gateway traces, audit stores, change management, IAM events, retention policies, incident procedures, data minimization requirements.

## Core knowledge
Compliance records should support attribution, chronology, version reconstruction, and control evidence while minimizing prompt/output retention where sensitive data creates additional risk. Audit logs should be tamper-evident and access-controlled.

## Procedure
1. Define events requiring auditability.
2. Capture model, prompt, policy, and configuration versions.
3. Record actor, authorization, and material action.
4. Include correlation identifiers across system boundaries.
5. Separate operational telemetry from protected audit evidence.
6. Minimize or redact sensitive content where possible.
7. Set retention by legal and business requirement.
8. Protect integrity and restrict access.
9. Test retrieval for representative audit questions.
10. Review logging when workflows change.

## Decision points
Store content only when needed for a defined evidence purpose; otherwise prefer hashes, metadata, structured decision factors, or restricted sampling.

## Common failure patterns
Logging everything indefinitely, missing model/prompt versions, mutable audit trails, no cross-service correlation, and retaining sensitive prompts without justification.

## Verification
Reconstruct a sample decision or deployment from records and verify integrity, access, retention, and version evidence.

## Expected output
An audit logging specification with event schema, retention, access, integrity controls, and evidence mapping.

## Stop conditions
Escalate when required evidence conflicts with privacy or secrecy constraints and no approved minimization approach exists.