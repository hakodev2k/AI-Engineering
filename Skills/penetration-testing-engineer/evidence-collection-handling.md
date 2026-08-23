# Evidence Collection and Handling

## Purpose
Collect enough evidence to make findings reproducible and defensible while minimizing exposure of credentials, personal data, secrets, and customer information.

## When to use
Use throughout every assessment and especially when findings involve sensitive responses, privileged access, or production systems.

## Inputs
Engagement evidence policy, finding context, test artifacts, screenshots/requests/logs, retention period, and approved storage.

## Context to inspect
Inspect data classification, secret content, identifiers, timestamps, target/version context, access permissions, and whether evidence is necessary to prove the claim.

## Core knowledge
Evidence should support reproducibility, affected scope, and impact. Collect the minimum necessary. Redaction must preserve technical meaning. Chain-of-custody rigor should match legal/compliance needs.

## Procedure
1. Define the claim each artifact supports.
2. Capture timestamps, target context, actor/role, and relevant request/response details.
3. Prefer test data over real sensitive records.
4. Redact secrets and unrelated personal/customer data.
5. Store artifacts only in approved encrypted locations.
6. Use stable naming and map artifacts to findings.
7. Record transformations such as redaction.
8. Restrict access to engagement personnel.
9. Validate that evidence remains sufficient after redaction.
10. Delete evidence according to retention commitments.

## Decision points
Do not capture a full dataset when a schema, count, or controlled record proves the issue. Preserve original evidence only when required and securely controlled.

## Common failure patterns
Screenshots containing tokens, copying production databases, evidence without timestamps/context, storing artifacts in personal locations, and indefinite retention.

## Verification
A reviewer can reproduce the conclusion from sanitized evidence, while sensitive information is minimized and retention/access requirements are satisfied.

## Expected output
Traceable, minimal, sanitized evidence linked to each validated finding.

## Stop conditions
Stop collection when evidence exceeds necessity, contains prohibited data, or approved secure storage is unavailable.