# Separation of Duties Rules

## Purpose
Prevent a single identity from accumulating conflicting capabilities that enable fraud, bypass, or unreviewed high-risk change.

## Scope
Toxic entitlement combinations, approval chains, production administration, financial controls, security administration, and privileged workflows.

## MUST
- Materially conflicting duties MUST be identified in an explicit policy or access model.
- Access evaluation MUST consider direct, inherited, temporary, and federated entitlements together.
- Detected toxic combinations MUST be blocked or remediated unless a documented compensating control is approved.
- Changes to conflict definitions MUST be reviewed by relevant security and business owners.

## MUST NOT
- MUST NOT rely on job title alone to determine duty conflicts.
- MUST NOT allow the same actor to request, approve, and execute a high-risk access grant when independent control is required.

## SHOULD
- Automate preventive checks for well-defined toxic combinations and use detective controls for context-dependent conflicts.

## Exceptions
Exceptions require business necessity, risk analysis, compensating controls, expiry, monitoring, and independent approval.

## Verification
Run entitlement-combination analysis, test approval workflows, inspect exception records, and sample effective access.