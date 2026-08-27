# Separation of Duties
## Purpose
Prevent toxic combinations of authority and unreviewed high-impact actions.
## Scope
Role design, entitlement combinations, approval chains, and privileged workflows.
## MUST
- Material toxic-access combinations MUST be identified from business and security risk.
- Preventive or detective controls MUST exist for prohibited combinations.
- Exceptions MUST identify the exact conflicting access and compensating oversight.
## MUST NOT
- The requester MUST NOT be the sole approver of their own sensitive privilege.
- SoD controls MUST NOT be bypassed by assigning equivalent permissions through alternate groups.
## SHOULD
- Test effective permissions rather than role names alone.
## Exceptions
Require business owner and risk approval, expiry, monitoring, and periodic reassessment.
## Verification
Analyze effective entitlements, approval records, exception inventory, and conflict-detection results.