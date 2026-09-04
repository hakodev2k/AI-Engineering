# Train Validation Test Split Rules
## Purpose
Protect evaluation integrity through defensible dataset partitioning.
## Scope
Training, validation, test, benchmark, temporal, grouped, and holdout splits.
## MUST
- Split strategy MUST reflect leakage risks, temporal structure, entity relationships, and deployment conditions.
- Test and benchmark sets MUST be protected from optimization feedback when used for final claims.
- Related records that can leak target information MUST be grouped appropriately before splitting.
## MUST NOT
- Random splitting MUST NOT be used by default when time, identity, location, source, or sequence creates dependence.
- Holdout membership MUST NOT be altered merely to improve reported metrics.
## SHOULD
- Split logic SHOULD be deterministic and versioned.
## Exceptions
Exceptions require rationale, leakage analysis, and approval for material evaluation claims.
## Verification
Review split code, seeds, group logic, overlap checks, temporal boundaries, and contamination reports.