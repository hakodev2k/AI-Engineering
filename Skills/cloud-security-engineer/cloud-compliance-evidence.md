# Cloud Compliance Evidence

## Purpose
Translate security requirements into reliable cloud control evidence without confusing compliance with actual security.

## When to use
Use for audits, control assessments, customer assurance, or continuous compliance automation.

## Inputs
Control framework, cloud architecture, policies, configurations, logs, tickets, ownership, and evidence periods.

## Context to inspect
Inspect actual technical enforcement, evidence source authority, timestamps, scope, exceptions, and whether controls operate continuously or periodically.

## Core knowledge
Evidence must demonstrate control design and operation for the required scope and period. Screenshots are weaker than reproducible provider/API evidence.

## Procedure
1. Interpret control objective and scope.
2. Map it to concrete cloud mechanisms.
3. Identify authoritative evidence sources.
4. Automate collection where reliable.
5. Preserve timestamps and scope metadata.
6. Sample operational evidence where needed.
7. Record exceptions and compensating controls.
8. Validate evidence with control owners.
9. Keep security remediation separate from audit packaging.

## Decision points
Prefer machine-readable continuous evidence for configuration controls; use human attestations only where technical evidence cannot establish operation.

## Common failure patterns
Stale screenshots, evidence from wrong accounts, proving configuration but not operation, hiding exceptions, and optimizing only for audit appearance.

## Verification
An independent reviewer can map each assertion to current, scoped, authoritative evidence.

## Expected output
Traceable control-to-evidence package plus clearly identified gaps and exceptions.

## Stop conditions
Escalate when requested evidence exposes sensitive data, control scope is ambiguous, or evidence contradicts claimed compliance.