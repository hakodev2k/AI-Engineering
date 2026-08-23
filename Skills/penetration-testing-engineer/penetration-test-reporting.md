# Penetration Test Reporting

## Purpose
Turn technical testing evidence into a report that enables executives to understand risk and engineers to reproduce, prioritize, and remediate findings.

## When to use
Use for interim critical notifications, draft review, final assessment delivery, and remediation handoff.

## Inputs
Scope, methodology, validated findings, evidence, severity rationale, limitations, and remediation context.

## Context to inspect
Inspect audience, reporting standard, confidentiality requirements, asset naming, remediation ownership, and whether sensitive exploit details need restricted distribution.

## Core knowledge
A useful finding states condition, affected scope, prerequisites, evidence, impact, root cause, and actionable remediation. Reports should distinguish tested coverage from assurance claims and disclose material limitations.

## Procedure
1. Restate scope and assessment dates accurately.
2. Summarize methodology and meaningful limitations.
3. Group duplicate symptoms by root cause where appropriate.
4. Write each finding with clear title and severity rationale.
5. Provide concise reproducible evidence using sanitized artifacts.
6. Explain realistic impact without sensationalism.
7. Recommend durable fixes and compensating controls.
8. Separate strategic themes from individual findings.
9. Peer-review technical accuracy and sensitive content.
10. Deliver through approved channels and track questions/corrections.

## Decision points
Use separate executive and technical detail when audiences differ. Restrict high-risk exploit details if broad distribution creates unnecessary exposure.

## Common failure patterns
Raw tool dumps, vague remediation, unsupported impact, inconsistent terminology, excessive sensitive data, and claiming untested systems are secure.

## Verification
Every finding maps to evidence and affected scope, severity is justified, remediation addresses root cause, and limitations are explicit.

## Expected output
A concise executive summary plus technically reproducible, prioritized findings and remediation guidance.

## Stop conditions
Do not distribute a report containing unredacted secrets, unvalidated critical claims, incorrect scope, or unauthorized sensitive details.