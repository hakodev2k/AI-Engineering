# Regulatory Obligations Mapping

## Purpose
Translate applicable AI, privacy, consumer, sector, and safety obligations into actionable governance requirements and evidence.

## When to use
Use for new jurisdictions, regulated use cases, major releases, audits, or regulatory changes.

## Inputs
System facts, deployment geography, user geography, sector, data classes, role in AI value chain, current legal interpretations.

## Preconditions
Engage qualified legal/compliance owners for authoritative interpretation.

## Procedure
1. Establish system facts and jurisdictions.
2. Identify organizational role for each regime.
3. Build an applicability matrix.
4. Decompose applicable duties into testable requirements.
5. Map each requirement to lifecycle controls and accountable owners.
6. Identify required documentation, notices, records, assessments, and retention.
7. Detect conflicts or duplicated controls and rationalize them.
8. Record legal source, interpretation owner, effective date, and uncertainty.
9. Implement change monitoring.
10. Reassess when system facts or law change.

## Decision points
Use the strictest common control only when it satisfies all relevant obligations without obscuring jurisdiction-specific requirements.

## Common failure patterns
Treating frameworks as law, stale legal mappings, missing value-chain roles, requirements without evidence, silent assumptions about geography.

## Verification
Legal/compliance owner validates applicability; sample obligations trace to implemented controls and retained evidence.

## Expected output
Versioned obligation-control-evidence matrix.

## Stop conditions
Escalate unresolved legal interpretation, cross-border conflict, or obligations requiring formal counsel.