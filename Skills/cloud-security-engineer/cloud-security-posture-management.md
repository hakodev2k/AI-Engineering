# Cloud Security Posture Management

## Purpose
Continuously identify, prioritize, and remediate cloud misconfigurations using risk context rather than raw finding counts.

## When to use
Use for CSPM rollout, posture reviews, compliance drift, or large finding backlogs.

## Inputs
Cloud inventory, posture findings, asset criticality, exposure, identities, exceptions, and remediation ownership.

## Context to inspect
Inspect current configuration and effective exposure; validate scanner assumptions against provider APIs and IaC.

## Core knowledge
Severity alone is insufficient. Prioritize exploitable combinations involving sensitive assets, public exposure, privilege, and missing detective controls.

## Procedure
1. Establish asset ownership and criticality.
2. Normalize duplicate findings.
3. Validate high-impact findings manually.
4. Enrich with exposure and privilege context.
5. Rank attack-path risk.
6. Assign remediation owners and deadlines.
7. Fix root causes in IaC where possible.
8. Document bounded exceptions.
9. Track recurrence and mean time to remediate.

## Decision points
Automate safe deterministic fixes; require review for changes affecting availability or architecture. Accept exceptions only with compensating controls and expiry.

## Common failure patterns
Chasing scanner score, ignoring false positives, console-only fixes, permanent exceptions, and no asset ownership.

## Verification
Re-scan after remediation, compare deployed state to IaC, and confirm attack path is actually closed.

## Expected output
Risk-ranked posture backlog, durable remediations, exception records, and trend metrics.

## Stop conditions
Escalate when findings imply active compromise, remediation is destructive, or ownership cannot be established.