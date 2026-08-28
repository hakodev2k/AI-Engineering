# Detection Strategy Rules

## Purpose
Define an evidence-driven threat detection program aligned to material attack paths and business risk.

## Scope
Applies to detection planning, coverage priorities, detection ownership, and lifecycle decisions.

## MUST
- Detection priorities MUST map to documented threats, critical assets, and plausible attack paths.
- Every production detection MUST have an owner, severity rationale, expected signal source, response expectation, and review date.
- Coverage gaps for high-impact techniques MUST be documented with compensating controls or remediation plans.
- Detection changes MUST preserve traceability to the risk or threat they address.

## MUST NOT
- MUST NOT treat rule count as a proxy for security coverage.
- MUST NOT deploy detections solely because a vendor template exists.
- MUST NOT leave critical detections without accountable ownership.

## SHOULD
- Coverage SHOULD be organized by attack technique, asset class, and business impact.
- Senior review SHOULD prioritize quality, observability, and operational usefulness over volume.

## Exceptions
Exceptions require documented rationale, affected risk, compensating control, owner, and expiration or review date.

## Verification
Review the detection catalog, threat model mappings, ownership metadata, coverage reports, and open gap records.